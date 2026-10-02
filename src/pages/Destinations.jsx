import { useEffect, useState } from "react";
import api from "../services/api";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";

function Books() {
 const [books, setBooks] =
   useState([]);

 useEffect(() => {
   getBooks();
 }, []);

 async function getBooks() {
   try {
     const response = await api.get(
       "/books"
     );

     setBooks(response.data);
   } catch (error) {
     console.log(error);
   }
 }
async function deleteBook(id) {

 await api.delete(
   `/books/${id}`
 );

 setBooks(
   books.filter(
     book =>
     book.id !== id
   )
 );
}

 return (
   <>
     <h1>Popular Books</h1>
      <Link  to="/add-book" >
      Add Book
      </Link>

     <div className="books">
       {books.map((book) => (
         <BookCard
           key={book.id}
           book={book}
           onDelete={deleteBook}
         />
       ))}
     </div>
   </>
 );
}

export default Books;
