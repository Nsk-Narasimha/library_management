
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link className="brand" to="/">📚 Library<span>Hub</span></Link>
        <nav>
          <Link to="/">Home</Link>
          {user && <Link to="/books">Books</Link>}
          {user && <Link to="/favorites">❤️ Favorites</Link>}
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link className="nav-cta" to="/signup">Signup</Link>
            </>
          ) : (
            <button className="nav-logout" onClick={signOut}>Logout</button>
          )}
        </nav>
      </div>
    </header>
  );
}
