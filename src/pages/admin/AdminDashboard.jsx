import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteBook, getBooks, getUsers } from "../../api";
import BookCard from "../../components/BookCard";
import { deletePdf } from "../../pdfStorage";

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const [bookResponse, userResponse] = await Promise.all([getBooks(), getUsers()]);
      setBooks(bookResponse.data);
      setUsers(userResponse.data);
      setError("");
    } catch {
      setError("Could not load the admin area. Make sure JSON Server is running.");
    }
  };

  useEffect(() => { load(); }, []);

  const categories = useMemo(() => ["All", ...new Set(books.map((book) => book.category).filter(Boolean))], [books]);
  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return books.filter((book) => {
      const matchesCategory = category === "All" || book.category === category;
      const matchesSearch = !query || `${book.title} ${book.author} ${book.category} ${book.isbn}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [books, search, category]);

  const totalCopies = books.reduce((sum, book) => sum + Number(book.totalCopies || 0), 0);
  const availableCopies = books.reduce((sum, book) => sum + Number(book.availableCopies || 0), 0);
  const pdfBooks = books.filter((book) => Boolean(book.pdf || book.hasPdf)).length;

  const startAdd = () => navigate("/admin/add-book");
  const startEdit = (id) => navigate(`/admin/edit-book/${id}`);

  const remove = async (id) => {
    if (!window.confirm("Delete this book? This cannot be undone.")) return;
    try {
      await deleteBook(id);
      try { await deletePdf(id); } catch { /* PDF cleanup is local-only. */ }
      setBooks((current) => current.filter((book) => String(book.id) !== String(id)));
      setError("");
    } catch {
      setError("The book could not be deleted.");
    }
  };
const categoriesCount = new Set(
  books.map((book) => book.category).filter(Boolean)
).size;
  return (
    <section className="admin-area">
      <div className="page-head admin-page-head">
        <div><p className="eyebrow">ADMIN CONTROL CENTER</p><h1>Manage Library</h1><p className="admin-subtitle">Books, uploads, counts and management in one place.</p></div>
        <button className="btn primary" onClick={startAdd}>+ Add Book</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="stats admin-stats">
        <div><strong>{books.length}</strong><span>Total Books</span></div>
        <div><strong>{pdfBooks}</strong><span>Books With PDF</span></div>
        <div className="stat-card">
  <strong>{categoriesCount}</strong>
  <span>Categories</span>
</div>
        {/* <div><strong>{totalCopies}</strong><span>Total Copies</span></div> */}
        {/* <div><strong>{availableCopies}</strong><span>Available Copies</span></div> */}
        <div><strong>{users.length}</strong><span>Registered Users</span></div>
      </div>

      <div className="admin-books-panel">
        <div className="section-head">
          <div><p className="eyebrow">LIBRARY INVENTORY</p><h2>All Books <span>{filteredBooks.length}</span></h2></div>
          <div className="admin-filters">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..." />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
          </div>
        </div>

        {!books.length ? <div className="empty">No books have been added yet. Click <strong>+ Add Book</strong> to create the first one.</div> :
          !filteredBooks.length ? <div className="empty">No books match your search.</div> :
          <div className="grid admin-book-grid">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onDelete={remove} onEdit={startEdit} />
            ))}
          </div>}
      </div>
    </section>
  );
}
