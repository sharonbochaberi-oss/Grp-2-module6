import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../services/cocktailApi";

function Navbar() {
  const { token, user, clearAuth } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    clearAuth();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <h2>🍹 Cocktail Finder</h2>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/drink/new">Add Cocktail</Link>
            <Link to="/favourites">Favourites</Link>
            <span style={{ color: "#aaa", fontSize: 13, marginLeft: 8 }}>Hi, {user?.name}</span>
            <button
              onClick={handleLogout}
              style={{
                marginLeft: 8,
                background: "transparent",
                border: "1px solid #aaa",
                color: "#aaa",
                cursor: "pointer",
                padding: "4px 12px",
                borderRadius: 4,
                fontSize: 13,
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;