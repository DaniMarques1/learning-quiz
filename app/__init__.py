from flask import Flask

def create_app():
    """
    Cria e configura uma instância da aplicação Flask.
    Este é o padrão Application Factory.
    """
    # Cria a instância do app. As pastas 'static' e 'templates' na mesma pasta 'app'
    # são encontradas automaticamente.
    app = Flask(__name__)

    # Importa e registra os blueprints
    from .main.routes import main_bp
    from .api.routes import api_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp) 

    return app