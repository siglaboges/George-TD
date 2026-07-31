// =========================
// GEORGE TD v0.4.1
// TOWERS + PROJECTILES
// =========================



// =========================
// PLACE TOWER
// =========================

function placeTower(x,y){


    if(
        coins >= 100
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



        coins -= 100;


    }


}






// =========================
// PATH CHECK
// =========================

function isOnPath(x,y){



    for(
        var i=0;
        i<path.length-1;
        i++
    ){



        var a = path[i];

        var b = path[i+1];



        var dx = b.x-a.x;

        var dy = b.y-a.y;



        var length = Math.sqrt(

            dx*dx+

            dy*dy

        );



        var t =

        (

            (x-a.x)*dx +

            (y-a.y)*dy

        )

        /

        (length*length);





        t = Math.max(

            0,

            Math.min(1,t)

        );





        var cx = a.x + t*dx;

        var cy = a.y + t*dy;





        var distance = Math.sqrt(

            (x-cx)**2 +

            (y-cy)**2

        );





        if(distance < 40){

            return true;

        }



    }



    return false;


}







// =========================
// TOWER SHOOTING
// =========================

function updateTowers(){



    towers.forEach(function(tower){



        if(tower.cooldown > 0){

            tower.cooldown--;

        }




        var target = null;




        enemies.forEach(function(enemy){



            var distance = Math.sqrt(

                (enemy.x-tower.x)**2 +

                (enemy.y-tower.y)**2

            );



            if(distance < tower.range){


                target = enemy;


            }



        });






        if(target){



            tower.angle = Math.atan2(

                target.y-tower.y,

                target.x-tower.x

            );







            if(tower.cooldown <= 0){



                projectiles.push({


                    x:tower.x,


                    y:tower.y,



                    target:target,



                    speed:8,



                    damage:tower.damage,



                    angle:tower.angle


                });




                tower.cooldown =
                tower.fireRate;



            }



        }



    });



}








// =========================
// PROJECTILES
// =========================

function updateProjectiles(){



    projectiles.forEach(function(arrow,index){



        if(!arrow.target){



            projectiles.splice(

                index,

                1

            );


            return;


        }






        var dx =
        arrow.target.x-arrow.x;



        var dy =
        arrow.target.y-arrow.y;




        var distance = Math.sqrt(

            dx*dx+

            dy*dy

        );





        arrow.angle = Math.atan2(

            dy,

            dx

        );






        if(distance < arrow.speed){



            arrow.target.hp -= arrow.damage;




            projectiles.splice(

                index,

                1

            );






            if(arrow.target.hp <= 0){



                var enemyIndex =
                enemies.indexOf(

                    arrow.target

                );




                if(enemyIndex != -1){



                    enemies.splice(

                        enemyIndex,

                        1

                    );



                    coins += 10;


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

            arrow.angle - Math.PI/2

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



    // placing preview


    if(selectedTower === "arrow"){



        ctx.beginPath();



        ctx.arc(

            mouseX,

            mouseY,

            220,

            0,

            Math.PI*2

        );



        ctx.fillStyle =
        "rgba(0,150,255,0.5)";



        ctx.fill();



    }






    // tower hover


    towers.forEach(function(tower){



        var distance = Math.sqrt(

            (mouseX-tower.x)**2 +

            (mouseY-tower.y)**2

        );





        if(distance < 35){



            ctx.beginPath();



            ctx.arc(

                tower.x,

                tower.y,

                tower.range,

                0,

                Math.PI*2

            );



            ctx.fillStyle =
            "rgba(0,150,255,0.5)";



            ctx.fill();



        }



    });



}
