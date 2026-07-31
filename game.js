
// =========================
// GEORGE TD v0.3.8 PART 1
// WAVES + ENEMY TIERS
// =========================


// =========================
// CANVAS
// =========================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;


window.addEventListener("resize",()=>{

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    updatePath();

});



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

let coins = 500;

let gems = Number(localStorage.getItem("gems")) || 0;

let lives = 100;

let stage = 1;

let gameOver = false;



// =========================
// WAVE SYSTEM
// =========================


let currentWave = 0;

let enemiesLeftToSpawn = 0;

let waveInProgress = false;

let waveCooldown = 5;


let waveTimer = waveCooldown;



// =========================
// ENEMY TIERS
// =========================


const enemyTiers = {


1:{
    hp:1,
    size:50,
    color:"#00ff00"
},


2:{
    hp:3,
    size:52,
    color:"#0066ff"
},


3:{
    hp:5,
    size:55,
    color:"#ffff00"
},


4:{
    hp:10,
    size:58,
    color:"#ff9900"
},


5:{
    hp:25,
    size:61,
    color:"#ff0000"
},


6:{
    hp:50,
    size:64,
    color:"#9900ff"
},


7:{
    hp:100,
    size:67,
    color:"#111111"
},


8:{
    hp:300,
    size:70,
    color:"#8b4513"
},


9:{
    hp:750,
    size:74,
    color:"#ffffff"
}


};




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




// =========================
// OBJECT ARRAYS
// =========================


let enemies=[];

let towers=[];

let projectiles=[];



// =========================
// SPAWN ENEMY
// =========================


function spawnEnemy(tier){


    let data = enemyTiers[tier];


    enemies.push({


        x:path[0].x,

        y:path[0].y,


        tier:tier,


        hp:data.hp,

        maxHp:data.hp,


        size:data.size,


        color:data.color,


        speed:2,


        point:1


    });


}




// =========================
// START WAVE
// =========================


function startWave(){


    currentWave++;

    stage=currentWave;


    waveInProgress=true;



    // number of enemies

    enemiesLeftToSpawn =
    5 + currentWave * 2;



}




// =========================
// CHOOSE ENEMY TIER
// =========================


function chooseTier(){


    let chance=Math.random();



    if(currentWave < 3){

        return 1;

    }



    if(currentWave < 5){

        return chance < 0.8 ? 1 : 2;

    }



    if(currentWave < 8){

        if(chance < 0.7)
            return 1;

        if(chance < 0.95)
            return 2;

        return 3;

    }



    if(currentWave < 12){

        if(chance < 0.5)
            return 2;

        if(chance < 0.85)
            return 3;

        return 4;

    }



    return Math.floor(Math.random()*5)+1;


}




// =========================
// SPAWN TIMER
// =========================


let spawnCooldown=0;



function handleWaves(){



    if(gameOver)
        return;




    if(!waveInProgress){


        waveTimer--;



        if(waveTimer<=0){


            startWave();


        }


        return;


    }





    if(
        enemiesLeftToSpawn>0
        &&
        spawnCooldown<=0
    ){



        spawnEnemy(

            chooseTier()

        );



        enemiesLeftToSpawn--;



        spawnCooldown=40;



    }



    spawnCooldown--;



    if(
        enemiesLeftToSpawn<=0
        &&
        enemies.length===0
    ){


        waveInProgress=false;


        coins+=100;


        waveTimer=5;


    }



}

// =========================
// ENEMY MOVEMENT
// =========================


function moveEnemies(){


    enemies.forEach((enemy,index)=>{


        let target = path[enemy.point];


        let dx = target.x - enemy.x;

        let dy = target.y - enemy.y;


        let distance = Math.sqrt(
            dx*dx+
            dy*dy
        );



        if(distance < enemy.speed){


            enemy.x = target.x;

            enemy.y = target.y;


            enemy.point++;



            if(enemy.point >= path.length){


                lives--;


                enemies.splice(
                    index,
                    1
                );



                if(lives<=0){

                    lives=0;

                    gameOver=true;

                }


            }


        }
        else{


            enemy.x += 
            (dx/distance)
            *
            enemy.speed;


            enemy.y +=
            (dy/distance)
            *
            enemy.speed;



        }


    });


}





// =========================
// TOWER PLACEMENT
// =========================


let mouseX=0;

let mouseY=0;


let selectedTower=null;



canvas.addEventListener("mousemove",(event)=>{


    let rect=
    canvas.getBoundingClientRect();


    mouseX=
    event.clientX-
    rect.left;


    mouseY=
    event.clientY-
    rect.top;


});





canvas.addEventListener("click",(event)=>{


    let rect=
    canvas.getBoundingClientRect();


    let x=
    event.clientX-
    rect.left;


    let y=
    event.clientY-
    rect.top;



    // SHOP BUTTON

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
            coins>=100
            &&
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





// =========================
// PATH CHECK
// =========================


function isOnPath(x,y){


    for(
        let i=0;
        i<path.length-1;
        i++
    ){



        let a=path[i];

        let b=path[i+1];



        let dx=b.x-a.x;

        let dy=b.y-a.y;



        let length=Math.sqrt(
            dx*dx+
            dy*dy
        );



        let t=
        (
            (x-a.x)*dx+
            (y-a.y)*dy
        )
        /
        (length*length);



        t=Math.max(
            0,
            Math.min(1,t)
        );



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





// =========================
// TOWER SHOOTING
// =========================


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



                tower.cooldown=
                tower.fireRate;


            }



        }



    });



}





// =========================
// PROJECTILE MOVEMENT
// =========================


function updateProjectiles(){



    projectiles.forEach((arrow,index)=>{



        if(!arrow.target){


            projectiles.splice(
                index,
                1
            );


            return;


        }





        let dx=
        arrow.target.x-arrow.x;


        let dy=
        arrow.target.y-arrow.y;



        let distance=Math.sqrt(

            dx*dx+
            dy*dy

        );



        arrow.angle=Math.atan2(

            dy,

            dx

        );



        if(distance<arrow.speed){



            arrow.target.hp-=arrow.damage;



            projectiles.splice(

                index,

                1

            );



            if(arrow.target.hp<=0){



                let i=
                enemies.indexOf(
                    arrow.target
                );



                if(i!=-1){


                    enemies.splice(
                        i,
                        1
                    );


                    coins+=10;


                }


            }



        }
        else{


            arrow.x +=
            (dx/distance)
            *
            arrow.speed;


            arrow.y +=
            (dy/distance)
            *
            arrow.speed;


        }



    });



}

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



    for(let i=1;i<path.length;i++){


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



        // enemy texture


        ctx.drawImage(

            enemyImg,

            enemy.x-size/2,

            enemy.y-size/2,

            size,

            size

        );



        // tier colour overlay


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
// DRAW TOWERS
// =========================


function drawTowers(){



    towers.forEach(tower=>{



        ctx.save();



        ctx.translate(

            tower.x,

            tower.y

        );



        // YOUR SPRITE FACES DOWN
        // FIX AIMING DIRECTION


        ctx.rotate(

            tower.angle - Math.PI/2

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







// =========================
// DRAW ARROWS
// =========================


function drawProjectiles(){



    projectiles.forEach(arrow=>{



        ctx.save();



        ctx.translate(

            arrow.x,

            arrow.y

        );



        // arrow texture faces down


        ctx.rotate(

            arrow.angle - Math.PI/2

        );



        // 75% BIGGER ARROW


        ctx.drawImage(

            arrowPImg,

            -17.5,

            -17.5,

            35,

            35

        );



        ctx.restore();



    });



}







// =========================
// RANGE CIRCLES
// =========================


function drawRangeCircles(){



    // tower placement preview


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





    // hover tower


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

            "Next wave: "+Math.ceil(waveTimer),

            570,

            35

        );


    }



    ctx.textAlign="right";



    ctx.fillText(

        "George TD v0.3.8",

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



    // background + path


    drawMap();




    // systems


    handleWaves();


    moveEnemies();


    updateTowers();


    updateProjectiles();





    // visuals


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
