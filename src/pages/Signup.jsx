
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser, findUserByEmail } from "../api";

export default function Signup() {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const existing = await findUserByEmail(form.email);
    if (existing.data.length) return setError("Email already registered.");
    await createUser({
      ...form,
      role: "user",
      favorites: [],
      createdAt: new Date().toISOString().slice(0,10)
    });
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <p className="eyebrow">JOIN THE LIBRARY</p>
        <h1>Create account</h1>
        {error && <div className="error">{error}</div>}
        <label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
        <label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
        <label>Password<input type="password" minLength="6" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
        <button className="btn primary full">Signup</button>
        <p className="center">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
