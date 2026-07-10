from flask import jsonify, request, g
from models import Favorite
from extensions import db
from views.auth_view import authenticate


def get_favorites():
    error = authenticate()
    if error:
        return error
    favorites = Favorite.query.filter_by(user_id=g.current_user.id).all()
    return jsonify([{"id": f.id, "cocktailId": f.cocktail_id, "category": f.category} for f in favorites])


def add_favorite():
    error = authenticate()
    if error:
        return error
    data = request.json
    favorite = Favorite(
        cocktail_id=data["cocktailId"],
        category=data.get("category", "General"),
        user_id=g.current_user.id
    )
    db.session.add(favorite)
    db.session.commit()
    return jsonify({"id": favorite.id, "message": "Favorite added"}), 201


def delete_favorite(id):
    error = authenticate()
    if error:
        return error
    favorite = Favorite.query.filter_by(id=id, user_id=g.current_user.id).first_or_404()
    db.session.delete(favorite)
    db.session.commit()
    return "", 204