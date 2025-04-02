document.addEventListener("DOMContentLoaded", () => {
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const nextButton = document.getElementById("next-btn");
    
    let questions = [];
    let currentQuestion = 0;

    fetchQuestions(); // Cargar preguntas al iniciar la página

    async function fetchQuestions() {
        const apiUrl = "https://opentdb.com/api.php?amount=10&type=multiple";
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            questions = data.results.map((questionData) => {
                let options = [...questionData.incorrect_answers, questionData.correct_answer];
                options = options.sort(() => Math.random() - 0.5); // Mezclar opciones

                return {
                    question: decodeHTML(questionData.question),
                    options: options.map(option => decodeHTML(option)),
                    answer: options.indexOf(questionData.correct_answer) // Guardar índice de la respuesta correcta
                };
            });
            loadQuestion();
        } catch (error) {
            console.error("Error al obtener las preguntas:", error);
            questionText.innerText = "No se pudieron cargar las preguntas, por favor intente más tarde.";
        }
    }

    function loadQuestion() {
        if (currentQuestion >= questions.length) {
            questionText.innerText = "¡Has completado el quiz!";
            optionsContainer.innerHTML = "";
            nextButton.style.display = "none";
            return;
        }

        const questionData = questions[currentQuestion];
        questionText.innerText = questionData.question;
        
        optionsContainer.innerHTML = ""; // Limpiar opciones anteriores
        questionData.options.forEach((option, index) => {
            const optionButton = document.createElement("button");
            optionButton.classList.add("option-btn");
            optionButton.innerText = option;
            optionButton.addEventListener("click", () => checkAnswer(index));
            optionsContainer.appendChild(optionButton);
        });

        nextButton.style.display = "none"; // Ocultar botón hasta que el usuario responda
    }

    function checkAnswer(index) {
        const correctIndex = questions[currentQuestion].answer;
        const buttons = document.querySelectorAll(".option-btn");
    
        buttons.forEach((btn, i) => {
            btn.disabled = true; // Deshabilitar botones después de responder
            if (i === correctIndex) {
                btn.classList.add("correct"); // Resalta la correcta en verde
            } else if (i === index) {
                btn.classList.add("incorrect"); // Resalta la incorrecta en rojo
            }
        });
    
        nextButton.style.display = "block"; // Mostrar botón de siguiente
    }
    

    nextButton.addEventListener("click", () => {
        currentQuestion++;
        loadQuestion();
    });

    function decodeHTML(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
});

