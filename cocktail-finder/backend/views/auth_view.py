from flask import request, jsonify, g
from models import User, Session
from extensions import db, bcrypt


def signup():
    data = request.json
    if not data.get("name") or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Name, email, and password are required."}), 400

    if User.query.filter_by(email=data["email"].lower()).first():
        return jsonify({"message": "Email already registered."}), 409

    hashed = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    user = User(name=data["name"], email=data["email"].lower(), password_hash=hashed)
    db.session.add(user)
    db.session.commit()

    session = Session(user_id=user.id)
    db.session.add(session)
    db.session.commit()

    return jsonify({"token": session.token, "user": {"id": user.id, "name": user.name, "email": user.email}}), 201


def login():
    data = request.json
    if not data.get("email") or not data.get("password"):
        return jsonify({"message": "Email and password are required."}), 400

    user = User.query.filter_by(email=data["email"].lower()).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, data["password"]):
        return jsonify({"message": "Invalid credentials."}), 401

    session = Session(user_id=user.id)
    db.session.add(session)
    db.session.commit()

    return jsonify({"token": session.token, "user": {"id": user.id, "name": user.name, "email": user.email}})


def logout():
    token = _get_token()
    if token:
        Session.query.filter_by(token=token).delete()
        db.session.commit()
    return jsonify({"message": "Logged out."})


def me():
    user = g.current_user
    return jsonify({"id": user.id, "name": user.name, "email": user.email})


def _get_token():
    auth = request.headers.get("Authorization", "")
    return auth[7:] if auth.startswith("Bearer ") else None


def authenticate():
    token = _get_token()
    if not token:
        return jsonify({"message": "Authentication required."}), 401

    session = Session.query.filter_by(token=token).first()
    if not session:
        return jsonify({"message": "Invalid or expired token."}), 401

    g.current_user = User.query.get(session.user_id)
    return None
