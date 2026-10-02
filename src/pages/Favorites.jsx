
import { useEffect, useState } from "react";
import { getBooks } from "../api";
import { useAuth } from "../AuthContext";
import BookCard from "../components/BookCard";

export default function Favorites() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  useEffect(() => { getBooks().then(r=>setBooks(r.data)); }, []);
  const favorites = books.filter(b => user?.favorites?.includes(String(b.id)));
  return (
    <section>
      <div className="page-head"><div><p className="eyebrow">SAVED FOR LATER</p><h1>Favorite Books</h1></div></div>
      {!favorites.length ? <div className="empty">No favorite books yet. Go to Books and tap ♡.</div> :
        <div className="grid">{favorites.map(book=><BookCard key={book.id} book={book}/>)}</div>}
    </section>
  );
}
