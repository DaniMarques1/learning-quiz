// Aguarda o conteúdo da página ser totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
    
    // Variável para armazenar os dados da questão atual
    let currentQuestionData = null;
    
    // Variável para controlar o ID da questão atual
    let currentQuestionId = 1;

    // Selecionando os elementos do DOM
    const questionTitleElement = document.getElementById('question-title');
    const questionTextElement = document.getElementById('question-text');
    const translationInputElement = document.getElementById('translation-input');
    const nextButton = document.getElementById('next-button');
    const cardsContainer = document.getElementById('cards-container');
    const answerCard = document.getElementById('answer-card');
    const restartButton = document.getElementById('restart-button'); 

    translationInputElement.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            // Clica no botão que estiver visível no momento (Verificar/Próxima ou Refazer)
            if (nextButton.style.display !== 'none') {
                nextButton.click();
            }
        }
    });
    // =====================================================================

    /**
     * Carrega os dados de uma questão da API e atualiza o DOM.
     * @param {number} questionId O ID da questão a ser carregada.
     */
    async function loadQuestion(questionId) {
        try {
            const response = await fetch(`/api/question/${questionId}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn("Não há mais questões.");
                    questionTitleElement.textContent = 'Quiz Finalizado!';
                    questionTextElement.textContent = 'Parabéns! 🎉';
                    cardsContainer.style.display = 'none';
                    nextButton.style.display = 'none';
                    translationInputElement.disabled = true;
                    restartButton.style.display = 'block';
                    return; 
                }
                throw new Error('Não foi possível carregar os dados da questão.');
            }
            
            const data = await response.json();
            currentQuestionData = data;
            
            if (questionTitleElement && questionTextElement) {
                questionTitleElement.textContent = `Question ${data.id}: ${data.header}`;
                questionTextElement.textContent = data.question;
            }
            
        } catch (error) {
            console.error('Erro ao carregar a questão:', error);
            if (questionTitleElement) {
                questionTitleElement.textContent = 'Erro ao carregar a questão';
            }
        }
    }

    /**
     * Verifica a resposta do usuário e exibe o resultado.
     */
    function checkAnswer() {
        if (!currentQuestionData) {
            console.error("Dados da questão não carregados.");
            return;
        }

        const userAnswer = translationInputElement.value.trim().toLowerCase();
        const correctAnswers = currentQuestionData.answer.map(ans => ans.toLowerCase());

        answerCard.innerHTML = '';
        answerCard.classList.remove('correct', 'incorrect');

        if (correctAnswers.includes(userAnswer)) {
            answerCard.classList.add('correct');
            answerCard.textContent = 'Resposta Correta!';
        } else {
            answerCard.classList.add('incorrect');
            const correctAnswerText = currentQuestionData.answer.join(' ou ');
            answerCard.innerHTML = `Resposta Incorreta.<br><small>Correta: ${correctAnswerText}</small>`;
        }
        
        cardsContainer.classList.add('flipped');
        nextButton.textContent = 'Próxima';
        nextButton.removeEventListener('click', checkAnswer);
        nextButton.addEventListener('click', loadNextQuestion);
    }
    
    /**
     * Prepara a UI para a próxima questão.
     */
    function loadNextQuestion() {
        cardsContainer.classList.remove('flipped');
        translationInputElement.value = '';
        nextButton.textContent = 'Verificar';
        nextButton.removeEventListener('click', loadNextQuestion);
        nextButton.addEventListener('click', checkAnswer);
        
        currentQuestionId++;
        loadQuestion(currentQuestionId);
    }

    /**
     * NOVO: Reinicia o quiz do começo.
     */
    function restartQuiz() {
        currentQuestionId = 1; // Reseta o contador

        // Restaura a visibilidade dos elementos do quiz
        cardsContainer.style.display = ''; // Usa '' para voltar ao padrão do CSS
        nextButton.style.display = '';
        translationInputElement.disabled = false;
        
        // Esconde o botão de refazer
        restartButton.style.display = 'none';
        
        // Reseta o estado do card e do input
        cardsContainer.classList.remove('flipped');
        translationInputElement.value = '';

        // Garante que o botão "Verificar" esteja com a função e texto corretos
        nextButton.textContent = 'Verificar';
        nextButton.removeEventListener('click', loadNextQuestion); // Remove o listener antigo se houver
        nextButton.addEventListener('click', checkAnswer); // Adiciona o listener inicial

        // Carrega a primeira questão novamente
        loadQuestion(currentQuestionId);
    }

    // Adiciona os listeners iniciais aos botões
    nextButton.addEventListener('click', checkAnswer);
    restartButton.addEventListener('click', restartQuiz); // NOVO: Adiciona o evento ao botão de refazer
    
    // Chama a função para carregar a PRIMEIRA questão quando a página abre
    loadQuestion(currentQuestionId);
});