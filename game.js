const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;


// =================
// ENEMY IMAGE
// =================

const enemyImg = new Image();
enemyImg.src = "sprite/enemy.png";


// =================
// PLAYER STATS
// =================

let coins = 500;
let gems = 0;
let lives = 100;
let stage = 1;


// =================
// PATH
// =================

const path = [
    {x:0, y:200},
    {x:600, y:200},
    {x:600, y:450},
    {x:900, y:450}
];


// =================
// ENEMY
// =================

let enemy = {
    x:0,
    y:200,
    speed:2,
    point:1
};


// =================
// DRAW MAP
// =================

function drawMap(){

    ctx.fillStyle="#6ac34a";
    ctx.fillRect(0,0,900,600);


    ctx.strokeStyle="#b88652";
    ctx.lineWidth=80;
    ctx.lineCap="round";


    ctx.beginPath();

    ctx.moveTo(path[0].x,path[0].y);

    for(let i=1;i<path.length;i++){
        ctx.lineTo(path[i].x,path[i].y);
    }

    ctx.stroke();

}



// =================
// MOVE ENEMY
// =================

function moveEnemy(){

    let target = path[enemy.point];


    let dx = target.x - enemy.x;
    let dy = target.y - enemy.y;

    let distance = Math.sqrt(dx*dx + dy*dy);


    if(distance < enemy.speed){

        enemy.x = target.x;
        enemy.y = target.y;

        enemy.point++;


        // enemy escaped
        if(enemy.point >= path.length){

            lives--;

            console.log("Lives:", lives);


            // reset enemy
            enemy.x=0;
            enemy.y=200;
            enemy.point=1;

        }


    } else {

        enemy.x += (dx/distance)*enemy.speed;
        enemy.y += (dy/distance)*enemy.speed;

    }

}



// =================
// DRAW ENEMY
// =================

function drawEnemy(){

    ctx.drawImage(
        enemyImg,
        enemy.x-25,
        enemy.y-25,
        50,
        50
    );

}



// =================
// UI
// =================

function drawUI(){

    ctx.fillStyle="black";
    ctx.fillRect(0,0,900,50);


    ctx.fillStyle="white";
    ctx.font="20px Arial";


    ctx.fillText("$"+coins,20,32);

    ctx.fillText("💎 "+gems,150,32);

    ctx.fillText("❤️ "+lives,280,32);

    ctx.fillText("Stage "+stage,450,32);

}



// =================
// GAME LOOP
// =================

function gameLoop(){

    drawMap();

    moveEnemy();

    drawEnemy();

    drawUI();


    requestAnimationFrame(gameLoop);

}


gameLoop();
