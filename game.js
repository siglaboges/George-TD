const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;


// Test enemy
let enemy = {
    x: 50,
    y: 200,
    speed: 2
};


function gameLoop(){

    // background
    ctx.fillStyle = "#6ac34a";
    ctx.fillRect(0,0,900,600);


    // path
    ctx.strokeStyle = "#b88652";
    ctx.lineWidth = 80;

    ctx.beginPath();
    ctx.moveTo(0,200);
    ctx.lineTo(600,200);
    ctx.lineTo(600,450);
    ctx.lineTo(900,450);
    ctx.stroke();


    // move enemy
    enemy.x += enemy.speed;


    // draw enemy (red square test)
    ctx.fillStyle = "red";
    ctx.fillRect(
        enemy.x,
        enemy.y,
        50,
        50
    );


    requestAnimationFrame(gameLoop);

}


gameLoop();
