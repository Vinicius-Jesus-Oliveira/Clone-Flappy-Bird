const sprites = new Image();
sprites.src = "./assets/flappy bird sprites.png";

const canvas = document.getElementById("game-canva");
const canvasContext = canvas.getContext("2d");

let actualFrame = 0;

const hit_sound = new Audio();
hit_sound.src = "./assets/sounds/hit.wav";

const fall_sound = new Audio();
fall_sound.src = "./assets/sounds/fall.wav";

const jump_sound = new Audio();
jump_sound.src = "./assets/sounds/jump.wav";

var flappyBird,
    ground,
    background,
    startGame,
    endGame,
    pipes,
    medal,
    punctuation = 0,
    maxPunctuation = localStorage.getItem("flappyBird-maxPunctuation") || 0;
    

function CreateInstances() {
    flappyBird = new FlappyBird(0, 0, 34, 24, 45, canvas.offsetHeight / 3);
    ground = new Ground(0, 610, 224, 112, 0, canvas.offsetHeight - 112);
    background = new spriteObj(390, 0, 276, 204, 0, canvas.offsetHeight - 204);
    startGame = new spriteObj(134, 0, 174, 152, canvas.offsetWidth / 2 - 87, canvas.offsetHeight / 5);
    endGame = new spriteObj(134, 153, 226, 200, canvas.offsetWidth / 2 - 113, canvas.offsetHeight / 5);
    pipes = [
        new Pipes(52, 169, 0, 169, 52, 400, canvas.offsetWidth + 50, -200),
        new Pipes(52, 169, 0, 169, 52, 400, canvas.offsetWidth + 250, -200)
    ];
    medal = new Medal(44, 44, 75, 183);
}

CreateInstances();

const renderPipes = () => pipes.forEach(pipe => { pipe.render(); pipe.update(); });

function writeFinalPunctuation() {
    canvasContext.font = "23px arial";
    canvasContext.textAlign = "right";
    canvasContext.fillStyle = "#FFFFFF";
    canvasContext.lineWidth = 5;

    const distanceFromLeft = canvas.offsetWidth - 70;

    canvasContext.strokeText(punctuation, distanceFromLeft, 192);
    canvasContext.fillText(punctuation, distanceFromLeft, 192);

    canvasContext.strokeText(maxPunctuation, distanceFromLeft, 233);
    canvasContext.fillText(maxPunctuation, distanceFromLeft, 233);
}

const startScreen = new StartScreen();
const gameScreen = new GameScreen();
const endScreen = new EndScreen();

let activeScreen = startScreen;

function changeScreen(screen) {
    activeScreen = screen;
    screen.initialize();
}

function gameLoop() {
    activeScreen.render();
    actualFrame++;
    requestAnimationFrame(gameLoop);
}

window.addEventListener('click', () => {
    if (activeScreen.constructor.name == "EndScreen")
        activeScreen.click();
});

window.addEventListener('keydown', event => {
    if ((event.code === "ArrowUp" || event.code === "Space") && (activeScreen.constructor.name == "StartScreen" || activeScreen.constructor.name == "GameScreen"))
        activeScreen.click();
});

window.onload = gameLoop;