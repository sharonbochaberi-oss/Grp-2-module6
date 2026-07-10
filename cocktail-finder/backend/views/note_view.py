from flask import jsonify, request, g
from models import Note, Cocktail
from extensions import db
from views.auth_view import authenticate


def get_notes(cocktail_id):
    error = authenticate()
    if error:
        return error
    Cocktail.query.get_or_404(cocktail_id)
    notes = Note.query.filter_by(cocktail_id=cocktail_id)
    return jsonify([{"id": n.id, "text": n.text} for n in notes])


def add_note(cocktail_id):
    error = authenticate()
    if error:
        return error
    Cocktail.query.get_or_404(cocktail_id)
    data = request.json
    note = Note(cocktail_id=cocktail_id, text=data["text"], user_id=g.current_user.id)
    db.session.add(note)
    db.session.commit()
    return jsonify({"id": note.id, "text": note.text}), 201


def update_note(id):
    error = authenticate()
    if error:
        return error
    note = Note.query.filter_by(id=id, user_id=g.current_user.id).first_or_404()
    note.text = request.json["text"]
    db.session.commit()
    return jsonify({"id": note.id, "text": note.text})


def delete_note(id):
    error = authenticate()
    if error:
        return error
    note = Note.query.filter_by(id=id, user_id=g.current_user.id).first_or_404()
    db.session.delete(note)
    db.session.commit()
    return "", 204