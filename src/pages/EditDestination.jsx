import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function EditBook() {

 const { id } = useParams();

 const navigate = useNavigate();

 const [formData, setFormData] =
   useState({
     name: "",
     author: "",
     image: "",
     description: ""
   });

 useEffect(() => {
   getBook();
 }, []);

 async function getBook() {

   const response =
     await api.get(
       `/books/${id}`
     );

   setFormData(response.data);
 }

 function handleChange(e) {
   setFormData({
     ...formData,
     [e.target.name]: e.target.value
   });
 }

 async function handleSubmit(e) {

   e.preventDefault();

   await api.put(
     `/books/${id}`,
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
       value={formData.name}
       onChange={handleChange}
     />

     <input
       type="text"
       name="author"
       value={formData.author}
       onChange={handleChange}
     />

     <input
       type="text"
       name="image"
       value={formData.image}
       onChange={handleChange}
     />

     <textarea
       name="description"
       value={formData.description}
       onChange={handleChange}
     />

     <button  className='submit-btn'>
       Update Book
     </button>

   </form>
</div>
 );
}

export default EditBook;