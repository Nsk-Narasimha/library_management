import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <AppRoutes />
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
