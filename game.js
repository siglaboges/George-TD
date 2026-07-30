const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


window.addEventListener("resize",()=>{

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});


// =================
// IMAGES
// =================

const enemyImg = new Image();
enemyImg.src="sprite/enemy.png";

const arrowImg = new Image();
arrowImg.src="sprite/arrow.png";

const arrowPImg = new Image();
arrowPImg.src="sprite/arrowp.png";


// =================
// PLAYER
// =================

let coins=500;
let gems=Number(localStorage.getItem("gems")) || 0;
let lives=100;
let stage=1;

let gameOver=false;


// =================
// MOUSE
// =================

let mouseX=0;
let mouseY=0;

let selectedTower=null;
let upgradeTower=null;


canvas.addEventListener("mousemove",(event)=>{

    let rect=canvas.getBoundingClientRect();

    mouseX=event.clientX-rect.left;
    mouseY=event.clientY-rect.top;

});


// =================
// OBJECTS
// =================

let enemies=[];
let towers=[];
let projectiles=[];



// =================
// PATH
// =================

let path=[];


function updatePath(){

    path=[

        {x:0,y:200},

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


updatePath();


window.addEventListener("resize",updatePath);



// =================
// SPAWN
// =================

function spawnEnemy(){


    enemies.push({

        x:path[0].x,

        y:path[0].y,

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
// CLICK
// =================

canvas.addEventListener("click",(event)=>{


    let rect=canvas.getBoundingClientRect();


    let x=event.clientX-rect.left;
    let y=event.clientY-rect.top;



    // SHOP

    if(
        x<120 &&
        y>canvas.height-120
    ){

        selectedTower="arrow";

        return;

    }




    // PLACE TOWER

    if(selectedTower==="arrow"){


        if(
            coins>=100 &&
            !isOnPath(x,y)
        ){


            towers.push({

                x:x,

                y:y,

                damage:1,

                range:220,

                cooldown:0,

                fireRate:40,

                angle:0

            });


            coins-=100;


        }


        selectedTower=null;


    }



});



// =================
// PATH CHECK
// =================

function isOnPath(x,y){


    for(let i=0;i<path.length-1;i++){


        let a=path[i];
        let b=path[i+1];


        let dx=b.x-a.x;
        let dy=b.y-a.y;


        let length=Math.sqrt(dx*dx+dy*dy);


        let t=((x-a.x)*dx+(y-a.y)*dy)
        /(length*length);



        t=Math.max(0,Math.min(1,t));


        let cx=a.x+t*dx;
        let cy=a.y+t*dy;



        let distance=Math.sqrt(

            (x-cx)**2+
            (y-cy)**2

        );


        if(distance<40){

            return true;

        }


    }


    return false;


}
// =================
// MOVE ENEMIES
// =================

function moveEnemies(){


    enemies.forEach((enemy,index)=>{


        let target=path[enemy.point];


        let dx=target.x-enemy.x;
        let dy=target.y-enemy.y;


        let distance=Math.sqrt(
            dx*dx+dy*dy
        );



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



// =================
// UPDATE TOWERS
// =================

function updateTowers(){


    towers.forEach(tower=>{


        if(tower.cooldown>0){

            tower.cooldown--;

        }



        let target=null;



        enemies.forEach(enemy=>{


            let distance=Math.sqrt(

                (enemy.x-tower.x)**2+

                (enemy.y-tower.y)**2

            );


            if(distance<tower.range){

                target=enemy;

            }


        });



        if(target){


            tower.angle=Math.atan2(

                target.y-tower.y,

                target.x-tower.x

            );



            if(tower.cooldown<=0){



                projectiles.push({

                    x:tower.x,

                    y:tower.y,

                    target:target,

                    speed:8,

                    damage:tower.damage,

                    angle:tower.angle

                });



                tower.cooldown=tower.fireRate;


            }


        }


    });


}



// =================
// UPDATE PROJECTILES
// =================

function updateProjectiles(){


    projectiles.forEach((arrow,index)=>{


        if(!arrow.target){

            projectiles.splice(index,1);

            return;

        }



        let dx=arrow.target.x-arrow.x;

        let dy=arrow.target.y-arrow.y;



        let distance=Math.sqrt(

            dx*dx+dy*dy

        );



        arrow.angle=Math.atan2(

            dy,

            dx

        );



        if(distance<arrow.speed){


            arrow.target.hp-=arrow.damage;



            projectiles.splice(index,1);



            if(arrow.target.hp<=0){



                let enemyIndex=enemies.indexOf(
                    arrow.target
                );



                if(enemyIndex!=-1){

                    enemies.splice(
                        enemyIndex,
                        1
                    );


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



// =================
// DRAW MAP
// =================

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


    for(let i=1;i<path.length;i++){


        ctx.lineTo(
            path[i].x,
            path[i].y
        );


    }


    ctx.stroke();


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


        ctx.save();



        ctx.translate(

            tower.x,

            tower.y

        );



        // sprite points down

        ctx.rotate(

            tower.angle + Math.PI/2

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



// =================
// DRAW PROJECTILES
// =================

function drawProjectiles(){


    projectiles.forEach(arrow=>{


        ctx.save();



        ctx.translate(

            arrow.x,

            arrow.y

        );



        ctx.rotate(

            arrow.angle + Math.PI/2

        );



        ctx.drawImage(

            arrowPImg,

            -10,

            -10,

            20,

            20

        );



        ctx.restore();


    });


}



// =================
// RANGE CIRCLES
// =================

function drawRangeCircles(){


    if(selectedTower==="arrow"){


        ctx.beginPath();


        ctx.arc(

            mouseX,

            mouseY,

            220,

            0,

            Math.PI*2

        );



        ctx.fillStyle=
        "rgba(0,150,255,0.5)";


        ctx.fill();


    }



    towers.forEach(tower=>{


        let distance=Math.sqrt(

            (mouseX-tower.x)**2+

            (mouseY-tower.y)**2

        );



        if(distance<35){



            ctx.beginPath();



            ctx.arc(

                tower.x,

                tower.y,

                tower.range,

                0,

                Math.PI*2

            );



            ctx.fillStyle=
            "rgba(0,150,255,0.5)";



            ctx.fill();


        }


    });


}



// =================
// UI
// =================

function drawUI(){


    ctx.fillStyle="black";


    ctx.fillRect(

        0,

        0,

        canvas.width,

        50

    );



    ctx.fillStyle="white";


    ctx.font="20px Arial";



    ctx.textAlign="left";


    ctx.fillText(

        "$"+coins,

        20,

        32

    );


    ctx.fillText(

        "💎 "+gems,

        150,

        32

    );


    ctx.fillText(

        "❤️ "+lives,

        280,

        32

    );


    ctx.fillText(

        "Stage "+stage,

        450,

        32

    );



    ctx.textAlign="right";


    ctx.fillText(

        "George TD v0.3.7",

        canvas.width-20,

        32

    );


    ctx.textAlign="left";


}



// =================
// SHOP
// =================

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



// =================
// GAME LOOP
// =================

function gameLoop(){


    drawMap();


    drawRangeCircles();


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
