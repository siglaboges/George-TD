
// =================================
// GEORGE TD v0.4.0
// WAVES SYSTEM
// =================================


// ===============================
// WAVE DATA
// ===============================


let currentWave = 0;

let waveInProgress = false;

let enemiesLeftToSpawn = 0;


let waveTimer = 5;

let spawnCooldown = 0;





// ===============================
// START WAVE
// ===============================


function startWave(){


    currentWave++;


    stage=currentWave;


    waveInProgress=true;



    enemiesLeftToSpawn =
    5 + currentWave * 2;


}







// ===============================
// CHOOSE ENEMY TIER
// ===============================


function chooseTier(){


    let chance =
    Math.random();



    if(currentWave<3){


        return 1;


    }




    if(currentWave<5){


        return chance<0.8
        ?1
        :2;


    }





    if(currentWave<8){


        if(chance<0.7)
            return 1;


        if(chance<0.95)
            return 2;


        return 3;


    }





    if(currentWave<12){


        if(chance<0.5)
            return 2;


        if(chance<0.85)
            return 3;


        return 4;


    }





    return Math.floor(
        Math.random()*5
    )+1;



}







// ===============================
// HANDLE WAVES
// ===============================


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
