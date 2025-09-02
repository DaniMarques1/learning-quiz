from flask import Blueprint, jsonify, abort

# 1. Cria uma instância do Blueprint para rodar no app FLask.
api_bp = Blueprint('api', __name__)

# 2. Nosso "banco de dados" de questões em memória.
QUESTIONS_DB = [
    {
        "id": 1,
        "header": "The Basics",
        "level": 0,
        "question": "Olá",
        "answer": ["Hello", "Hi"],
    },
    {
        "id": 2,
        "header": "The Basics",
        "level": 0,
        "question": "Tchau",
        "answer": ["Bye", "Good bye"],
    },
    {
        "id": 3,
        "header": "Politeness",
        "level": 1,
        "question": "Obrigado",
        "answer": ["Thank you", "Thanks"],
    }
]

# <int:question_id> diz ao Flask para esperar um número inteiro na URL e passá-lo como um argumento chamado 'question_id' para a nossa função.

@api_bp.route('/api/question/<int:question_id>')
def get_question(question_id):
    # Esta rota serve dados de uma pergunta específica com base no seu ID.
    
    # 4. Lógica para encontrar a questão na nossa lista.
    # Usamos uma expressão geradora com 'next' para encontrar o primeiro item na lista cujo 'id' corresponde ao 'question_id' da URL.
    question = next((q for q in QUESTIONS_DB if q['id'] == question_id), None)
    
    # 5. Tratamento de erro: se a questão não for encontrada, retorna 404.
    if question is None:
        # abort(404) gera uma resposta de erro "Not Found".
        abort(404, description=f"Question with id {question_id} not found.")
        
    # Se a questão foi encontrada, retorna seus dados em JSON.
    return jsonify(question)