const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 600;

const paddleWidth = 100, paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 7;

const ballRadius = 8;
let ballX = canvas.width / 2, ballY = canvas.height - 40;
let ballSpeedX = 4, ballSpeedY = -4;

const brickRowCount = 5, brickColumnCount = 7;
const brickWidth = 60, brickHeight = 20, brickPadding = 10, brickOffsetTop = 50, brickOffsetLeft = 35;
let bricks = [];

let gameRunning = false;
let animationFrame;

function initBricks() {
    for (let row = 0; row < brickRowCount; row++) {
        bricks[row] = [];
        for (let col = 0; col < brickColumnCount; col++) {
            bricks[row][col] = { x: 0, y: 0, status: 1 };
        }
    }
}

initBricks();

function drawPaddle() {
    ctx.fillStyle = "white";
    ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let row = 0; row < brickRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
            if (bricks[row][col].status === 1) {
                let brickX = col * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = row * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[row][col].x = brickX;
                bricks[row][col].y = brickY;
                ctx.fillStyle = "blue";
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX - ballRadius <= 0 || ballX + ballRadius >= canvas.width) ballSpeedX *= -1;
    if (ballY - ballRadius <= 0) ballSpeedY *= -1;

    if (
        ballY + ballRadius >= canvas.height - paddleHeight - 10 &&
        ballX > paddleX &&
        ballX < paddleX + paddleWidth
    ) {
        ballSpeedY *= -1;
        let deltaX = ballX - (paddleX + paddleWidth / 2);
        ballSpeedX = deltaX * 0.15;
    }

    for (let row = 0; row < brickRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
            let brick = bricks[row][col];
            if (brick.status === 1) {
                if (
                    ballX > brick.x &&
                    ballX < brick.x + brickWidth &&
                    ballY > brick.y &&
                    ballY < brick.y + brickHeight
                ) {
                    ballSpeedY *= -1;
                    brick.status = 0;
                }
            }
        }
    }

    if (ballY + ballRadius >= canvas.height) {
        showGameOver();
    }
}

let rightPressed = false, leftPressed = false;
document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") rightPressed = true;
    if (event.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", event => {
    if (event.key === "ArrowRight") rightPressed = false;
    if (event.key === "ArrowLeft") leftPressed = false;
});

function movePaddle() {
    if (rightPressed && paddleX + paddleWidth < canvas.width) {
        paddleX += paddleSpeed;
    }
    if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
}

function showGameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationFrame);
    document.getElementById("gameOverAlert").classList.remove("hidden");
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        draw();
    }
}

function pauseGame() {
    gameRunning = false;
    cancelAnimationFrame(animationFrame);
}

function restartGame() {
    document.getElementById("gameOverAlert").classList.add("hidden");
    ballX = canvas.width / 2;
    ballY = canvas.height - 40;
    ballSpeedX = 4;
    ballSpeedY = -4;
    paddleX = (canvas.width - paddleWidth) / 2;
    initBricks();
    gameRunning = true;
    draw();
}

function draw() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    movePaddle();
    moveBall();
    animationFrame = requestAnimationFrame(draw);
}
