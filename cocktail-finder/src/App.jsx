import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DrinkDetails from "./pages/DrinkDetails";
import CocktailForm from "./pages/CocktailForm";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/drink/new" element={<CocktailForm />} />
          <Route path="/drink/:id/edit" element={<CocktailForm />} />
          <Route path="/drink/:id" element={<DrinkDetails />} />
          <Route path="/favourites" element={<Favorites />} />
        </Routes>
        <footer
          style={{
            textAlign: "center",
            padding: "20px",
            marginTop: "30px",
            color: "#888",
            fontSize: "14px",
          }}
        >
          Cocktail Finder © 2026
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
