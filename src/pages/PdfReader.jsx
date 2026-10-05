import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBook } from "../api";

function getDriveFileId(url = "") {
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return match[1];

  const queryMatch = url.match(/[?&]id=([^&]+)/);
  return queryMatch ? queryMatch[1] : "";
}

export default function PdfReader() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getBook(id)
      .then(({ data }) => {
        if (!data.pdfUrl) {
          setError("PDF is not available for this book. Ask an admin to add a Google Drive PDF link.");
          return;
        }
        if (!getDriveFileId(data.pdfUrl)) {
          setError("The saved Google Drive PDF link is invalid.");
          return;
        }
        setBook(data);
      })
      .catch(() => setError("Book could not be loaded."));
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!book) return <p>Loading reader...</p>;

  const fileId = getDriveFileId(book.pdfUrl);
  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  return (
    <section className="reader-page">
      <div className="reader-head">
        <div>
          <p className="eyebrow">READ ONLINE · FREE</p>
          <h1>{book.title}</h1>
          <p>by {book.author}</p>
        </div>

        <div className="reader-head-actions">
          <a
            className="btn secondary"
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            ⬇️ Download PDF
          </a>
          <a
            className="btn secondary"
            href={book.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Drive
          </a>
          <Link className="btn secondary" to={`/books/${book.id}`}>Book Details</Link>
        </div>
      </div>

      <div className="pdf-viewer drive-pdf-viewer">
        <iframe
          src={previewUrl}
          title={`Read ${book.title}`}
          className="drive-pdf-frame"
          allow="autoplay"
        />
      </div>
    </section>
  );
}
