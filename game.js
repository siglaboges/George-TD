const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;


// =================
// IMAGES
// =================

const enemyImg = new Image();
enemyImg.src = "sprite/enemy.png";


// =================
// PLAYER
// =================

let coins = 500;
let gems = Number(localStorage.getItem("gems")) || 0;
let lives = 100;
let stage = 1;

let gameOver = false;


// =================
// PATH
// =================

const path = [
    {x:0,y:200},
    {x:600,y:200},
    {x:600,y:450},
    {x:900,y:450}
];


// =================
// ENEMIES
// =================

let enemies = [];


function spawnEnemy(){

    enemies.push({

        x:0,
        y:200,

        hp:1,
        maxHp:1,

        speed:2,

        point:1

    });

}


// Spawn enemies every second

setInterval(()=>{

    if(!gameOver){
        spawnEnemy();
    }

},1000);



// =================
// MOVE ENEMIES
// =================

function moveEnemies(){


    if(gameOver) return;


    enemies.forEach((enemy,index)=>{


        let target = path[enemy.point];


        let dx = target.x-enemy.x;
        let dy = target.y-enemy.y;


        let distance = Math.sqrt(dx*dx+dy*dy);



        if(distance < enemy.speed){


            enemy.x=target.x;
            enemy.y=target.y;

            enemy.point++;



            if(enemy.point >= path.length){


                lives--;


                enemies.splice(index,1);


                if(lives<=0){

                    lives=0;
                    gameOver=true;

                }

            }


        }
        else{


            enemy.x += (dx/distance)*enemy.speed;
            enemy.y += (dy/distance)*enemy.speed;


        }


    });

}



// =================
// DRAW ENEMIES
// =================

function drawEnemies(){


    enemies.forEach(enemy=>{


        ctx.drawImage(
            enemyImg,
            enemy.x-25,
            enemy.y-25,
            50,
            50
        );



        // HP bar

        ctx.fillStyle="black";

        ctx.fillRect(
            enemy.x-25,
            enemy.y-40,
            50,
            7
        );


        ctx.fillStyle="red";

        ctx.fillRect(
            enemy.x-25,
            enemy.y-40,
            50*(enemy.hp/enemy.maxHp),
            7
        );


    });


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



// =================
// MAP
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

        ctx.lineTo(
            path[i].x,
            path[i].y
        );

    }


    ctx.stroke();

}



// =================
// GAME LOOP
// =================

function gameLoop(){

    drawMap();

    moveEnemies();

    drawEnemies();

    drawUI();


    requestAnimationFrame(gameLoop);

}


gameLoop();
