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

    render(renderingSecond = false, distanceFromTop) {
        const distanceFromLeft = this.distanceFromLeft + (renderingSecond ? this.width : 0);
        distanceFromTop = distanceFromTop || this.distanceFromTop;
        
        canvasContext.drawImage(
            sprites,
            this.x, this.y,
            this.width, this.height,
            distanceFromLeft, distanceFromTop,
            this.width, this.height
        );
    }
}

class FlappyBird extends spriteObj
{
    constructor(x, y, width, height, distanceFromLeft, distanceFromTop) {
        super(x, y, width, height, distanceFromLeft, distanceFromTop);
        
        this.baseDistanceFromTop = distanceFromTop;
        this.gravity = 0.225;
        this.velocity = 0;
        this.jumpHeight = 4.6;

        this.positions = [
            { x: 0, y: 0 },
            { x: 0, y: 26 },
            { x: 0, y: 52 }
        ];

        this.actualPosition = 0;
    }

    update() {
        if (this.crashOnGround() || this.crashOnPipe()) {
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

    crashOnPipe() {
        let crash = false;

        pipes.forEach(pipe => {
            const distanceToPipe = this.distanceFromLeft + this.width - pipe.distanceFromLeft;
            const distanceFromPipe = this.distanceFromLeft - (pipe.distanceFromLeft + pipe.width);
            
            if (distanceToPipe > 2 && distanceFromPipe <= 0) {
                if (this.distanceFromTop - (pipe.distanceFromTop + pipe.height) < 2 || (this.distanceFromTop + this.height) - pipe.secondPipeDistanceFromTop > 2)
                    crash = true;
            }
        });

        return crash;
    }

    animation() {
        if (actualFrame % 12 === 0) {
            if (this.actualPosition < this.positions.length - 1)
                this.actualPosition++;
            else
                this.actualPosition = 0;

            this.x = this.positions[this.actualPosition].x;
            this.y = this.positions[this.actualPosition].y;
        }
    }
}

class Ground extends spriteObj
{
    constructor(x, y, width, height, distanceFromLeft, distanceFromTop) {
        super(x, y, width, height, distanceFromLeft, distanceFromTop);
        
        this.velocity = 2;
    }

    update() {
        if ((this.width * -0.5) >= this.distanceFromLeft)
            this.distanceFromLeft = 0;

        this.distanceFromLeft -= this.velocity;
    }
}

class Pipes extends spriteObj
{
    constructor(topX, topY, bottomX, bottomY, width, height, distanceFromLeft) {
        super();

        this.width = width;
        this.height = height;
        this.distanceFromLeft = distanceFromLeft;

        this.topX = topX;
        this.topY = topY;
        this.bottomX = bottomX;
        this.bottomY = bottomY;

        this.distanceBetweenPipes = 100;
        this.velocity = 2;

        this.changePosition();
    }

    render() {
        this.x = this.topX;
        this.y = this.topY;
        
        super.render();

        this.x = this.bottomX;
        this.y = this.bottomY;
        
        super.render(false, this.secondPipeDistanceFromTop);
    }

    update() {
        if (this.distanceFromLeft <= -50) {
            this.distanceFromLeft = canvas.offsetWidth + 50;
            this.changePosition();
        }
            
        this.distanceFromLeft -= this.velocity;
    }

    changePosition() {
        this.distanceFromTop = -175 * (Math.random() + 1);
        this.secondPipeDistanceFromTop = this.height + this.distanceFromTop + this.distanceBetweenPipes;
    }
}



class Screen
{
    render() {
        canvasContext.fillStyle = '#70c5ce';
        canvasContext.fillRect(0,0, canvas.width, canvas.height);

        background.render();
        background.render(true);

        flappyBird.render();

        pipes.forEach(pipe => { pipe.render(); })
        
        ground.render();
        ground.render(true);
    }
    
    initialize() {}
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
        ground.update();
        flappyBird.animation();
    }

    click() {
        changeScreen(gameScreen);
    }
}

class GameScreen extends Screen
{
    render() {
        super.render();
        pipes.forEach(pipe => pipe.update());
        flappyBird.update();
        flappyBird.animation();
        ground.update();
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