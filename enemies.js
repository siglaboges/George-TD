// =========================
// GEORGE TD v0.4.1
// ENEMIES + WAVES
// =========================



// =========================
// ENEMY TIERS
// =========================

var enemyTiers = {

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
// WAVE DATA
// =========================

var enemiesLeftToSpawn = 0;

var waveInProgress = false;

var waveTimer = 5;

var spawnCooldown = 0;




// =========================
// SPAWN ENEMY
// =========================

function spawnEnemy(tier){


    var data = enemyTiers[tier];



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


    stage = currentWave;


    waveInProgress = true;



    enemiesLeftToSpawn =
    5 + currentWave * 2;


}




// =========================
// CHOOSE TIER
// =========================

function chooseTier(){


    var chance = Math.random();



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
// WAVE HANDLER
// =========================

function handleWaves(){



    if(gameOver)
        return;



    if(!waveInProgress){


        waveTimer--;



        if(waveTimer <= 0){

            startWave();

        }



        return;


    }






    if(
        enemiesLeftToSpawn > 0
        &&
        spawnCooldown <= 0
    ){



        spawnEnemy(

            chooseTier()

        );



        enemiesLeftToSpawn--;



        spawnCooldown = 40;


    }




    spawnCooldown--;






    if(

        enemiesLeftToSpawn <= 0

        &&

        enemies.length === 0

    ){



        waveInProgress = false;


        coins += 100;


        waveTimer = 5;


    }


}







// =========================
// ENEMY MOVEMENT
// =========================

function moveEnemies(){



    enemies.forEach(function(enemy,index){



        var target = path[enemy.point];



        var dx =
        target.x - enemy.x;


        var dy =
        target.y - enemy.y;



        var distance =
        Math.sqrt(

            dx*dx +

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





                if(lives <= 0){


                    lives = 0;


                    gameOver = true;


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
// DRAW ENEMIES
// =========================

function drawEnemies(){



    enemies.forEach(function(enemy){



        var size = enemy.size;



        ctx.drawImage(

            enemyImg,

            enemy.x-size/2,

            enemy.y-size/2,

            size,

            size

        );




        ctx.globalAlpha = 0.25;


        ctx.fillStyle = enemy.color;



        ctx.fillRect(

            enemy.x-size/2,

            enemy.y-size/2,

            size,

            size

        );



        ctx.globalAlpha = 1;





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
