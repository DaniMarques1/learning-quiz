from app import create_app

# Chama a factory para criar a instância da aplicação
app = create_app()

# Executa o servidor de desenvolvimento
if __name__ == '__main__':
    app.run(debug=True)