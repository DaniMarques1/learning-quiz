from flask import Blueprint, render_template

# Cria o blueprint do FLask para as rotas do site
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Esta função será executada quando alguém acessar a URL raiz ('/')."""
    return render_template('index.html')