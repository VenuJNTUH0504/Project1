// This file handles the quiz functionality, including displaying questions and recording answers.

document.addEventListener('DOMContentLoaded', function() {
    const quizContainer = document.getElementById('quiz-container');
    const submitButton = document.getElementById('submit-quiz');
    const resultsContainer = document.getElementById('results-container');
    let currentQuestionIndex = 0;
    let score = 0;
    let quizData = [];

    // Fetch quiz data from the server or local storage
    function fetchQuizData() {
        // This is a placeholder for fetching quiz data
        // In a real application, you would fetch this from an API or database
        quizData = [
            {
                question: "What is the capital of France?",
                options: ["Berlin", "Madrid", "Paris", "Lisbon"],
                answer: "Paris"
            },
            {
                question: "Which language is primarily spoken in Brazil?",
                options: ["Spanish", "Portuguese", "English", "French"],
                answer: "Portuguese"
            },
            {
                question: "What is the largest planet in our solar system?",
                options: ["Earth", "Mars", "Jupiter", "Saturn"],
                answer: "Jupiter"
            }
        ];
        displayQuestion();
    }

    // Display the current question
    function displayQuestion() {
        const currentQuestion = quizData[currentQuestionIndex];
        quizContainer.innerHTML = `
            <h2>${currentQuestion.question}</h2>
            ${currentQuestion.options.map((option, index) => `
                <div>
                    <input type="radio" name="answer" id="option${index}" value="${option}">
                    <label for="option${index}">${option}</label>
                </div>
            `).join('')}
        `;
    }

    // Handle quiz submission
    submitButton.addEventListener('click', function() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
            if (selectedOption.value === quizData[currentQuestionIndex].answer) {
                score++;
            }
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                displayQuestion();
            } else {
                showResults();
            }
        } else {
            alert("Please select an answer before submitting.");
        }
    });

    // Show the results of the quiz
    function showResults() {
        quizContainer.style.display = 'none';
        resultsContainer.innerHTML = `
            <h2>Your Score: ${score} out of ${quizData.length}</h2>
            <button id="restart-quiz">Restart Quiz</button>
        `;
        document.getElementById('restart-quiz').addEventListener('click', restartQuiz);
    }

    // Restart the quiz
    function restartQuiz() {
        score = 0;
        currentQuestionIndex = 0;
        resultsContainer.innerHTML = '';
        quizContainer.style.display = 'block';
        displayQuestion();
    }

    // Initialize the quiz
    fetchQuizData();
});