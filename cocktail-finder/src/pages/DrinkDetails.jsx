import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCocktailById,
  getCocktailNotes,
  createNote,
  updateNote,
  deleteNote,
  deleteCocktail,
  getFavorites,
  addFavorite,
  deleteFavorite,
} from "../services/cocktailApi";

export default function DrinkDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cocktail, setCocktail] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState("");
  const [favoriteId, setFavoriteId] = useState(null);
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    const loadCocktail = async () => {
      setLoading(true);
      setError("");
      try {
        const [data, noteList, favorites] = await Promise.all([
          getCocktailById(id),
          getCocktailNotes(id),
          getFavorites(),
        ]);

        setCocktail(data);
        setNotes(noteList);
        const fav = favorites.find((f) => String(f.cocktailId) === String(id));
        setFavoriteId(fav?.id ?? null);
      } catch (err) {
        setError("Cocktail could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    loadCocktail();
  }, [id]);

  const toggleFavorite = async () => {
    if (favoriteId) {
      await deleteFavorite(favoriteId);
      setFavoriteId(null);
    } else {
      const created = await addFavorite(id, cocktail.category);
      setFavoriteId(created.id);
    }
  };

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setSavingNote(true);
    try {
      if (editingNote) {
        const updated = await updateNote(editingNote.id, noteText.trim());
        setNotes((prev) => prev.map((note) => (note.id === updated.id ? updated : note)));
        setEditingNote(null);
      } else {
        const saved = await createNote(id, noteText.trim());
        setNotes((prev) => [saved, ...prev]);
      }
      setNoteText("");
    } catch (err) {
      setError("Unable to save note. Please try again.");
    } finally {
      setSavingNote(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteText(note.text);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      setError("Unable to delete note.");
    }
  };

  const handleRemoveCocktail = async () => {
    if (!window.confirm("Delete this cocktail and all related notes?")) return;
    try {
      await deleteCocktail(id);
      navigate("/");
    } catch (err) {
      setError("Unable to delete cocktail.");
    }
  };

  if (loading) return <p style={{ textAlign: "center", padding: "50px" }}>Loading cocktail details...</p>;
  if (!cocktail) return <p style={{ textAlign: "center", padding: "50px" }}>Cocktail not found.</p>;

  return (
    <div style={{ maxWidth: "760px", margin: "30px auto", padding: "20px", fontFamily: "sans-serif", border: "1px solid #eee", borderRadius: "10px", background: "#fff" }}>
      <button className="btn-back" onClick={() => navigate("/")}>← Back</button>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
        <img src={cocktail.image} alt={cocktail.name} style={{ width: "100%", maxWidth: "320px", objectFit: "cover", borderRadius: "8px" }} />

        <div style={{ flex: 1, minWidth: "300px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ margin: 0 }}>{cocktail.name}</h1>
            <button className="btn-save" onClick={toggleFavorite} style={{ background: favoriteId ? "#ff6b6b" : "#eee", color: favoriteId ? "white" : "#333" }}>
              {favoriteId ? "❤️ Saved" : "🤍 Save"}
            </button>
          </div>

          <p style={{ background: "#fceded", color: "#ff6b6b", display: "inline-block", padding: "5px 10px", borderRadius: "5px", fontSize: "14px", fontWeight: "bold", margin: "12px 0" }}>
            {cocktail.alcoholic}
          </p>

          <p><strong>Category:</strong> {cocktail.category}</p>
          <p><strong>Glass:</strong> {cocktail.glass}</p>

          <h3>How to Mix:</h3>
          <p style={{ lineHeight: "1.6", color: "#555" }}>{cocktail.instructions}</p>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3>Ingredients</h3>
        <ul>
          {(cocktail.ingredients ?? []).map((item, index) => (
            <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: "30px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="btn-save" style={{ background: "#48dbfb", color: "#111" }} onClick={() => navigate(`/drink/${id}/edit`)}>
            Edit Cocktail
          </button>
          <button className="btn-save" style={{ background: "#ff6b6b", color: "white" }} onClick={handleRemoveCocktail}>
            Delete Cocktail
          </button>
        </div>
      </div>

      <section style={{ marginTop: "30px" }}>
        <h3>Notes for this cocktail</h3>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmitNote} style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
          <textarea
            value={noteText}
            placeholder="Add a note for this cocktail..."
            onChange={(e) => setNoteText(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ddd", resize: "vertical" }}
          />
          <button type="submit" className="btn-save" disabled={savingNote} style={{ width: "fit-content", background: "#6bc67e", color: "white", opacity: savingNote ? 0.6 : 1 }}>
            {savingNote ? "Saving..." : editingNote ? "Update Note" : "Add Note"}
          </button>
          {editingNote && (
            <button type="button" className="btn-save" style={{ width: "fit-content", background: "#ccc", color: "#333" }} onClick={() => { setEditingNote(null); setNoteText(""); }}>
              Cancel Edit
            </button>
          )}
        </form>

        {notes.length === 0 ? (
          <p style={{ color: "#666", marginTop: "16px" }}>No notes yet for this cocktail.</p>
        ) : (
          <div style={{ marginTop: "20px", display: "grid", gap: "12px" }}>
            {notes.map((note) => (
              <div key={note.id} style={{ padding: "14px", border: "1px solid #eee", borderRadius: "12px", background: "#fafafa" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700 }}>{new Date(note.createdAt).toLocaleString()}</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button type="button" className="btn-save" style={{ background: "#48dbfb", color: "#111", padding: "6px 10px", fontSize: "0.9rem" }} onClick={() => handleEditNote(note)}>
                      Edit
                    </button>
                    <button type="button" className="btn-save" style={{ background: "#ff6b6b", color: "white", padding: "6px 10px", fontSize: "0.9rem" }} onClick={() => handleDeleteNote(note.id)}>
                      Delete
                    </button>
                  </div>
                </div>
                <p style={{ marginTop: "10px", color: "#444" }}>{note.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
