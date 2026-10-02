
import { useEffect, useMemo, useState } from "react";
import { getBooks, deleteBook } from "../api";
import { useAuth } from "../AuthContext";
import BookCard from "../components/BookCard";

export default function Books() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("title");
  const [error, setError] = useState("");

  const load = async () => {
    try { setBooks((await getBooks()).data); }
    catch { setError("Start JSON Server on port 5000 to load books."); }
  };
  useEffect(() => { load(); }, []);

  const categories = ["All", ...new Set(books.map(b => b.category))];
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...books]
      .filter(b => category === "All" || b.category === category)
      .filter(b => `${b.title} ${b.author} ${b.category}`.toLowerCase().includes(q))
      .sort((a,b) => sort === "price" ? a.price-b.price : sort === "rating" ? b.rating-a.rating : a.title.localeCompare(b.title));
  }, [books, search, category, sort]);

  const remove = async (id) => {
    if (!confirm("Delete this book?")) return;
    await deleteBook(id);
    setBooks(prev => prev.filter(b => String(b.id) !== String(id)));
  };

  return (
    <section>
      <div className="page-head">
        <div><p className="eyebrow">YOUR COLLECTION</p><h1>Explore Books</h1></div>
        <span className="count">{filtered.length} books</span>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="filters">
        <input placeholder="Search by title, author or category..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select>
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="title">Sort: Title</option><option value="rating">Sort: Rating</option><option value="price">Sort: Price</option>
        </select>
      </div>
      <div className="grid">{filtered.map(book=><BookCard key={book.id} book={book} onDelete={user?.role==="admin"?remove:undefined}/>)}</div>
    </section>
  );
}
