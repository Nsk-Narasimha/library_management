import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Books from "../pages/Books";
import BookDetails from "../pages/BookDetails";
 import AddBook from "../pages/AddBook";
 import EditBook from "../pages/EditBook";
function AppRoutes() {
 return (
   <Routes>
     <Route
       path="/"
       element={<Home />}
     />
<Route
       path="/books"
       element={<Books />}
     />

     <Route
       path="/books/:id"
       element={<BookDetails />}
     />
    

    <Route
      path="/add-book"
     element={<AddBook />}
    />
    <Route
 path="/edit-book/:id"
 element={<EditBook />}
/>
   </Routes>
 );
}

export default AppRoutes;
