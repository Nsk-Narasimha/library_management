
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function BookCard({ book, onDelete }) {
  const { user, toggleFavorite } = useAuth();
  const favorite = user?.favorites?.includes(String(book.id));

  return (
    <article className="book-card">
      <img src={book.coverImage} alt={book.title} />
      <div className="book-card-body">
        <div className="book-meta">{book.category} · ⭐ {book.rating}</div>
        <h3>{book.title}</h3>
        <p className="author">by {book.author}</p>
        <p className="muted">{book.description}</p>
        <div className="book-bottom">
          <strong>₹{book.price}</strong>
          <span>{book.availableCopies > 0 ? "Available" : "Unavailable"}</span>
        </div>
        <div className="card-actions">
          <Link className="btn secondary" to={`/books/${book.id}`}>Details</Link>
          <button className={`icon-btn ${favorite ? "fav" : ""}`} onClick={() => toggleFavorite(book.id)}>
            {favorite ? "♥" : "♡"}
          </button>
          {user?.role === "admin" && (
            <>
              <Link className="btn primary" to={`/admin/edit-book/${book.id}`}>
                Edit
              </Link>
              <button className="btn danger" onClick={() => onDelete(book.id)}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
