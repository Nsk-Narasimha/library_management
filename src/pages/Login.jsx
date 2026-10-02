
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form.email.trim().toLowerCase(), form.password);
      if (user.role === "admin") {
  navigate("/admin");
} else {
  navigate("/books");
}
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Login</h1>
        {error && <div className="error">{error}</div>}
        <label>Email<input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></label>
        <label>Password<input type="password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})} /></label>
        <button className="btn primary full">Login</button>
        <p className="center">Don't have an account? <Link to="/signup">Signup</Link></p>
        <p className="demo">Admin: admin@library.com / admin123<br/>User: user@library.com / user123</p>
      </form>
    </div>
  );
}
