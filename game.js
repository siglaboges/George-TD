const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;


// Load enemy sprite
const enemyImg = new Image();
enemyImg.src = "sprite/enemy.png";


// Enemy data
let enemy = {
    x: -50,
    y: 200,
    hp: 10,
    maxHp: 10,
    speed: 2,
    size: 50,
    pathPoint: 0
};


// Path points
const path = [
    {x: 0, y: 200},
    {x: 600, y: 200},
    {x: 600, y: 450},
    {x: 900, y: 450}
];


// UI
let coins = 500;
let gems = 0;
let lives = 100;
let stage = 1;



function drawMap(){

    // Grass
    ctx.fillStyle = "#6ac34a";
    ctx.fillRect(0,0,canvas.width,canvas.height);


    // Dirt path
    ctx.strokeStyle = "#b88652";
    ctx.lineWidth = 80;
    ctx.lineCap = "round";

    ctx.beginPath();

    ctx.moveTo(path[0].x,path[0].y);

    for(let i = 1; i < path.length; i++){
        ctx.lineTo(path[i].x,path[i].y);
    }

    ctx.stroke();
}



function moveEnemy(){

    let target = path[enemy.pathPoint + 1];


    if(!target){
        // enemy escaped
        enemy.x = -50;
        enemy.y = 200;
        enemy.pathPoint = 0;
        lives--;
        return;
    }


    let dx = target.x - enemy.x;
    let dy = target.y - enemy.y;

    let distance = Math.sqrt(dx*dx + dy*dy);


    if(distance < enemy.speed){

        enemy.x = target.x;
        enemy.y = target.y;
        enemy.pathPoint++;

    } else {

        enemy.x += (dx / distance) * enemy.speed;
        enemy.y += (dy / distance) * enemy.speed;

    }
}



function drawEnemy(){

    // enemy image
    ctx.drawImage(
        enemyImg,
        enemy.x - enemy.size/2,
        enemy.y - enemy.size/2,
        enemy.size,
        enemy.size
    );


    // HP bar background
    ctx.fillStyle = "black";
    ctx.fillRect(
        enemy.x - 25,
        enemy.y - 40,
        50,
        8
    );


    // HP
    ctx.fillStyle = "red";
    ctx.fillRect(
        enemy.x - 25,
        enemy.y - 40,
        50 * (enemy.hp/enemy.maxHp),
        8
    );
}



function drawUI(){

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,50);


    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    ctx.fillText("$" + coins,20,32);
    ctx.fillText("💎 " + gems,150,32);
    ctx.fillText("❤️ " + lives,280,32);
    ctx.fillText("Stage " + stage,430,32);

}



function gameLoop(){

    drawMap();

    moveEnemy();

    drawEnemy();

    drawUI();


    requestAnimationFrame(gameLoop);

}


gameLoop();
