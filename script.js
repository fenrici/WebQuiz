document.addEventListener("DOMContentLoaded", () => {
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const nextButton = document.getElementById("next-btn");

    let questions = [];
    let currentQuestion = 0;
    let score = 0; // NUEVO: variable para guardar la puntuación

    fetchQuestions(); // Cargar preguntas al iniciar la página

    async function fetchQuestions() {
        const apiUrl = "https://opentdb.com/api.php?amount=10&type=multiple";
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            questions = data.results.map((questionData) => {
                let options = [...questionData.incorrect_answers, questionData.correct_answer];
                options = options.sort(() => Math.random() - 0.5);

                return {
                    question: decodeHTML(questionData.question),
                    options: options.map(option => decodeHTML(option)),
                    answer: options.indexOf(decodeHTML(questionData.correct_answer))
                };
            });
            loadQuestion();
        } catch (error) {
            console.error("Error al obtener las preguntas:", error);
            if (questionText) {
                questionText.innerText = "No se pudieron cargar las preguntas, por favor intente más tarde.";
            }
        }
    }

    function loadQuestion() {
        if (currentQuestion >= questions.length) {
            if (questionText) {
                questionText.innerText = "¡Has completado el quiz! Redirigiendo...";
            }
            optionsContainer.innerHTML = "";
            nextButton.style.display = "none";

            // GUARDAR PUNTUACIÓN EN localStorage
            localStorage.setItem("puntuacionFinal", score);

            setTimeout(() => {
                window.location.href = "results.html";
            }, 2000);
            return;
        }

        const questionData = questions[currentQuestion];
        if (questionText) {
            questionText.innerText = questionData.question;
        }

        optionsContainer.innerHTML = "";
        questionData.options.forEach((option, index) => {
            const optionButton = document.createElement("button");
            optionButton.classList.add("option-btn");
            optionButton.innerText = option;
            optionButton.addEventListener("click", () => checkAnswer(index));
            optionsContainer.appendChild(optionButton);
        });

        nextButton.style.display = "none";
    }

    function checkAnswer(index) {
        const correctIndex = questions[currentQuestion].answer;
        const buttons = document.querySelectorAll(".option-btn");

        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === correctIndex) {
                btn.classList.add("correct");
            } else if (i === index) {
                btn.classList.add("incorrect");
            }
        });

        if (index === correctIndex) {
            score++;
        }

        nextButton.style.display = "block";
    }

    nextButton?.addEventListener("click", () => {
        currentQuestion++;
        loadQuestion();
    });

    // MOSTRAR RESULTADO EN results.html
    const puntuacionSpan = document.getElementById("puntuacion");
    if (puntuacionSpan) {
        const puntuacion = localStorage.getItem("puntuacionFinal");
        if (puntuacion !== null) {
            puntuacionSpan.textContent = `${puntuacion}/10`;
        } else {
            puntuacionSpan.textContent = "No disponible";
        }
    }

    function decodeHTML(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
});