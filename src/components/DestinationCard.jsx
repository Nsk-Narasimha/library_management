import { Link } from "react-router-dom";

function BookCard({ book ,onDelete}) {
 return (
   <div className="card">
     <img
       src={book.image}
       alt={book.name}
     />

     <h3>{book.name}</h3>

<p>{book.author}</p>

     <p>{book.category}</p>

     <p>⭐ {book.rating}</p>

     <div className="card-actions">
 <Link
   className="view-btn"
   to={`/books/${book.id}`}
 >
   View
 </Link>

 <Link
   className="edit-btn"
   to={`/edit-book/${book.id}`}
 >
   Edit
 </Link>

 <button
   className="delete-btn"
   onClick={() => onDelete(book.id)}
 >
   Delete
 </button>
</div>



   </div>
 );
}

export default BookCard;
