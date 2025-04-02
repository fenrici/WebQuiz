document.addEventListener("DOMContentLoaded", () => {
    const quizContainer = document.getElementById("quiz-container");
    const startButton = document.getElementById("start-quiz");
    let questions = [];
    let currentQuestion = 0;

    startButton.addEventListener("click", startQuiz);

    // Función para obtener preguntas de la API de Open Trivia
    async function fetchQuestions() {
        const apiUrl = "https://opentdb.com/api.php?amount=10&type=multiple";  // Se piden 10 preguntas de opción múltiple
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            questions = data.results.map((questionData) => {
                return {
                    question: questionData.question,
                    options: [...questionData.incorrect_answers, questionData.correct_answer],
                    answer: questionData.incorrect_answers.length // El índice de la respuesta correcta
                };
            });
            loadQuestion();  // Cargar la primera pregunta cuando ya se obtienen
        } catch (error) {
            console.error("Error al obtener las preguntas:", error);
            quizContainer.innerHTML = "<p>No se pudieron cargar las preguntas, por favor intente más tarde.</p>";
        }
    }

    function startQuiz() {
        startButton.style.display = "none";
        fetchQuestions();  // Iniciar la carga de preguntas
    }

    function loadQuestion() {
        if (currentQuestion >= questions.length) {
            quizContainer.innerHTML = "<h2>¡Has completado el quiz!</h2>";
            return;
        }

        const questionData = questions[currentQuestion];
        quizContainer.innerHTML = `
            <h2>${questionData.question}</h2>
            <div class="options-container">
                ${questionData.options.map((option, index) => 
                    `<div class="option-box"><button class="option-btn" onclick="checkAnswer(${index})">${option}</button></div>`).join('')}
            </div>
        `;
    }

    window.checkAnswer = function(index) {
        if (index === questions[currentQuestion].answer) {
            alert("¡Correcto!");
        } else {
            alert("Incorrecto, intenta de nuevo.");
        }
        currentQuestion++;
        loadQuestion();
    };
});

