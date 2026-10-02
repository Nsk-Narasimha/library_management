
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBook, getBook, updateBook } from "../api";

const empty = { title:"", author:"", category:"Fiction", isbn:"", publicationYear:"", pages:"", price:"", rating:"", language:"English", availableCopies:"", totalCopies:"", coverImage:"", description:"", tags:"" };

export default function BookForm() {
  const { id } = useParams();
  const edit = Boolean(id);
  const [form,setForm]=useState(empty);
  const navigate=useNavigate();

  useEffect(()=>{if(edit)getBook(id).then(r=>setForm({...r.data,tags:(r.data.tags||[]).join(", ")}))},[id,edit]);

  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  const submit=async e=>{
    e.preventDefault();
    const payload={
      ...form,
      publicationYear:Number(form.publicationYear), pages:Number(form.pages),
      price:Number(form.price), rating:Number(form.rating),
      availableCopies:Number(form.availableCopies), totalCopies:Number(form.totalCopies),
      tags:form.tags.split(",").map(x=>x.trim()).filter(Boolean)
    };
    if(edit) await updateBook(id,payload); else await createBook(payload);
    navigate("/admin");
  };

  return (
    <form className="wide-form" onSubmit={submit}>
      <p className="eyebrow">{edit?"UPDATE BOOK":"ADD NEW BOOK"}</p><h1>{edit?"Edit Book":"Add Book"}</h1>
      <div className="form-grid">
        {[
          ["title","Title"],["author","Author"],["category","Category"],["isbn","ISBN"],
          ["publicationYear","Publication Year"],["pages","Pages"],["price","Price"],["rating","Rating"],
          ["language","Language"],["availableCopies","Available Copies"],["totalCopies","Total Copies"],["coverImage","Cover Image URL"]
        ].map(([name,label])=><label key={name}>{label}<input name={name} value={form[name]} onChange={change} required /></label>)}
      </div>
      <label>Description<textarea name="description" rows="4" value={form.description} onChange={change} required/></label>
      <label>Tags <input name="tags" value={form.tags} onChange={change} placeholder="Programming, Beginner"/></label>
      <div className="hero-actions"><button className="btn primary">{edit?"Save Changes":"Create Book"}</button><button type="button" className="btn secondary" onClick={()=>navigate("/admin")}>Cancel</button></div>
    </form>
  );
}
