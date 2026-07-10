import { useNavigate } from "react-router-dom";

function DrinkCard({ drink, index, favoriteId, onToggleFavorite }) {
  const navigate = useNavigate();

  const id = drink.idDrink || drink.id;
  const title = drink.strDrink || drink.name;
  const image = drink.strDrinkThumb || drink.image;
  const category = drink.strCategory || drink.category || "Cocktail";
  const alcoholic = drink.strAlcoholic || drink.alcoholic || "Alcoholic";

  const isFav = Boolean(favoriteId);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(id, favoriteId, category);
  };

  return (
    <div
      className="drink-card"
      onClick={() => navigate(`/drink/${id}`)}
      style={{ cursor: "pointer", position: "relative" }}
    >
      <button
        className={`fav-btn ${isFav ? "active" : ""}`}
        onClick={toggleFavorite}
      >
        {isFav ? "♥" : "♡"}
      </button>

      <img src={image} alt={title} />

      <div className="drink-info">
        <h3>{title}</h3>

        <p>
          <strong>Category:</strong> {category}
        </p>

        <p>{alcoholic}</p>
      </div>
    </div>
  );
}

export default DrinkCard;
