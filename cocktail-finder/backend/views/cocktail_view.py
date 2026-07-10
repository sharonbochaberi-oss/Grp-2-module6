from flask import jsonify, request, g
from models import Cocktail
from extensions import db
from views.auth_view import authenticate


def get_all():
    error = authenticate()
    if error:
        return error
    search = request.args.get("search", "").lower()
    cocktails = Cocktail.query.all()
    if search:
        cocktails = [
            c for c in cocktails
            if search in c.name.lower() or search in (c.category or "").lower()
        ]
    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "category": c.category,
            "alcoholic": c.alcoholic,
            "glass": c.glass,
            "image": c.image,
            "instructions": c.instructions,
            "ingredients": c.ingredients or [],
        }
        for c in cocktails
    ])


def get_categories():
    error = authenticate()
    if error:
        return error
    categories = (
        Cocktail.query.with_entities(Cocktail.category)
        .distinct()
        .all()
    )
    return jsonify([cat[0] for cat in categories if cat[0]])


def get_one(id):
    error = authenticate()
    if error:
        return error
    cocktail = Cocktail.query.get_or_404(id)
    return jsonify({
        "id": cocktail.id,
        "name": cocktail.name,
        "category": cocktail.category,
        "alcoholic": cocktail.alcoholic,
        "glass": cocktail.glass,
        "image": cocktail.image,
        "instructions": cocktail.instructions,
        "ingredients": cocktail.ingredients or [],
    })


def create():
    error = authenticate()
    if error:
        return error
    data = request.json
    data.pop("id", None)
    cocktail = Cocktail(**data, user_id=g.current_user.id)
    db.session.add(cocktail)
    db.session.commit()
    return jsonify({"id": cocktail.id, "message": "Cocktail created"}), 201


def update(id):
    error = authenticate()
    if error:
        return error
    cocktail = Cocktail.query.filter_by(id=id, user_id=g.current_user.id).first_or_404()
    for key, value in request.json.items():
        if key != "id":
            setattr(cocktail, key, value)
    db.session.commit()
    return jsonify({"message": "Cocktail updated"})


def remove(id):
    error = authenticate()
    if error:
        return error
    cocktail = Cocktail.query.filter_by(id=id, user_id=g.current_user.id).first_or_404()
    db.session.delete(cocktail)
    db.session.commit()
    return "", 204