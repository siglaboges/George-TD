const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let money = 500;
let gems = 0;
let lives = 100;
let stage = 1;

function drawBackground() {
    // Grass
    ctx.fillStyle = "#6fcf5c";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Path
    ctx.fillStyle = "#d6b26d";

    ctx.fillRect(0, 260, 250, 80);
    ctx.fillRect(250, 260, 80, 220);
    ctx.fillRect(250, 400, 450, 80);
    ctx.fillRect(620, 150, 80, 330);
    ctx.fillRect(620, 150, 300, 80);
}

function drawUI() {

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0,0,1000,40);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    ctx.fillText("$ " + money,20,27);
    ctx.fillText("💎 " + gems,150,27);
    ctx.fillText("❤ " + lives,260,27);
    ctx.fillText("Stage " + stage,380,27);
}

function gameLoop(){

    ctx.clearRect(0,0,WIDTH,HEIGHT);

    drawBackground();
    drawUI();

    requestAnimationFrame(gameLoop);
}

gameLoop();
