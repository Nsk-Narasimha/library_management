import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function AddBook() {

 const navigate = useNavigate();

 const [formData, setFormData] = useState({
   name: "",
   author: "",
   image: "",
   description: ""
 });

 function handleChange(e) {
   setFormData({
     ...formData,
     [e.target.name]: e.target.value
   });
 }

 async function handleSubmit(e) {
   e.preventDefault();

   await api.post(
     "/books",
     formData
   );

   navigate("/books");
 }

 return (
<div className='form-container'>   
<form onSubmit={handleSubmit}>

     <input
       type="text"
       name="name"
       placeholder="Name"
       onChange={handleChange}
     />

     <input
       type="text"
       name="author"
       placeholder="Author"
       onChange={handleChange}
     />

     <input
       type="text"
       name="image"
       placeholder="Image URL"
       onChange={handleChange}
     />

     <textarea
       name="description"
       placeholder="Description"
       onChange={handleChange}
     />

     <button className='submit-btn'>
       Add Book
     </button>

   </form>
</div>
 );
}

export default AddBook;