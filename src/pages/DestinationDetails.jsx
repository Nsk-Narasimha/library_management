import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function BookDetails() {
 const { id } = useParams();

 const [book, setBook] =
   useState(null);

 useEffect(() => {
   getBook();
 }, []);

 async function getBook() {
   try {
     const response = await api.get(
       `/books/${id}`
     );

     setBook(response.data);
   } catch (error) {
     console.log(error);
   }
 }

 if (!book) {
   return <h2>Loading...</h2>;
 }

 return (
   <div className="details">
     <img
       src={book.image}
       alt={book.name}
     />

     <h1>{book.name}</h1>

     <p>{book.description}</p>

     <h3>Author</h3>
     <p>{book.author}</p>

     <h3>Category</h3>
     <p>{book.category}</p>

     <h3>Best Time To Visit</h3>
     <p>{book.publicationYear}</p>

     <h3>Pages</h3>
     <p>{book.pages}</p>

     <h3>Availability</h3>
     <p>{book.availability}</p>

     <h3>Language</h3>
     <p>{book.language}</p>

     <h3>ISBN</h3>
     <p>{book.isbn}</p>

     <h3>Price</h3>
     <p>₹ {book.price}</p>

     <h3>Rating</h3>
     <p>{book.rating}</p>

     <h3>Famous For</h3>
     <p>{book.famousFor}</p>

     <h3>Top Tags</h3>

     <ul>
       {book.tags && book.tags.map(
         (place, index) => (
           <li key={index}>{place}</li>
         )
       )}
     </ul>
   </div>
 );
}

export default BookDetails;