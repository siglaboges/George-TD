// =================================
// GEORGE TD v0.4.0
// MAIN ENGINE
// =================================


// ===============================
// CANVAS SETUP
// ===============================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


function resizeCanvas(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    updatePath();

}


window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();




// ===============================
// IMAGES
// ===============================


const enemyImg = new Image();

enemyImg.src = "sprite/enemy.png";



const arrowImg = new Image();

arrowImg.src = "sprite/arrow.png";



const arrowPImg = new Image();

arrowPImg.src = "sprite/arrowp.png";




// ===============================
// PLAYER DATA
// ===============================


let coins = 500;


let gems =
Number(localStorage.getItem("gems")) || 0;


let lives = 100;


let stage = 1;


let gameOver = false;




// ===============================
// GAME OBJECTS
// ===============================


let enemies = [];

let towers = [];

let projectiles = [];




// ===============================
// MOUSE
// ===============================


let mouseX = 0;

let mouseY = 0;


canvas.addEventListener(
    "mousemove",
    (event)=>{


        let rect =
        canvas.getBoundingClientRect();


        mouseX =
        event.clientX - rect.left;


        mouseY =
        event.clientY - rect.top;


    }
);




// ===============================
// PATH
// ===============================


let path = [];



function updatePath(){


    path = [


        {
            x:0,
            y:200
        },


        {
            x:canvas.width*0.65,
            y:200
        },


        {
            x:canvas.width*0.65,
            y:canvas.height*0.7
        },


        {
            x:canvas.width,
            y:canvas.height*0.7
        }


    ];


}




// ===============================
// GAME LOOP
// ===============================


function gameLoop(){


    // temporary test background

    ctx.fillStyle="#6ac34a";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    requestAnimationFrame(
        gameLoop
    );


}



gameLoop();
