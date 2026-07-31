// =========================
// GEORGE TD v0.4.3
// MAIN GAME
// =========================


// =========================
// CANVAS
// =========================

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");


var GAME_WIDTH = 1280;
var GAME_HEIGHT = 720;


canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;



function resizeCanvas(){

    var scale = Math.min(
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

var enemyImg = new Image();
enemyImg.src="sprite/enemy.png";


var arrowImg = new Image();
arrowImg.src="sprite/arrow.png";


var arrowPImg = new Image();
arrowPImg.src="sprite/arrowp.png";





// =========================
// PLAYER
// =========================

var coins = 500;


var gems =
Number(localStorage.getItem("gems")) || 0;


var lives = 100;


var stage = 1;


var currentWave = 0;


var gameOver = false;





// =========================
// MENUS
// =========================

var selectedTower = null;


var enemyMenuOpen = false;




// =========================
// TOWER PLACEMENT
// =========================

var invalidPlacement = false;






// =========================
// ARRAYS
// =========================

var enemies=[];

var towers=[];

var projectiles=[];







// =========================
// PATH
// =========================

var path=[];



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

var mouseX=0;

var mouseY=0;



canvas.addEventListener(
"mousemove",
function(event){


    var rect =
    canvas.getBoundingClientRect();



    mouseX =
    (event.clientX-rect.left)
    *
    (canvas.width/rect.width);



    mouseY =
    (event.clientY-rect.top)
    *
    (canvas.height/rect.height);



});









// =========================
// CHECK TOWER PLACEMENT
// =========================

function canPlaceTower(x,y){



    if(coins < 100)
        return false;



    if(isOnPath(x,y))
        return false;





    for(
        var i=0;
        i<towers.length;
        i++
    ){


        var distance =
        Math.sqrt(

            (x-towers[i].x)**2+
            (y-towers[i].y)**2

        );



        if(distance < 55){

            return false;

        }


    }





    return true;


}









// =========================
// CLICK
// =========================

canvas.addEventListener(
"click",
function(event){



    var rect =
    canvas.getBoundingClientRect();



    var x =
    (event.clientX-rect.left)
    *
    (canvas.width/rect.width);



    var y =
    (event.clientY-rect.top)
    *
    (canvas.height/rect.height);






    if(
        x > canvas.width-220 &&
        x < canvas.width-100 &&
        y < 55
    ){

        enemyMenuOpen =
        !enemyMenuOpen;


        return;

    }






    if(
        x < 120 &&
        y > canvas.height-120
    ){

        selectedTower="arrow";

        return;

    }






    if(selectedTower==="arrow"){



        if(canPlaceTower(x,y)){


            placeTower(x,y);


        }



        selectedTower=null;



    }



});









// =========================
// MAP
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
        var i=1;
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



    ctx.textAlign="right";


    ctx.fillText(
        "Enemies",
        canvas.width-120,
        35
    );



    ctx.fillText(
        "George TD v0.4.3",
        canvas.width-20,
        80
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
// LOOP
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


    drawEnemyMenu();



    requestAnimationFrame(
        gameLoop
    );


}




setTimeout(function(){

    gameLoop();

},100);
