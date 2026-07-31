// =========================
// GEORGE TD v0.4.0
// MAIN GAME
// =========================


// =========================
// CANVAS
// =========================

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");


const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;


canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;



function resizeCanvas(){

    let scale = Math.min(
        window.innerWidth / GAME_WIDTH,
        window.innerHeight / GAME_HEIGHT
    );


    canvas.style.width =
    GAME_WIDTH * scale + "px";


    canvas.style.height =
    GAME_HEIGHT * scale + "px";

}



window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();



// =========================
// IMAGES
// =========================

const enemyImg = new Image();
enemyImg.src="sprite/enemy.png";


const arrowImg = new Image();
arrowImg.src="sprite/arrow.png";


const arrowPImg = new Image();
arrowPImg.src="sprite/arrowp.png";



// =========================
// PLAYER
// =========================

var coins = 500;
var gems = Number(localStorage.getItem("gems")) || 0;
var lives = 100;
var stage = 1;
var currentWave = 0;
var gameOver = false;


// =========================
// OBJECT ARRAYS
// =========================

var enemies = [];
var towers = [];
var projectiles = [];



// =========================
// PATH
// =========================

let path=[];


function updatePath(){

    path=[

        {
            x:0,
            y:200
        },


        {
            x:GAME_WIDTH*0.65,
            y:200
        },


        {
            x:GAME_WIDTH*0.65,
            y:GAME_HEIGHT*0.7
        },


        {
            x:GAME_WIDTH,
            y:GAME_HEIGHT*0.7
        }

    ];

}


updatePath();





// =========================
// MOUSE
// =========================

let mouseX=0;
let mouseY=0;



canvas.addEventListener(
"mousemove",
(event)=>{


    let rect =
    canvas.getBoundingClientRect();



    mouseX =
    (event.clientX - rect.left)
    *
    (canvas.width / rect.width);



    mouseY =
    (event.clientY - rect.top)
    *
    (canvas.height / rect.height);



});




// =========================
// DRAW MAP
// =========================

function drawMap(){


    ctx.fillStyle="#6ac34a";


    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );



    ctx.strokeStyle="#b88652";

    ctx.lineWidth=80;

    ctx.lineCap="round";



    ctx.beginPath();



    ctx.moveTo(

        path[0].x,

        path[0].y

    );



    for(
        let i=1;
        i<path.length;
        i++
    ){

        ctx.lineTo(

            path[i].x,

            path[i].y

        );

    }



    ctx.stroke();


}





// =========================
// DRAW ENEMIES
// =========================

function drawEnemies(){



    enemies.forEach(enemy=>{


        let size=enemy.size;



        ctx.drawImage(

            enemyImg,

            enemy.x-size/2,

            enemy.y-size/2,

            size,

            size

        );



        ctx.globalAlpha=0.25;


        ctx.fillStyle=enemy.color;


        ctx.fillRect(

            enemy.x-size/2,

            enemy.y-size/2,

            size,

            size

        );



        ctx.globalAlpha=1;



        // HP BAR


        ctx.fillStyle="black";


        ctx.fillRect(

            enemy.x-size/2,

            enemy.y-size/2-12,

            size,

            7

        );



        ctx.fillStyle="red";


        ctx.fillRect(

            enemy.x-size/2,

            enemy.y-size/2-12,

            size*(enemy.hp/enemy.maxHp),

            7

        );



    });


}





// =========================
// UI
// =========================

function drawUI(){


    ctx.fillStyle="black";


    ctx.fillRect(

        0,

        0,

        canvas.width,

        55

    );



    ctx.fillStyle="white";


    ctx.font="20px Arial";


    ctx.textAlign="left";



    ctx.fillText(
        "$"+coins,
        20,
        35
    );


    ctx.fillText(
        "💎 "+gems,
        150,
        35
    );


    ctx.fillText(
        "❤️ "+lives,
        280,
        35
    );


    ctx.fillText(
        "Wave "+currentWave,
        420,
        35
    );



    if(!waveInProgress){


        ctx.fillText(

            "Next wave: "+
            Math.ceil(waveTimer),

            570,

            35

        );


    }



    ctx.textAlign="right";



    ctx.fillText(

        "George TD v0.4.0",

        canvas.width-20,

        35

    );



    ctx.textAlign="left";


}





// =========================
// SHOP
// =========================

function drawShop(){



    ctx.fillStyle="#333";



    ctx.fillRect(

        10,

        canvas.height-120,

        110,

        100

    );



    ctx.drawImage(

        arrowImg,

        35,

        canvas.height-110,

        50,

        50

    );



    ctx.fillStyle="white";


    ctx.font="italic 20px cursive";


    ctx.fillText(

        "100$",

        35,

        canvas.height-35

    );


}





// =========================
// GAME OVER
// =========================

function drawGameOver(){


    if(!gameOver)
        return;



    ctx.fillStyle=
    "rgba(0,0,0,0.7)";



    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );



    ctx.fillStyle="white";


    ctx.textAlign="center";


    ctx.font="60px Arial";


    ctx.fillText(

        "GAME OVER",

        canvas.width/2,

        canvas.height/2

    );



    ctx.font="25px Arial";


    ctx.fillText(

        "Reached Wave "+currentWave,

        canvas.width/2,

        canvas.height/2+50

    );



    ctx.textAlign="left";


}





// =========================
// MAIN LOOP
// =========================

function gameLoop(){


    drawMap();



    handleWaves();


    moveEnemies();



    updateTowers();


    updateProjectiles();



    drawRangeCircles();


    drawTowers();


    drawProjectiles();


    drawEnemies();



    drawUI();


    drawShop();


    drawGameOver();



    requestAnimationFrame(
        gameLoop
    );


}



gameLoop();
