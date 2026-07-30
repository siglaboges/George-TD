
// =================================
// GEORGE TD v0.4.0
// ENEMIES SYSTEM
// =================================


// ===============================
// ENEMY TIERS
// ===============================


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





// ===============================
// SPAWN ENEMY
// ===============================


function spawnEnemy(tier){


    let data = enemyTiers[tier];



    enemies.push({


        x:path[0].x,

        y:path[0].y,


        point:1,


        tier:tier,


        hp:data.hp,


        maxHp:data.hp,


        size:data.size,


        color:data.color,


        speed:2



    });


}





// ===============================
// ENEMY MOVEMENT
// ===============================


function moveEnemies(){


    enemies.forEach(
    (enemy,index)=>{


        let target =
        path[enemy.point];



        let dx =
        target.x - enemy.x;


        let dy =
        target.y - enemy.y;



        let distance =
        Math.sqrt(
            dx*dx+
            dy*dy
        );



        if(distance < enemy.speed){


            enemy.x =
            target.x;


            enemy.y =
            target.y;



            enemy.point++;



            if(
                enemy.point >= path.length
            ){


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





// ===============================
// DRAW ENEMIES
// ===============================


function drawEnemies(){


    enemies.forEach(
    enemy=>{


        let size =
        enemy.size;



        // enemy image


        ctx.drawImage(

            enemyImg,

            enemy.x-size/2,

            enemy.y-size/2,

            size,

            size

        );




        // tier colour overlay


        ctx.globalAlpha=0.25;



        ctx.fillStyle =
        enemy.color;



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

            size*
            (enemy.hp/enemy.maxHp),

            7

        );



    });


}
