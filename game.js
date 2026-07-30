const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;


// =================
// IMAGES
// =================

let enemyImg = new Image();
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
    {x: -50, y: 200},
    {x: 600, y: 200},
    {x: 600, y: 450},
    {x: 950, y: 450}
];


// =================
// ENEMY
// =================

let enemy = {
    x: -50,
    y: 200,
    hp: 10,
    maxHp: 10,
    speed: 2,
    point: 1
};


// =================
// DRAW MAP
// =================

function drawMap(){

    // grass
    ctx.fillStyle = "#6ac34a";
    ctx.fillRect(0,0,900,600);


    // path
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


        // reset after exit
        if(enemy.point >= path.length){

            enemy.x = -50;
            enemy.y = 200;
            enemy.point = 1;

            console.log("Enemy escaped!");

        }

    } 
    else {

        enemy.x += (dx/distance) * enemy.speed;
        enemy.y += (dy/distance) * enemy.speed;

    }

}


// =================
// DRAW ENEMY
// =================

function drawEnemy(){


    if(enemyImg.complete){

        ctx.drawImage(
            enemyImg,
            enemy.x-25,
            enemy.y-25,
            50,
            50
        );

    }
    else {

        // backup if image fails
        ctx.fillStyle="red";
        ctx.fillRect(
            enemy.x-25,
            enemy.y-25,
            50,
            50
        );

    }



    // HP bar

    ctx.fillStyle="black";
    ctx.fillRect(
        enemy.x-25,
        enemy.y-40,
        50,
        8
    );


    ctx.fillStyle="red";
    ctx.fillRect(
        enemy.x-25,
        enemy.y-40,
        50*(enemy.hp/enemy.maxHp),
        8
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


    ctx.fillText("$"+coins,20,30);
    ctx.fillText("💎 "+gems,150,30);
    ctx.fillText("❤️ "+lives,280,30);
    ctx.fillText("Stage "+stage,430,30);

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
