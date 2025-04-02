document.addEventListener("DOMContentLoaded", () => {
    const quizContainer = document.getElementById("quiz-container");
    const startButton = document.getElementById("start-quiz");
  
    if (quizContainer && startButton) {
      let questions = [];
      let currentQuestion = 0;
      let score = 0;
  
      startButton.addEventListener("click", startQuiz);
  
      async function fetchQuestions() {
        const apiUrl = "https://opentdb.com/api.php?amount=10&type=multiple";
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
  
          questions = data.results.map((questionData) => {
            const incorrect = [...questionData.incorrect_answers];
            const correct = questionData.correct_answer;
            const randomIndex = Math.floor(Math.random() * (incorrect.length + 1));
            incorrect.splice(randomIndex, 0, correct); // Preguntas en modo aleatorio
  
            return {
              question: questionData.question,
              options: incorrect,
              answer: randomIndex
            };
          });
  
          loadQuestion();
        } catch (error) {
          console.error("Error al obtener las preguntas:", error);
          quizContainer.innerHTML = "<p>No se pudieron cargar las preguntas, por favor intente más tarde.</p>";
        }
      }
  
      function startQuiz() {
        startButton.style.display = "none";
        fetchQuestions();
      }
  
      function loadQuestion() {
        if (currentQuestion >= questions.length) {
          quizContainer.innerHTML = "<h2>¡Has completado el quiz!</h2>";
  
          localStorage.setItem("puntuacionFinal", score);
  
          setTimeout(() => {
            window.location.href = "results.html";
          }, 2000);
          return;
        }
  
        const questionData = questions[currentQuestion];
        quizContainer.innerHTML = `
          <h2>${questionData.question}</h2>
          <div class="options-container">
            ${questionData.options.map((option, index) =>
              `<div class="option-box">
                <button class="option-btn" onclick="checkAnswer(${index})">${option}</button>
              </div>`).join('')}
          </div>
        `;
      }
  
      window.checkAnswer = function(index) {
        if (index === questions[currentQuestion].answer) {
          alert("¡Correcto!");
          score++;
        } else {
          alert("Incorrecto, intenta de nuevo.");
        }
        currentQuestion++;
        loadQuestion();
      };
    }
  
    // Mostrar resultados si estamos en la página results
    const puntuacionSpan = document.getElementById("puntuacion");
    if (puntuacionSpan) {
      const puntuacion = localStorage.getItem("puntuacionFinal");
      if (puntuacion !== null) {
        puntuacionSpan.textContent = `${puntuacion}/10`;
      } else {
        puntuacionSpan.textContent = "No disponible";
      }
  
      
    }
  });