import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBook } from "../api";
import { useAuth } from "../AuthContext";
import { downloadStoredPdf } from "../pdfStorage";

export default function BookDetails() {
  const { id } = useParams();
  const handleDownload = async () => {
    try {
      await downloadStoredPdf(id, book?.pdfFileName || `${book?.title || "book"}.pdf`);
    } catch {
      window.alert("This PDF is not available in this browser. Please upload it again from Admin.");
    }
  };
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const { user, toggleFavorite } = useAuth();
  const [favoriteError, setFavoriteError] = useState("");

  useEffect(() => {
    getBook(id).then((r) => setBook(r.data)).catch(() => setError("Book could not be loaded."));
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!book) return <p>Loading...</p>;

  const favorite = user?.favorites?.includes(String(book.id));

  return (
    <section className="details">
      <img src={book.coverImage} alt={book.title} />

      <div>
        <p className="eyebrow">{book.category}</p>
        <h1>{book.title}</h1>
        <h3>by {book.author}</h3>
        <p className="hero-text">{book.description}</p>

        <div className="details-grid">
          <span>ISBN<strong>{book.isbn}</strong></span>
          <span>Year<strong>{book.publicationYear}</strong></span>
          <span>Pages<strong>{book.pages}</strong></span>
          <span>Rating<strong>⭐ {book.rating}</strong></span>
          <span>Language<strong>{book.language}</strong></span>
          <span>Access<strong>FREE</strong></span>
        </div>

        {favoriteError && <p className="error">{favoriteError}</p>}

        <div className="hero-actions">
          <button
            className="btn secondary"
            onClick={async () => {
              try {
                setFavoriteError("");
                await toggleFavorite(book.id);
              } catch {
                setFavoriteError("Favorite could not be updated. Check that JSON Server is running.");
              }
            }}
          >
            {favorite ? "♥ Remove Favorite" : "♡ Add Favorite"}
          </button>

          {(book.hasPdf || book.pdf) && (
            <>
              <Link className="btn primary" to={`/books/${book.id}/read`}>
                📖 Read Online
              </Link>
              {book.pdf ? <a className="btn secondary" href={book.pdf} download={book.pdfFileName || `${book.title}.pdf`}>
                ⬇️ Download PDF
              </a> : <button className="btn secondary" onClick={handleDownload}>
                ⬇️ Download PDF
              </button>}
            </>
          )}

          <Link className="btn secondary" to="/books">
            Back to Books
          </Link>
        </div>
      </div>
    </section>
  );
}
