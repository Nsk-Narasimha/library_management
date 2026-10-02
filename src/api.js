import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "https://library-management-backend-31s1.onrender.com/").replace(/\/$/, "");

export const API = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export const getBooks = () => API.get("/books");
export const getBook = (id) => API.get(`/books/${id}`);
export const createBook = (book) => API.post("/books", book);
export const updateBook = (id, book) => API.put(`/books/${id}`, book);
export const deleteBook = (id) => API.delete(`/books/${id}`);

export const getUsers = () => API.get("/users");
export const findUserByEmail = (email) =>
  API.get(`/users?email=${encodeURIComponent(email)}`);
export const createUser = (user) => API.post("/users", user);
export const updateUser = (id, user) => API.put(`/users/${id}`, user);
