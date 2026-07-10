import { useState, useEffect } from "react";
import DrinkCard from "../components/DrinkCard";
import { getFavorites, deleteFavorite, getCocktailById } from "../services/cocktailApi";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const favs = await getFavorites();
      setFavorites(favs);
      const cocktails = await Promise.all(
        favs.map((f) => getCocktailById(f.cocktailId))
      );
      setDrinks(cocktails);
      setLoading(false);
    };
    load();
  }, []);

  const handleToggleFavorite = async (cocktailId, favoriteId) => {
    if (!favoriteId) return;
    await deleteFavorite(favoriteId);
    setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    setDrinks((prev) => prev.filter((d) => d.id !== cocktailId));
  };

  return (
    <div className="favorites-page">
      <h2>❤️ Favorite Cocktails</h2>

      {loading ? (
        <p>Loading favorites...</p>
      ) : drinks.length === 0 ? (
        <p>You haven't saved any favorite cocktails yet.</p>
      ) : (
        <div className="drinks-grid">
          {drinks.map((drink, index) => {
            const fav = favorites.find((f) => f.cocktailId === drink.id);
            return (
              <DrinkCard
                key={drink.id}
                drink={drink}
                index={index}
                favoriteId={fav?.id}
                onToggleFavorite={handleToggleFavorite}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
