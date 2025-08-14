const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const questionModal = document.getElementById('questionModal');
const questionText = document.getElementById('questionText');
const answersContainer = document.getElementById('answers');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreSpan = document.getElementById('finalScore');
const correctAnswersSpan = document.getElementById('correctAnswers');

canvas.width = 800;
canvas.height = 200;

let gameSpeed = 5;
let score = 0;
let correctAnswersCount = 0;
let isJumping = false;
let isGameOver = false;

// Objeto para el jugador (dinosaurio)
const player = {
    x: 50,
    y: canvas.height - 40,
    width: 40,
    height: 40,
    velocityY: 0,
    gravity: 0.9,
    jumpStrength: -15
};

// Array de obstáculos
let obstacles = [];

// Array de preguntas (usando preguntas sobre LLM del chat anterior)
const questions = [
    {
        question: "¿Qué significa la sigla LLM?",
        options: ["Modelos de Lenguaje Ligero", "Modelos de Lenguaje Grande", "Máquinas de Lenguaje Lento"],
        answer: "Modelos de Lenguaje Grande"
    },
    {
        question: "¿Qué usa un LLM para aprender a hablar?",
        options: ["Solamente el sonido de las palabras", "Millones de libros y textos de internet", "La música de canciones populares"],
        answer: "Millones de libros y textos de internet"
    },
    {
        question: "¿Cuál de estos es un ejemplo de un LLM?",
        options: ["Una calculadora", "Un robot de cocina", "Un asistente de chat como ChatGPT"],
        answer: "Un asistente de chat como ChatGPT"
    },
    {
        question: "¿Cuál es una de las cosas que un LLM NO puede hacer?",
        options: ["Escribir un poema", "Sentir emociones y tener amigos de verdad", "Explicar un tema difícil"],
        answer: "Sentir emociones y tener amigos de verdad"
    },
    {
        question: "La 'predicción' en un LLM es su capacidad para...",
        options: ["Adivinar el futuro", "Adivinar la siguiente palabra en una frase", "Decir qué imagen es más popular"],
        answer: "Adivinar la siguiente palabra en una frase"
    }
];

let currentQuestion = null;

// Dibuja el jugador
function drawPlayer() {
    ctx.fillStyle = '#5cb85c';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Dibuja los obstáculos
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = '#d9534f';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Actualiza la posición de los obstáculos
function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

// Genera un nuevo obstáculo
function generateObstacle() {
    if (Math.random() < 0.015) {
        const newObstacle = {
            x: canvas.width,
            y: canvas.height - 50,
            width: 25,
            height: 50
        };
        obstacles.push(newObstacle);
    }
}

// Detección de colisiones
function checkCollision() {
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            // Colisión detectada, mostrar pregunta
            showQuestion();
        }
    });
}

// Muestra la ventana de preguntas
function showQuestion() {
    isGameOver = true;
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    questionText.textContent = currentQuestion.question;
    answersContainer.innerHTML = '';
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        answersContainer.appendChild(button);
    });
    questionModal.style.display = 'block';
}

// Comprueba la respuesta de la pregunta
function checkAnswer(selectedOption) {
    questionModal.style.display = 'none';
    if (selectedOption === currentQuestion.answer) {
        correctAnswersCount++;
        score += 50; // Puntos extra por respuesta correcta
        isGameOver = false; // Continuar el juego
        obstacles = []; // Limpiar obstáculos para un reinicio suave
        gameLoop();
    } else {
        showGameOver(); // Terminar el juego si la respuesta es incorrecta
    }
}

// Muestra la ventana de fin del juego
function showGameOver() {
    isGameOver = true;
    finalScoreSpan.textContent = score;
    correctAnswersSpan.textContent = correctAnswersCount;
    gameOverModal.style.display = 'block';
}

// Bucle principal del juego
function gameLoop() {
    if (isGameOver) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Actualiza la lógica del jugador
    player.y += player.velocityY;
    player.velocityY += player.gravity;
    if (player.y >= canvas.height - player.height) {
        player.y = canvas.height - player.height;
        isJumping = false;
    }
    
    // Dibuja el jugador, obstáculos y actualiza la puntuación
    drawPlayer();
    updateObstacles();
    drawObstacles();
    generateObstacle();
    checkCollision();

    score += 1; // Puntos por tiempo sobrevivido
    scoreDisplay.textContent = `Puntuación: ${score}`;

    requestAnimationFrame(gameLoop);
}

// Maneja la acción de saltar
function handleJump(event) {
    if ((event.code === 'Space' || event.code === 'ArrowUp') && !isJumping) {
        player.velocityY = player.jumpStrength;
        isJumping = true;
    }
}

// Inicia el juego
document.addEventListener('keydown', handleJump);
gameLoop();