import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { downloadStoredPdf } from "../pdfStorage";

export default function BookCard({ book, onDelete, onEdit }) {
  const { user, toggleFavorite } = useAuth();

  const handleDownload = async () => {
    try {
      await downloadStoredPdf(book.id, book.pdfFileName || `${book.title}.pdf`);
    } catch {
      window.alert("This PDF is not available in this browser. Please upload it again from Admin.");
    }
  };

  const handleFavorite = async () => {
    try {
      await toggleFavorite(book.id);
    } catch {
      window.alert("Your favorite could not be updated. Check that JSON Server is running.");
    }
  };
  const favorite = user?.favorites?.includes(String(book.id));

  return (
    <article className="book-card">
      <img src={book.coverImage} alt={book.title} loading="lazy" />
      <div className="book-card-body">
        <div className="book-meta">{book.category} · ⭐ {book.rating}</div>
        <h3>{book.title}</h3>
        <p className="author">by {book.author}</p>
        <p className="muted">{book.description}</p>

        <div className="book-bottom">
          <strong className="free-badge">FREE</strong>
          {/* <span>{book.pages} pages</span> */}
        </div>

        <div className="card-actions">
          <Link
  className="btn primary"
  to={`/books/${book.id}`}
>
  📖 View Details
</Link>
          <button className={`icon-btn ${favorite ? "fav" : ""}`} onClick={handleFavorite} aria-label={favorite ? "Remove favorite" : "Add favorite"}>
            {favorite ? "♥" : "♡"}
          </button>
          
          {user?.role === "admin" && (onEdit ? <button className="btn secondary" onClick={() => onEdit(book.id)}>Edit</button> : <Link className="btn secondary" to="/admin">Manage</Link>)}
          {user?.role === "admin" && onDelete && (
            <button className="btn danger" onClick={() => onDelete(book.id)}>Delete</button>
          )}
        </div>
      </div>
    </article>
  );
}
