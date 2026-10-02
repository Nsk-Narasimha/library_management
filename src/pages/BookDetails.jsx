
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBook } from "../api";
import { useAuth } from "../AuthContext";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { user, toggleFavorite } = useAuth();
  useEffect(() => { getBook(id).then(r => setBook(r.data)); }, [id]);
  if (!book) return <p>Loading...</p>;
  const favorite = user?.favorites?.includes(String(book.id));
  return (
    <section className="details">
      <img src={book.coverImage} alt={book.title}/>
      <div>
        <p className="eyebrow">{book.category}</p>
        <h1>{book.title}</h1>
        <h3>by {book.author}</h3>
        <p className="hero-text">{book.description}</p>
        <div className="details-grid">
          <span>ISBN<strong>{book.isbn}</strong></span><span>Year<strong>{book.publicationYear}</strong></span>
          <span>Pages<strong>{book.pages}</strong></span><span>Rating<strong>⭐ {book.rating}</strong></span>
          <span>Language<strong>{book.language}</strong></span><span>Copies<strong>{book.availableCopies}/{book.totalCopies}</strong></span>
        </div>
        <div className="hero-actions">
          <button className="btn primary" onClick={()=>toggleFavorite(book.id)}>{favorite ? "♥ Remove Favorite" : "♡ Add Favorite"}</button>
          <Link className="btn secondary" to="/books">Back to Books</Link>
        </div>
      </div>
    </section>
  );
}
