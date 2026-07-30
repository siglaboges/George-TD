const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;


// Enemy image
const enemyImg = new Image();
enemyImg.src = "sprite/enemy.png";


// Enemy
let enemy = {
    x: 0,
    y: 200,
    speed: 2,
    point: 1
};


// Path
const path = [
    {x:0, y:200},
    {x:600, y:200},
    {x:600, y:450},
    {x:900, y:450}
];



function drawMap(){

    // grass
    ctx.fillStyle = "#6ac34a";
    ctx.fillRect(0,0,900,600);


    // dirt path
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

    let target = path[enemy.point];


    let dx = target.x - enemy.x;
    let dy = target.y - enemy.y;

    let distance = Math.sqrt(dx*dx + dy*dy);


    if(distance < enemy.speed){

        enemy.x = target.x;
        enemy.y = target.y;

        enemy.point++;

        if(enemy.point >= path.length){

            enemy.x = 0;
            enemy.y = 200;
            enemy.point = 1;

        }

    }
    else {

        enemy.x += (dx/distance) * enemy.speed;
        enemy.y += (dy/distance) * enemy.speed;

    }

}



function drawEnemy(){

    ctx.drawImage(
        enemyImg,
        enemy.x-25,
        enemy.y-25,
        50,
        50
    );

}



function gameLoop(){

    drawMap();

    moveEnemy();

    drawEnemy();


    requestAnimationFrame(gameLoop);

}


gameLoop();
