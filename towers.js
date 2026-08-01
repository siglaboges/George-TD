// =========================
// GEORGE TD v0.4.4.5
// TOWER ENGINE
// =========================



// =========================
// TOWER DATA
// =========================

const towerTypes = {


    arrow:{


        name:"Arrow Tower",


        cost:100,


        damage:1,


        range:220,


        fireRate:40,


        projectileSpeed:8,


        size:50,


        sprite:arrowImg,


        projectileSprite:arrowPImg


    }



};








// =========================
// PLACE TOWER
// =========================

function placeTower(x,y,type){



    let data =
    towerTypes[type];



    if(!data)
        return;




    towers.push({



        type:type,


        x:x,


        y:y,



        damage:data.damage,


        range:data.range,


        fireRate:data.fireRate,


        cooldown:0,


        projectileSpeed:data.projectileSpeed,



        size:data.size,



        sprite:data.sprite,


        projectileSprite:data.projectileSprite,



        angle:0



    });




    coins-=data.cost;



}








// =========================
// UPDATE TOWERS
// =========================

function updateTowers(){



    towers.forEach(function(tower){



        if(tower.cooldown>0){


            tower.cooldown--;


        }





        let target=null;



        enemies.forEach(function(enemy){



            let distance=Math.sqrt(


                (enemy.x-tower.x)**2+

                (enemy.y-tower.y)**2


            );



            if(distance<=tower.range){


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



                    speed:tower.projectileSpeed,


                    damage:tower.damage,



                    angle:tower.angle,



                    sprite:tower.projectileSprite



                });





                tower.cooldown=tower.fireRate;



            }



        }





    });




}








// =========================
// UPDATE PROJECTILES
// =========================

function updateProjectiles(){



    projectiles.forEach(function(projectile,index){



        if(!projectile.target){


            projectiles.splice(index,1);


            return;


        }






        let dx =
        projectile.target.x-projectile.x;



        let dy =
        projectile.target.y-projectile.y;




        let distance=Math.sqrt(


            dx*dx+

            dy*dy


        );






        projectile.angle=Math.atan2(


            dy,


            dx


        );






        if(distance < projectile.speed){



            projectile.target.hp -= projectile.damage;



            projectiles.splice(index,1);






            if(projectile.target.hp<=0){



                let enemyIndex =
                enemies.indexOf(projectile.target);



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



            projectile.x +=

            (dx/distance)

            *

            projectile.speed;





            projectile.y +=

            (dy/distance)

            *

            projectile.speed;




        }



    });



}
// =========================
// DRAW TOWERS
// =========================

function drawTowers(){



    towers.forEach(function(tower){



        ctx.save();



        ctx.translate(

            tower.x,

            tower.y

        );



        ctx.rotate(

            tower.angle - Math.PI/2

        );



        ctx.drawImage(

            tower.sprite,

            -tower.size/2,

            -tower.size/2,

            tower.size,

            tower.size

        );



        ctx.restore();



    });



}









// =========================
// DRAW PROJECTILES
// =========================

function drawProjectiles(){



    projectiles.forEach(function(projectile){



        ctx.save();



        ctx.translate(

            projectile.x,

            projectile.y

        );



        ctx.rotate(

            projectile.angle - Math.PI/2

        );



        ctx.drawImage(

            projectile.sprite,

            -17.5,

            -17.5,

            35,

            35

        );



        ctx.restore();



    });



}









// =========================
// TOWER PLACEMENT CHECK
// =========================

function canPlaceTower(x,y){



    // Path check

    if(isOnPath(x,y)){


        return false;


    }






    // Tower overlap check

    towers.forEach(function(tower){



        let distance=Math.sqrt(


            (x-tower.x)**2+

            (y-tower.y)**2


        );



        if(distance < 40){


            return false;


        }



    });






    return true;



}









// =========================
// RANGE + PLACEMENT DISPLAY
// =========================

function drawRangeCircles(){



    // placing tower


    if(selectedTower==="arrow"){



        // existing tower blocked zones


        towers.forEach(function(tower){



            ctx.beginPath();



            ctx.arc(


                tower.x,


                tower.y,


                20,


                0,


                Math.PI*2


            );



            ctx.strokeStyle="white";


            ctx.lineWidth=3;


            ctx.stroke();



        });








        let valid =
        canPlaceTower(

            mouseX,

            mouseY

        );






        // attack range preview


        let towerData =
        towerTypes.arrow;





        ctx.beginPath();



        ctx.arc(


            mouseX,


            mouseY,


            towerData.range,


            0,


            Math.PI*2


        );





        ctx.fillStyle = valid

        ? "rgba(0,150,255,0.25)"

        : "rgba(255,0,0,0.25)";



        ctx.strokeStyle = valid

        ? "lime"

        : "red";





        ctx.fill();


        ctx.lineWidth=3;


        ctx.stroke();








        // placement circle


        ctx.beginPath();



        ctx.arc(


            mouseX,


            mouseY,


            20,


            0,


            Math.PI*2


        );



        ctx.strokeStyle = valid

        ? "white"

        : "red";



        ctx.stroke();



    }








    // normal tower hover range


    if(selectedTower===null){



        towers.forEach(function(tower){



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

                "rgba(0,150,255,0.35)";



                ctx.fill();



            }



        });



    }



}
