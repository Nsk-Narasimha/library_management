import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Link, useParams } from "react-router-dom";
import { getBook } from "../api";
import { downloadStoredPdf, getPdf } from "../pdfStorage";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PdfReader() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [pdfSource, setPdfSource] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await getBook(id);
        if (!active) return;
        const data = response.data;
        setBook(data);

        if (data.pdf && (data.pdf.startsWith("data:") || data.pdf.startsWith("http") || data.pdf.startsWith("/"))) {
          setPdfSource(data.pdf);
        } else {
          const stored = await getPdf(id);
          if (!active) return;
          if (stored) setPdfSource(stored);
          else setError("PDF is not available for this book. Ask an admin to add a PDF.");
        }
      } catch {
        if (active) setError("Book or PDF could not be loaded.");
      } finally {
        if (active) setLoadingPdf(false);
      }
    }
    load();
    return () => { active = false; };
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!book || loadingPdf) return <p>Loading reader...</p>;
  if (!pdfSource) return <div className="error">PDF is not available for this book. Ask an admin to add a PDF.</div>;

  const downloadName = book.pdfFileName || `${book.title}.pdf`;

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      if (pdfSource instanceof Blob) {
        await downloadStoredPdf(id, downloadName);
      } else {
        const link = document.createElement("a");
        link.href = pdfSource;
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch {
      setError("The PDF is no longer available in this browser. Please upload it again from Admin.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="reader-page">
      <div className="reader-head">
        <div>
          <p className="eyebrow">READ ONLINE · FREE</p>
          <h1>{book.title}</h1>
          <p>by {book.author}</p>
        </div>
        <div className="reader-head-actions">
          <button className="btn secondary" onClick={handleDownload} disabled={downloading}>
            {downloading ? "Preparing PDF..." : "⬇️ Download PDF"}
          </button>
          <Link className="btn secondary" to={`/books/${book.id}`}>Book Details</Link>
        </div>
      </div>

      <div className="reader-toolbar">
        <button className="btn secondary" disabled={pageNumber <= 1} onClick={() => setPageNumber((page) => page - 1)}>← Previous</button>
        <strong>Page {pageNumber} / {numPages || "—"}</strong>
        <button className="btn secondary" disabled={!numPages || pageNumber >= numPages} onClick={() => setPageNumber((page) => page + 1)}>Next →</button>
        <div className="zoom-controls">
          <button className="btn secondary" onClick={() => setScale((s) => Math.max(0.7, s - 0.1))}>−</button>
          <span>{Math.round(scale * 100)}%</span>
          <button className="btn secondary" onClick={() => setScale((s) => Math.min(2, s + 0.1))}>+</button>
        </div>
      </div>

      <div className="pdf-viewer">
        <Document file={pdfSource} onLoadSuccess={({ numPages: total }) => { setNumPages(total); setPageNumber(1); }} onLoadError={() => setError("This PDF could not be opened. Please select a valid PDF in Admin.")} loading={<p>Loading PDF...</p>}>
          <Page pageNumber={pageNumber} scale={scale} renderTextLayer renderAnnotationLayer />
        </Document>
      </div>
    </section>
  );
}
