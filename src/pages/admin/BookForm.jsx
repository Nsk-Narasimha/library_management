import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBook, getBook, updateBook } from "../../api";

const empty = {
  title: "", author: "", category: "Fiction", isbn: "", publicationYear: "",
  pages: "", rating: "", language: "English", availableCopies: "",
  totalCopies: "", coverImage: "", description: "", tags: "", pdfUrl: ""
};

export const categories = [
  "Fiction", "Adventure", "Education", "Science", "Programming",
  "Biography", "Self Help", "History", "Mystery", "Fantasy", "Children", "Other"
];

export default function BookForm({ bookId = null, onSaved, onCancel }) {
  const navigate = useNavigate();
  const edit = Boolean(bookId);
  const [form, setForm] = useState(empty);
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    if (!edit) {
      setForm(empty);
      setSubmitError("");
      return () => { active = false; };
    }

    getBook(bookId)
      .then(({ data }) => {
        if (!active) return;
        setForm({
          ...empty,
          ...data,
          tags: (data.tags || []).join(", "),
          pdfUrl: data.pdfUrl || ""
        });
      })
      .catch(() => active && setSubmitError("Book could not be loaded."));

    return () => { active = false; };
  }, [bookId, edit]);

  const change = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitError("");

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

    const pdfUrl = form.pdfUrl.trim();
    if (pdfUrl && !pdfUrl.includes("drive.google.com")) {
      setSubmitError("Please enter a valid Google Drive PDF link.");
      return;
    }

    const payload = {
      ...form,
      id: edit ? String(bookId) : crypto.randomUUID(),
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      language: form.language.trim(),
      coverImage: form.coverImage.trim(),
      description: form.description.trim(),
      publicationYear, pages, rating, availableCopies, totalCopies,
      tags: form.tags.split(",").map((x) => x.trim()).filter(Boolean),
      pdfUrl
    };


    setSaving(true);
    try {
      if (edit) await updateBook(bookId, payload);
      else await createBook(payload);

      if (onSaved) onSaved();
      else navigate("/admin");
    } catch {
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
        <label className="pdf-link-field">Google Drive PDF Link
          <input
            type="url"
            name="pdfUrl"
            value={form.pdfUrl}
            onChange={change}
            placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
          />
          <small className="form-help">
            Set the Drive file to <strong>Anyone with the link → Viewer</strong>.
          </small>
        </label>
      </div>

      <div className="free-notice">📚 All books are <strong>FREE</strong>. No purchase or price is required.</div>
      <label>Description<textarea name="description" rows="4" value={form.description} onChange={change} required /></label>
      <label>Tags<input name="tags" value={form.tags} onChange={change} placeholder="Programming, Beginner" /></label>

      {submitError && <p className="error">{submitError}</p>}
      <p className="form-help">
        PDFs are now stored in Google Drive. This application saves only the Drive link in JSON Server,
        so the same PDF can be read and accessed from different devices.
      </p>

      <div className="hero-actions">
        <button className="btn primary" disabled={saving}>{saving ? "Saving..." : edit ? "Save Changes" : "Create Book"}</button>
        <button type="button" className="btn secondary" onClick={onCancel || (() => navigate("/admin"))}>Cancel</button>
      </div>
    </form>
  );
}
