const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;


// IMAGES

const enemyImg = new Image();
enemyImg.src = "sprite/enemy.png";

const arrowImg = new Image();
arrowImg.src = "sprite/arrow.png";

const arrowPImg = new Image();
arrowPImg.src = "sprite/arrowp.png";


// PLAYER

let coins = 500;
let gems = Number(localStorage.getItem("gems")) || 0;
let lives = 100;
let stage = 1;

let gameOver = false;


// SHOP

let selectedTower = null;


// OBJECTS

let enemies = [];
let towers = [];
let projectiles = [];


// PATH

const path = [
    {x:0,y:200},
    {x:600,y:200},
    {x:600,y:450},
    {x:900,y:450}
];


// SPAWN

function spawnEnemy(){

    enemies.push({

        x:0,
        y:200,

        hp:1,

        speed:2,

        point:1

    });

}


setInterval(()=>{

    if(!gameOver){
        spawnEnemy();
    }

},1000);



// CLICK PLACE TOWER

canvas.addEventListener("click",function(event){

    let rect = canvas.getBoundingClientRect();

    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;


    if(
        mouseX >= 10 &&
        mouseX <= 110 &&
        mouseY >= 500 &&
        mouseY <=590
    ){

        selectedTower="arrow";

        return;

    }



    if(selectedTower==="arrow" && coins>=100){

        towers.push({

            x:mouseX,
            y:mouseY,

            range:220,

            cooldown:0,

            angle:0

        });


        coins-=100;

        selectedTower=null;

    }


});



// MOVE ENEMIES

function moveEnemies(){

    enemies.forEach((enemy,index)=>{


        let target = path[enemy.point];


        let dx = target.x-enemy.x;
        let dy = target.y-enemy.y;


        let distance=Math.sqrt(dx*dx+dy*dy);



        if(distance < enemy.speed){

            enemy.x=target.x;
            enemy.y=target.y;

            enemy.point++;


            if(enemy.point>=path.length){

                lives--;

                enemies.splice(index,1);


                if(lives<=0){

                    lives=0;
                    gameOver=true;

                }

            }

        }
        else{

            enemy.x+=(dx/distance)*enemy.speed;
            enemy.y+=(dy/distance)*enemy.speed;

        }


    });


}



// TOWER AIM + SHOOT

function updateTowers(){


    towers.forEach(tower=>{


        if(tower.cooldown>0){

            tower.cooldown--;

        }


        let closest=null;
        let closestDistance=9999;



        enemies.forEach(enemy=>{


            let dx=enemy.x-tower.x;
            let dy=enemy.y-tower.y;


            let distance=Math.sqrt(dx*dx+dy*dy);


            if(distance<tower.range && distance<closestDistance){

                closest=enemy;
                closestDistance=distance;

            }


        });



        if(closest){


            tower.angle=Math.atan2(
                closest.y-tower.y,
                closest.x-tower.x
            );



            if(tower.cooldown<=0){


                projectiles.push({

                    x:tower.x,

                    y:tower.y,

                    target:closest,

                    speed:7,

                    damage:1

                });


                tower.cooldown=40;


            }


        }


    });


}



// PROJECTILES

function updateProjectiles(){


    projectiles.forEach((arrow,index)=>{


        if(!arrow.target){

            projectiles.splice(index,1);
            return;

        }



        let dx=arrow.target.x-arrow.x;
        let dy=arrow.target.y-arrow.y;


        let distance=Math.sqrt(dx*dx+dy*dy);



        if(distance<arrow.speed){


            arrow.target.hp-=arrow.damage;


            projectiles.splice(index,1);



            if(arrow.target.hp<=0){


                let enemyIndex=enemies.indexOf(arrow.target);


                if(enemyIndex!=-1){

                    enemies.splice(enemyIndex,1);

                    coins+=10;

                }


            }


        }
        else{


            arrow.x+=(dx/distance)*arrow.speed;

            arrow.y+=(dy/distance)*arrow.speed;


        }


    });


}



// DRAW ENEMIES

function drawEnemies(){

    enemies.forEach(enemy=>{


        ctx.drawImage(
            enemyImg,
            enemy.x-25,
            enemy.y-25,
            50,
            50
        );



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
            50*(enemy.hp/1),
            7
        );


    });

}



// DRAW TOWERS

function drawTowers(){

    towers.forEach(tower=>{


        ctx.save();


        ctx.translate(
            tower.x,
            tower.y
        );


        ctx.rotate(
            tower.angle
        );


        ctx.drawImage(
            arrowImg,
            -25,
            -25,
            50,
            50
        );


        ctx.restore();


    });


}



// DRAW PROJECTILES

function drawProjectiles(){

    projectiles.forEach(arrow=>{


        ctx.drawImage(
            arrowPImg,
            arrow.x-10,
            arrow.y-10,
            20,
            20
        );


    });


}



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

        ctx.lineTo(
            path[i].x,
            path[i].y
        );

    }


    ctx.stroke();

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


}



// SHOP

function drawShop(){

    ctx.fillStyle="#333";

    ctx.fillRect(10,500,100,90);


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

}



// LOOP

function gameLoop(){

    drawMap();

    moveEnemies();

    updateTowers();

    updateProjectiles();


    drawTowers();

    drawProjectiles();

    drawEnemies();


    drawUI();

    drawShop();


    requestAnimationFrame(gameLoop);

}


gameLoop();
