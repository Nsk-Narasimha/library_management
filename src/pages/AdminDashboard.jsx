
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks, getUsers } from "../api";
import BookCard from "../components/BookCard";

export default function AdminDashboard() {
  const [books,setBooks]=useState([]);
  const [users,setUsers]=useState([]);
  const load=async()=>{setBooks((await getBooks()).data);setUsers((await getUsers()).data);};
  useEffect(()=>{load()},[]);
  return (
    <section>
      <div className="page-head">
        <div><p className="eyebrow">ADMIN CONTROL CENTER</p><h1>Library Dashboard</h1></div>
        <Link className="btn primary" to="/admin/add-book">+ Add Book</Link>
      </div>
      <div className="stats">
        <div><strong>{books.length}</strong><span>Total Books</span></div>
        <div><strong>{users.length}</strong><span>Registered Users</span></div>
        <div><strong>{books.filter(b=>b.availableCopies>0).length}</strong><span>Available Titles</span></div>
      </div>
      <h2>Manage Books</h2>
      <div className="grid">{books.map(book=><BookCard key={book.id} book={book} onDelete={async()=>{await load()}}/>)}</div>
    </section>
  );
}
