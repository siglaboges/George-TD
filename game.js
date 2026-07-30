const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;


// =================
// IMAGES
// =================

const enemyImg = new Image();
enemyImg.src = "sprite/enemy.png";


const arrowImg = new Image();
arrowImg.src = "sprite/arrow.png";


// =================
// PLAYER
// =================

let coins = 500;
let gems = Number(localStorage.getItem("gems")) || 0;
let lives = 100;
let stage = 1;

let gameOver = false;


// =================
// SHOP
// =================

let selectedTower = null;


// =================
// OBJECTS
// =================

let enemies = [];
let towers = [];


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
// SPAWN ENEMIES
// =================

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


setInterval(()=>{

    if(!gameOver){

        spawnEnemy();

    }

},1000);



// =================
// PLACE TOWER
// =================

canvas.addEventListener("click", function(event){


    if(gameOver) return;


    let rect = canvas.getBoundingClientRect();


    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;



    // SHOP CLICK

    if(
        mouseX >= 10 &&
        mouseX <= 110 &&
        mouseY >= 500 &&
        mouseY <= 590
    ){

        selectedTower = "arrow";

        return;

    }



    // PLACE ARROW

    if(selectedTower === "arrow"){


        if(coins >= 100){


            towers.push({

                x:mouseX,
                y:mouseY,

                range:200,

                cooldown:0

            });


            coins -= 100;


        }


        selectedTower=null;

    }


});



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



        // HP BAR

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
// DRAW TOWERS
// =================

function drawTowers(){


    towers.forEach(tower=>{


        ctx.drawImage(

            arrowImg,

            tower.x-25,

            tower.y-25,

            50,

            50

        );


    });


}



// =================
// MAP
// =================

function drawMap(){


    ctx.fillStyle="#6ac34a";

    ctx.fillRect(
        0,
        0,
        900,
        600
    );



    ctx.strokeStyle="#b88652";

    ctx.lineWidth=80;

    ctx.lineCap="round";



    ctx.beginPath();


    ctx.moveTo(
        path[0].x,
        path[0].y
    );



    for(let i=1;i<path.length;i++){


        ctx.lineTo(
            path[i].x,
            path[i].y
        );


    }



    ctx.stroke();


}



// =================
// UI
// =================

function drawUI(){


    ctx.fillStyle="black";

    ctx.fillRect(
        0,
        0,
        900,
        50
    );



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
// SHOP
// =================

function drawShop(){


    ctx.fillStyle="#333";

    ctx.fillRect(
        10,
        500,
        100,
        90
    );



    ctx.drawImage(

        arrowImg,

        35,

        510,

        50,

        50

    );



    ctx.fillStyle="white";

    ctx.font="italic 20px cursive";


    ctx.fillText(
        "100$",
        30,
        585
    );



    if(selectedTower==="arrow"){


        ctx.strokeStyle="yellow";

        ctx.lineWidth=3;


        ctx.strokeRect(
            10,
            500,
            100,
            90
        );


    }


}



// =================
// GAME LOOP
// =================

function gameLoop(){


    drawMap();


    moveEnemies();


    drawTowers();


    drawEnemies();


    drawUI();


    drawShop();



    requestAnimationFrame(gameLoop);


}


gameLoop();
