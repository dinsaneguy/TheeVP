const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 500;
canvas.height = 600;

// Game settings
const bubbleRadius = 20;
const shooterX = canvas.width / 2;
const shooterY = canvas.height - 50;
const colors = ["red", "blue", "green", "yellow", "purple"];
let bubbles = [];
let shootingBubble = createBubble(shooterX, shooterY, randomColor(), 0, 0);
let angle = Math.PI / 2; // Aiming direction
let isShooting = false;

// Function to create a bubble
function createBubble(x, y, color, dx, dy) {
    return { x, y, color, dx, dy };
}

// Generate random color
function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Add stationary bubbles at the top
for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
        const x = col * bubbleRadius * 2 + bubbleRadius;
        const y = row * bubbleRadius * 2 + bubbleRadius;
        bubbles.push(createBubble(x, y, randomColor(), 0, 0));
    }
}

// Draw bubbles
function drawBubble(bubble) {
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubbleRadius, 0, Math.PI * 2);
    ctx.fillStyle = bubble.color;
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.closePath();
}

// Draw aim line
function drawAimingGuide() {
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(shooterX, shooterY);
    ctx.lineTo(shooterX + Math.cos(angle) * 100, shooterY - Math.sin(angle) * 100);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.setLineDash([]);
}

// Handle shooting bubble movement
function moveShootingBubble() {
    if (isShooting) {
        shootingBubble.x += shootingBubble.dx;
        shootingBubble.y += shootingBubble.dy;

        // Bounce off walls
        if (shootingBubble.x - bubbleRadius <= 0 || shootingBubble.x + bubbleRadius >= canvas.width) {
            shootingBubble.dx *= -1;
        }

        // Collision detection with stationary bubbles
        for (let i = 0; i < bubbles.length; i++) {
            const bubble = bubbles[i];
            const dist = Math.sqrt(
                (shootingBubble.x - bubble.x) ** 2 + (shootingBubble.y - bubble.y) ** 2
            );

            if (dist < bubbleRadius * 2) {
                bubbles.push(createBubble(shootingBubble.x, shootingBubble.y, shootingBubble.color, 0, 0));
                checkMatches();
                resetShootingBubble();
                return;
            }
        }

        // Stop when reaching the top
        if (shootingBubble.y - bubbleRadius <= 0) {
            bubbles.push(createBubble(shootingBubble.x, shootingBubble.y, shootingBubble.color, 0, 0));
            checkMatches();
            resetShootingBubble();
        }
    }
}

// Reset the shooting bubble
function resetShootingBubble() {
    isShooting = false;
    shootingBubble = createBubble(shooterX, shooterY, randomColor(), 0, 0);
}

// Match-3 check
function checkMatches() {
    const toRemove = [];
    
    for (let i = 0; i < bubbles.length; i++) {
        const bubble = bubbles[i];
        let connected = [bubble];

        for (let j = 0; j < bubbles.length; j++) {
            if (i !== j && bubbles[j].color === bubble.color) {
                const dist = Math.sqrt(
                    (bubble.x - bubbles[j].x) ** 2 + (bubble.y - bubbles[j].y) ** 2
                );

                if (dist < bubbleRadius * 2) {
                    connected.push(bubbles[j]);
                }
            }
        }

        if (connected.length >= 3) {
            toRemove.push(...connected);
        }
    }

    bubbles = bubbles.filter(bubble => !toRemove.includes(bubble));
}

// Render loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw stationary bubbles
    bubbles.forEach(drawBubble);

    // Draw shooter bubble
    drawBubble(shootingBubble);

    // Draw aiming guide
    if (!isShooting) drawAimingGuide();

    moveShootingBubble();

    requestAnimationFrame(draw);
}

// Handle shooting
function shootBubble() {
    if (!isShooting) {
        isShooting = true;
        shootingBubble.dx = Math.cos(angle) * 5;
        shootingBubble.dy = -Math.sin(angle) * 5;
    }
}

// Handle aiming with arrow keys
document.addEventListener("keydown", (event) => {
    if (!isShooting) {
        if (event.key === "ArrowLeft" && angle < Math.PI - 0.2) {
            angle += 0.1;
        } else if (event.key === "ArrowRight" && angle > 0.2) {
            angle -= 0.1;
        }
    }

    if (event.key === " ") {
        shootBubble();
    }
});

// Start the game loop
draw();
