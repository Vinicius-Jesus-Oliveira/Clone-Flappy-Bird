const sprites = new Image();
sprites.src = "./assets/flappy bird sprites.png";

const canvas = document.getElementById("game-canva");
const canvasContext = canvas.getContext("2d");

const hit_sound = new Audio();
hit_sound.src = "./assets/sounds/hit.wav";

const fall_sound = new Audio();
fall_sound.src = "./assets/sounds/fall.wav";

const jump_sound = new Audio();
jump_sound.src = "./assets/sounds/jump.wav";

class spriteObj
{
    constructor(x, y, width, height, distanceFromLeft, distanceFromTop) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.distanceFromLeft = distanceFromLeft;
        this.distanceFromTop = distanceFromTop;
    }

    render(renderingSecond = false) {
        const distanceFromLeft = this.distanceFromLeft + (renderingSecond ? this.width : 0);
        
        canvasContext.drawImage(
            sprites,
            this.x, this.y,
            this.width, this.height,
            distanceFromLeft, this.distanceFromTop,
            this.width, this.height
        );
    }
}

class FlappyBird extends spriteObj
{
    constructor(x, y, width, height, distanceFromLeft, distanceFromTop) {
        super(x, y, width, height, distanceFromLeft, distanceFromTop);
        
        this.baseDistanceFromTop = distanceFromTop;
        this.gravity = 0.25;
        this.velocity = 0;
        this.jumpHeight = 4.6;
    }

    update() {
        if (this.crashOnGround()) {
            hit_sound.play();
            changeScreen(endScreen);
        }

        this.velocity += this.gravity;
        this.distanceFromTop += this.velocity;
    }

    jump() {
        this.velocity -= this.jumpHeight;
        jump_sound.play();
    }

    crashOnGround = () => ground.distanceFromTop - (this.distanceFromTop + this.height) <= 0;
}

var flappyBird, ground, background, startGame, endGame;

function CreateInstances() {
    flappyBird = new FlappyBird(0, 0, 34, 24, 45, canvas.offsetHeight / 3);
    ground = new spriteObj(0, 610, 224, 112, 0, canvas.offsetHeight - 112);
    background = new spriteObj(390, 0, 276, 204, 0, canvas.offsetHeight - 204);
    startGame = new spriteObj(134, 0, 174, 152, canvas.offsetWidth / 2 - 87, canvas.offsetHeight / 5);
    endGame = new spriteObj(134, 153, 226, 200, canvas.offsetWidth / 2 - 113, canvas.offsetHeight / 5);
}

CreateInstances();

class Screen
{
    render() {
        canvasContext.fillStyle = '#70c5ce';
        canvasContext.fillRect(0,0, canvas.width, canvas.height);

        background.render();
        background.render(true);

        flappyBird.render();
        
        ground.render();
        ground.render(true);
    }

    update() {}
    click() {}
}

class StartScreen extends Screen
{
    initialize() {
        CreateInstances();
    }

    render() {
        super.render();
        startGame.render();
    }

    click() {
        changeScreen(gameScreen);
    }
}

class GameScreen extends Screen
{
    update() {
        flappyBird.update();
    }

    click() {
        flappyBird.jump();
    }
}

class EndScreen extends Screen
{
    render() {
        super.render();
        endGame.render();
    }

    click() {
        changeScreen(startScreen);
    }
}

const startScreen = new StartScreen();
const gameScreen = new GameScreen();
const endScreen = new EndScreen();

let activeScreen = startScreen;

function changeScreen(screen) {
    activeScreen = screen;

    if (screen.initialize)
        screen.initialize();
}

function gameLoop() {
    activeScreen.render();
    activeScreen.update();
    
    requestAnimationFrame(gameLoop);
}

window.addEventListener("click", () => activeScreen.click());

window.onload = gameLoop;