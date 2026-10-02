
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">SMART LIBRARY MANAGEMENT</p>
        <h1>Discover your next <span>great book.</span></h1>
        <p className="hero-text">Browse, search, favorite and manage books through a clean React + JSON Server library application.</p>
        <div className="hero-actions">
          <Link className="btn primary" to="/books">Explore Books →</Link>
          <Link className="btn secondary" to="/signup">Create Account</Link>
        </div>
      </div>
      <div className="hero-card">
        <div className="hero-icon">📚</div>
        <h2>LibraryHub</h2>
        <p>One place for your books, favorites and library administration.</p>
      </div>
    </section>
  );
}
