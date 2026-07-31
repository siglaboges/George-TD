// =========================
// GEORGE TD v0.4.4.1
// TOWERS + PROJECTILES
// =========================


// =========================
// PLACE TOWER
// =========================

function placeTower(x,y){


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






// =========================
// UPDATE TOWERS
// =========================

function updateTowers(){


    towers.forEach(function(tower){


        if(tower.cooldown>0){

            tower.cooldown--;

        }



        var target=null;



        enemies.forEach(function(enemy){



            var distance=Math.sqrt(

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








// =========================
// UPDATE PROJECTILES
// =========================

function updateProjectiles(){



    projectiles.forEach(function(arrow,index){



        if(!arrow.target){


            projectiles.splice(index,1);


            return;


        }





        var dx =
        arrow.target.x-arrow.x;



        var dy =
        arrow.target.y-arrow.y;



        var distance=Math.sqrt(

            dx*dx+
            dy*dy

        );





        arrow.angle=Math.atan2(

            dy,

            dx

        );






        if(distance<arrow.speed){



            arrow.target.hp-=arrow.damage;



            projectiles.splice(index,1);





            if(arrow.target.hp<=0){



                var enemyIndex =
                enemies.indexOf(
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

            tower.angle-Math.PI/2

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
// DRAW PROJECTILES
// =========================

function drawProjectiles(){



    projectiles.forEach(function(arrow){



        ctx.save();



        ctx.translate(

            arrow.x,

            arrow.y

        );



        ctx.rotate(

            arrow.angle-Math.PI/2

        );



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



    // =====================
    // PLACING MODE
    // =====================


    if(selectedTower==="arrow"){



        // tower blocking zones


        towers.forEach(function(tower){



            ctx.beginPath();



            ctx.arc(

                tower.x,

                tower.y,

                25,

                0,

                Math.PI*2

            );



            ctx.strokeStyle="white";


            ctx.lineWidth=3;


            ctx.stroke();



        });






        // placement circle


        invalidPlacement =
        !canPlaceTower(
            mouseX,
            mouseY
        );





        ctx.beginPath();



        ctx.arc(

            mouseX,

            mouseY,

            25,

            0,

            Math.PI*2

        );





        if(invalidPlacement){


            ctx.strokeStyle="red";


        }
        else{


            ctx.strokeStyle="lime";


        }



        ctx.lineWidth=3;


        ctx.stroke();



        return;


    }








    // =====================
    // NORMAL HOVER RANGE
    // =====================


    towers.forEach(function(tower){



        var distance=Math.sqrt(

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
