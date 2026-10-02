import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBook, getBook, updateBook } from "../../api";
import { deletePdf, getPdf, savePdf } from "../../pdfStorage";

const empty = {
  title: "", author: "", category: "Fiction", isbn: "", publicationYear: "",
  pages: "", rating: "", language: "English", availableCopies: "",
  totalCopies: "", coverImage: "", description: "", tags: "", pdf: "",
  pdfFileName: "", hasPdf: false
};

export const categories = [
  "Fiction", "Adventure", "Education", "Science", "Programming",
  "Biography", "Self Help", "History", "Mystery", "Fantasy", "Children", "Other"
];

export default function BookForm({ bookId = null, onSaved, onCancel }) {
  const navigate = useNavigate();
  const edit = Boolean(bookId);
  const [form, setForm] = useState(empty);
  const [pdfFileName, setPdfFileName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);
  const [removePdf, setRemovePdf] = useState(false);
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    if (!edit) {
      setForm(empty);
      setPdfFileName("");
      setRemovePdf(false);
      setUploadError("");
      setSubmitError("");
      setSelectedPdfFile(null);
      return () => { active = false; };
    }

    getBook(bookId)
      .then(({ data }) => {
        if (!active) return;
        setForm({ ...empty, ...data, tags: (data.tags || []).join(", ") });
        setPdfFileName(data.pdfFileName || (data.pdf ? "Existing PDF" : ""));
        setRemovePdf(false);
        setSelectedPdfFile(null);
      })
      .catch(() => active && setSubmitError("Book could not be loaded."));

    return () => { active = false; };
  }, [bookId, edit]);

  const change = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    setUploadError("");
    setSubmitError("");
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Please select a PDF file only.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Please choose a PDF smaller than 10 MB.");
      e.target.value = "";
      return;
    }

    setSelectedPdfFile(file);
    setForm((current) => ({ ...current, pdf: "", pdfFileName: file.name, hasPdf: true }));
    setPdfFileName(file.name);
    setRemovePdf(false);
  };

  const clearPdf = () => {
    setSelectedPdfFile(null);
    setForm((current) => ({ ...current, pdf: "", pdfFileName: "", hasPdf: false }));
    setPdfFileName("");
    setRemovePdf(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setUploadError("");

    const publicationYear = Number(form.publicationYear);
    const pages = Number(form.pages);
    const rating = Number(form.rating);
    const availableCopies = Number(form.availableCopies);
    const totalCopies = Number(form.totalCopies);

    if (!form.title.trim() || !form.author.trim() || !form.description.trim()) {
      setSubmitError("Title, author and description are required.");
      return;
    }
    if (!Number.isInteger(publicationYear) || publicationYear < 1000 || publicationYear > new Date().getFullYear()) {
      setSubmitError("Enter a valid publication year."); return;
    }
    if (!Number.isInteger(pages) || pages < 1) {
      setSubmitError("Pages must be at least 1."); return;
    }
    if (Number.isNaN(rating) || rating < 0 || rating > 5) {
      setSubmitError("Rating must be between 0 and 5."); return;
    }
    if (!Number.isInteger(totalCopies) || totalCopies < 0 || !Number.isInteger(availableCopies) || availableCopies < 0 || availableCopies > totalCopies) {
      setSubmitError("Copies must be valid, and available copies cannot exceed total copies."); return;
    }
    if (!selectedPdfFile && !edit && !form.hasPdf) {
      setSubmitError("Please select a PDF file before creating the book."); return;
    }

    const payload = {
      ...form,
      pdf: "",
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      language: form.language.trim(),
      coverImage: form.coverImage.trim(),
      description: form.description.trim(),
      publicationYear, pages, rating, availableCopies, totalCopies,
      tags: form.tags.split(",").map((x) => x.trim()).filter(Boolean),
      hasPdf: removePdf ? false : Boolean(selectedPdfFile || form.hasPdf || form.pdfFileName),
      ...(removePdf ? { pdfFileName: "", hasPdf: false } : {})
    };
    delete payload.pdf;

    setSaving(true);
    const savedId = edit ? String(bookId) : crypto.randomUUID();
    let previousPdf = null;
    let newPdfSaved = false;

    try {
      // Keep the old local PDF so an edit can be rolled back if JSON Server fails.
      if (edit && selectedPdfFile) previousPdf = await getPdf(savedId);

      // Store the PDF first. JSON Server only receives small metadata.
      if (selectedPdfFile) {
        await savePdf(savedId, selectedPdfFile);
        newPdfSaved = true;
      }

      const bookPayload = { ...payload, id: savedId };
      const saved = edit
        ? await updateBook(savedId, bookPayload)
        : await createBook(bookPayload);

      const finalId = String(saved.data.id);
      if (removePdf) {
        try { await deletePdf(finalId); } catch { /* metadata is already saved */ }
      }

      if (onSaved) onSaved();
      else navigate("/admin");
    } catch {
      // Roll back local PDF changes when the metadata request fails.
      if (newPdfSaved) {
        try {
          if (edit && previousPdf) await savePdf(savedId, previousPdf);
          else await deletePdf(savedId);
        } catch { /* ignore rollback failure */ }
      }
      setSubmitError("The book could not be saved. Check that JSON Server is running and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="wide-form admin-book-form" onSubmit={submit}>
      <div className="form-section-head">
        <div>
          <p className="eyebrow">{edit ? "UPDATE BOOK" : "ADD NEW BOOK"}</p>
          <h2>{edit ? "Edit Book" : "Add Book"}</h2>
        </div>
        <span className="free-badge">FREE LIBRARY</span>
      </div>

      <div className="form-grid">
        <label>Title<input name="title" value={form.title} onChange={change} required /></label>
        <label>Author<input name="author" value={form.author} onChange={change} required /></label>
        <label>Category<select name="category" value={form.category} onChange={change}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>ISBN<input name="isbn" value={form.isbn} onChange={change} required /></label>
        <label>Publication Year<input type="number" name="publicationYear" min="1000" max={new Date().getFullYear()} value={form.publicationYear} onChange={change} required /></label>
        <label>Pages<input type="number" name="pages" min="1" value={form.pages} onChange={change} required /></label>
        <label>Rating<input type="number" name="rating" min="0" max="5" step="0.1" value={form.rating} onChange={change} required /></label>
        <label>Language<input name="language" value={form.language} onChange={change} required /></label>
        <label>Available Copies<input type="number" name="availableCopies" min="0" value={form.availableCopies} onChange={change} required /></label>
        <label>Total Copies<input type="number" name="totalCopies" min="0" value={form.totalCopies} onChange={change} required /></label>
        <label>Cover Image URL<input type="url" name="coverImage" value={form.coverImage} onChange={change} placeholder="https://..." required /></label>
        <label>PDF File
          <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" onChange={handlePdfChange} required={!edit && !form.hasPdf} />
          {pdfFileName && <small className="form-help">Selected: {pdfFileName}</small>}
          {edit && (form.hasPdf || form.pdfFileName) && <button type="button" className="btn danger pdf-clear" onClick={clearPdf}>Remove PDF</button>}
        </label>
      </div>

      <div className="free-notice">📚 All books are <strong>FREE</strong>. No purchase or price is required.</div>
      <label>Description<textarea name="description" rows="4" value={form.description} onChange={change} required /></label>
      <label>Tags<input name="tags" value={form.tags} onChange={change} placeholder="Programming, Beginner" /></label>

      {uploadError && <p className="error">{uploadError}</p>}
      {submitError && <p className="error">{submitError}</p>}
      <p className="form-help">Select the PDF directly from your computer. The PDF file is stored locally in your browser using IndexedDB. Only the book details are saved to JSON Server, so large PDFs do not hit the JSON Server payload limit. Maximum file size: 10 MB.</p>

      <div className="hero-actions">
        <button className="btn primary" disabled={saving}>{saving ? "Saving..." : edit ? "Save Changes" : "Create Book"}</button>
        <button type="button" className="btn secondary" onClick={onCancel || (() => navigate("/admin"))}>Cancel</button>
      </div>
    </form>
  );
}
