import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div>
          <p className="eyebrow">SMART LIBRARY MANAGEMENT</p>
          <h1>Discover your next <span>great book.</span></h1>
          <p className="hero-text">Browse, search, favorite and read books online for free through a clean React + JSON Server library application.</p>
          <div className="hero-actions">
            <Link className="btn primary" to="/books">Explore Books →</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-icon">📚</div>
          <h2>LibraryHub</h2>
          <p>One place for free books, online reading, downloads, favorites and library administration.</p>
        </div>
      </section>

      <section className="home-section about-section">
        <div className="section-intro">
          <p className="eyebrow">ABOUT THE PROJECT</p>
          <h2>A simple digital library for everyone.</h2>
          <p>LibraryHub is a web-based Library Management System designed to make book discovery and library administration simple. Users can explore available books, search by title or category, save favorites and read supported books online through shared PDF links.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card"><span>🔎</span><h3>Easy Discovery</h3><p>Search and filter books quickly to find the right title.</p></article>
          <article className="feature-card"><span>📖</span><h3>Online Reading</h3><p>Open available PDFs directly in the browser without local storage.</p></article>
          <article className="feature-card"><span>❤️</span><h3>Personal Favorites</h3><p>Save interesting books and access them again from Favorites.</p></article>
        </div>
      </section>

      <section className="home-section how-section">
        <div className="section-intro centered-intro">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>From book management to reading.</h2>
          <p>The application connects the user interface with JSON Server APIs, while shared Google Drive PDF links make online reading available across devices.</p>
        </div>
        <div className="steps-grid">
          <div className="step-card"><strong>01</strong><h3>Browse</h3><p>Sign in and explore the library collection.</p></div>
          <div className="step-card"><strong>02</strong><h3>Choose</h3><p>Open a book to see its complete information.</p></div>
          <div className="step-card"><strong>03</strong><h3>Read</h3><p>Use Read Online to view the shared PDF in the website.</p></div>
          <div className="step-card"><strong>04</strong><h3>Manage</h3><p>Admins can add, edit, delete and organize books.</p></div>
        </div>
      </section>

      <section className="home-cta">
        <div><p className="eyebrow">START EXPLORING</p><h2>Ready to find your next book?</h2></div>
        <Link className="btn primary" to="/books">View Library →</Link>
      </section>
    </div>
  );
}
