import { Routes, Route, Navigate, useParams } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Books from "../pages/Books";
import BookDetails from "../pages/BookDetails";
import Favorites from "../pages/Favorites";
import AdminDashboard from "../pages/admin/AdminDashboard";
import PdfReader from "../pages/PdfReader";
import NotFound from "../pages/NotFound";
import BookForm from "../pages/admin/BookForm";

function BookFormWrapper() {
  const { id } = useParams();
  return <BookForm bookId={id} />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
      <Route path="/books/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
      <Route path="/books/:id/read" element={<ProtectedRoute><PdfReader /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />

      {/* One complete Admin area: dashboard, statistics, books and add/edit form */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      <Route path="/admin/add-book" element={<AdminRoute><BookForm /></AdminRoute>} />
      <Route path="/admin/edit-book/:id" element={<AdminRoute><BookFormWrapper /></AdminRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
