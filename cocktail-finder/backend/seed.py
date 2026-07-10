import urllib.request
import json
from app import app
from extensions import db
from models import Cocktail


def fetch_cocktails_by_letter(letter):
    url = f"https://www.thecocktaildb.com/api/json/v1/1/search.php?f={letter}"
    with urllib.request.urlopen(url, timeout=10) as res:
        data = json.loads(res.read())
    return data.get("drinks") or []


def parse_ingredients(drink):
    ingredients = []
    for i in range(1, 16):
        ingredient = drink.get(f"strIngredient{i}")
        if ingredient and ingredient.strip():
            measure = (drink.get(f"strMeasure{i}") or "").strip()
            ingredients.append(f"{measure} {ingredient}".strip() if measure else ingredient.strip())
    return ingredients


with app.app_context():
    if Cocktail.query.first():
        print("Database already seeded.")
    else:
        cocktails = []
        for letter in ["a", "b", "c", "m", "s"]:
            drinks = fetch_cocktails_by_letter(letter)
            for drink in drinks:
                cocktails.append(Cocktail(
                    name=drink.get("strDrink"),
                    category=drink.get("strCategory", "Cocktail"),
                    alcoholic=drink.get("strAlcoholic", "Alcoholic"),
                    glass=drink.get("strGlass", "Cocktail glass"),
                    image=drink.get("strDrinkThumb", ""),
                    instructions=drink.get("strInstructions", ""),
                    ingredients=parse_ingredients(drink),
                ))
            print(f"Fetched {len(drinks)} cocktails for letter '{letter}'")

        db.session.add_all(cocktails)
        db.session.commit()
        print(f"Database seeded with {len(cocktails)} cocktails.")
