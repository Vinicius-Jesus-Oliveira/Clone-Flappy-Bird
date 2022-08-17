const sprites = new Image();
sprites.src = "./assets/flappy bird sprites.png";

const canvas = document.getElementById("game-canva");
const canvasContext = canvas.getContext("2d");

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

class flappyBird extends spriteObj
{
    constructor(x, y, width, height, distanceFromLeft, distanceFromTop) {
        super(x, y, width, height, distanceFromLeft, distanceFromTop);
        
        this.baseDistanceFromTop = distanceFromTop;
        this.gravity = 0.25;
        this.velocity = 0;
    }

    update() {
        this.velocity += this.gravity;
        this.distanceFromTop += this.velocity;
    }
}

const flappyBird1 = new flappyBird(0, 0, 34, 24, 45, canvas.offsetHeight / 3);
const flappyBird2 = new flappyBird(0, 26, 34, 24, 45, canvas.offsetHeight / 3);
const flappyBird3 = new flappyBird(0, 52, 34, 24, 45, canvas.offsetHeight / 3);
const ground = new spriteObj(0, 610, 224, 112, 0, canvas.offsetHeight - 112);
const background = new spriteObj(390, 0, 276, 204, 0, canvas.offsetHeight - 204);
const startGame = new spriteObj(134, 0, 174, 152, canvas.offsetWidth / 2 - 87, canvas.offsetHeight / 5);

class Screen
{
    render() {
        canvasContext.fillStyle = '#70c5ce';
        canvasContext.fillRect(0,0, canvas.width, canvas.height);

        background.render();
        background.render(true);

        flappyBird1.render();
        
        ground.render();
        ground.render(true);
    }

    update() {}
}

class StartScreen extends Screen
{
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
        flappyBird1.update();
    }
}

const startScreen = new StartScreen();
const gameScreen = new GameScreen();

let activeScreen = startScreen;

function changeScreen(screen) {
    activeScreen = screen;
}

function gameLoop() {
    activeScreen.render();
    activeScreen.update();
    
    requestAnimationFrame(gameLoop);
}

window.addEventListener("click", () => {
    if (activeScreen.click)
        activeScreen.click();
});

window.onload = gameLoop;