from flask import Blueprint
from views.auth_view import signup, login, logout, me

auth_bp = Blueprint("auth", __name__)

auth_bp.route("/api/auth/signup", methods=["POST"])(signup)
auth_bp.route("/api/auth/login", methods=["POST"])(login)
auth_bp.route("/api/auth/logout", methods=["POST"])(logout)
auth_bp.route("/api/auth/me", methods=["GET"])(me)
