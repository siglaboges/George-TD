const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;


// IMAGE
const enemyImg = new Image();
enemyImg.src = "sprite/enemy.png";


// PLAYER DATA
let coins = 500;
let gems = Number(localStorage.getItem("gems")) || 0;
let lives = 100;
let stage = 1;

let gameOver = false;


// PATH
const path = [
    {x:0,y:200},
    {x:600,y:200},
    {x:600,y:450},
    {x:900,y:450}
];


// ENEMY
let enemy = {
    x:0,
    y:200,
    speed:2,
    point:1
};


// RESET BUTTON

const resetButton = document.createElement("button");

resetButton.innerText = "Reset Game";

resetButton.style.position = "absolute";
resetButton.style.left = "400px";
resetButton.style.top = "300px";
resetButton.style.fontSize = "25px";
resetButton.style.display = "none";

document.body.appendChild(resetButton);


resetButton.onclick = function(){

    lives = 100;
    coins = 500;
    stage = 1;

    enemy.x = 0;
    enemy.y = 200;
    enemy.point = 1;

    gameOver = false;

    resetButton.style.display="none";

};



// MAP

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



// ENEMY MOVEMENT

function moveEnemy(){

    if(gameOver) return;


    let target = path[enemy.point];


    let dx = target.x-enemy.x;
    let dy = target.y-enemy.y;


    let distance=Math.sqrt(dx*dx+dy*dy);


    if(distance < enemy.speed){

        enemy.x=target.x;
        enemy.y=target.y;

        enemy.point++;


        if(enemy.point >= path.length){

            lives--;


            enemy.x=0;
            enemy.y=200;
            enemy.point=1;


            if(lives <= 0){

                lives=0;
                gameOver=true;

                resetButton.style.display="block";

            }

        }

    }
    else{

        enemy.x+=(dx/distance)*enemy.speed;
        enemy.y+=(dy/distance)*enemy.speed;

    }

}



// DRAW ENEMY

function drawEnemy(){

    ctx.drawImage(
        enemyImg,
        enemy.x-25,
        enemy.y-25,
        50,
        50
    );

}



// UI

function drawUI(){

    ctx.fillStyle="black";
    ctx.fillRect(0,0,900,50);


    ctx.fillStyle="white";
    ctx.font="20px Arial";


    ctx.fillText("$"+coins,20,32);
    ctx.fillText("💎 "+gems,150,32);
    ctx.fillText("❤️ "+lives,280,32);
    ctx.fillText("Stage "+stage,450,32);


    if(gameOver){

        ctx.fillStyle="red";
        ctx.font="60px Arial";

        ctx.fillText(
            "GAME OVER",
            260,
            150
        );

    }

}



// GAME LOOP

function gameLoop(){

    drawMap();

    moveEnemy();

    drawEnemy();

    drawUI();


    requestAnimationFrame(gameLoop);

}


gameLoop();
