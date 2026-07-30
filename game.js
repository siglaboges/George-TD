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

const arrowPImg = new Image();
arrowPImg.src = "sprite/arrowp.png";


// =================
// PLAYER
// =================

let coins = 500;
let gems = Number(localStorage.getItem("gems")) || 0;
let lives = 100;
let stage = 1;

let gameOver = false;


// =================
// MOUSE
// =================

let mouseX = 0;
let mouseY = 0;

let selectedTower = null;
let upgradeTower = null;


canvas.addEventListener("mousemove", function(event){

    let rect = canvas.getBoundingClientRect();

    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

});


// =================
// OBJECTS
// =================

let enemies = [];
let towers = [];
let projectiles = [];


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
// CLICK SYSTEM
// =================

canvas.addEventListener("click",function(event){


    let rect = canvas.getBoundingClientRect();

    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;



    // SHOP

    if(
        x>=10 &&
        x<=110 &&
        y>=500 &&
        y<=590
    ){

        selectedTower="arrow";

        return;

    }



    // CLICK EXISTING TOWER

    for(let tower of towers){


        let distance=Math.sqrt(

            (x-tower.x)**2+
            (y-tower.y)**2

        );


        if(distance < 30){

            upgradeTower=tower;
            selectedTower=null;

            return;

        }


    }



    // PLACE TOWER

    if(selectedTower==="arrow"){


        if(coins>=100 && !isOnPath(x,y)){


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


    let width=80;


    for(let i=0;i<path.length-1;i++){


        let a=path[i];
        let b=path[i+1];


        let dx=b.x-a.x;
        let dy=b.y-a.y;


        let length=Math.sqrt(dx*dx+dy*dy);


        let t=((x-a.x)*dx+(y-a.y)*dy)/(length*length);


        t=Math.max(0,Math.min(1,t));


        let cx=a.x+t*dx;
        let cy=a.y+t*dy;


        let distance=Math.sqrt(

            (x-cx)**2+
            (y-cy)**2

        );


        if(distance < width/2){

            return true;

        }


    }


    return false;

}



// =================
// ENEMY MOVEMENT
// =================

function moveEnemies(){


    enemies.forEach((enemy,index)=>{


        let target=path[enemy.point];


        let dx=target.x-enemy.x;
        let dy=target.y-enemy.y;


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



// =================
// TOWER SHOOTING
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

                    speed:7,

                    damage:tower.damage,

                    angle:tower.angle


                });


                tower.cooldown=tower.fireRate;


            }


        }


    });


}
