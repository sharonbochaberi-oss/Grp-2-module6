import secrets
from datetime import datetime
from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)


class Session(db.Model):
    __tablename__ = "sessions"

    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(64), unique=True, nullable=False, default=lambda: secrets.token_hex(24))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Cocktail(db.Model):
    __tablename__ = "cocktails"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50))
    alcoholic = db.Column(db.String(50))
    glass = db.Column(db.String(50))
    image = db.Column(db.String(255))
    instructions = db.Column(db.Text)
    ingredients = db.Column(db.JSON, default=list)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    notes = db.relationship(
        "Note",
        backref="cocktail",
        cascade="all, delete-orphan"
    )


class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key=True)
    cocktail_id = db.Column(db.Integer, db.ForeignKey("cocktails.id"))
    text = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)


class Favorite(db.Model):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    cocktail_id = db.Column(db.Integer)
    category = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)