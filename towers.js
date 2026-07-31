// =========================
// GEORGE TD v0.4.0
// TOWERS + PROJECTILES
// =========================


// =========================
// MOUSE + TOWER PLACEMENT
// =========================

canvas.addEventListener("click",(event)=>{


    let rect = canvas.getBoundingClientRect();


    let x =
    (event.clientX - rect.left)
    *
    (canvas.width / rect.width);


    let y =
    (event.clientY - rect.top)
    *
    (canvas.height / rect.height);



    // SHOP BUTTON

    if(
        x < 120 &&
        y > canvas.height-120
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



        let t =
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



                tower.cooldown =
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





        let dx =
        arrow.target.x-arrow.x;


        let dy =
        arrow.target.y-arrow.y;



        let distance =
        Math.sqrt(

            dx*dx+
            dy*dy

        );



        arrow.angle=Math.atan2(

            dy,

            dx

        );





        if(distance < arrow.speed){



            arrow.target.hp -=
            arrow.damage;



            projectiles.splice(

                index,

                1

            );





            if(arrow.target.hp<=0){



                let i =
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
// DRAW TOWERS
// =========================

function drawTowers(){


    towers.forEach(tower=>{


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


    projectiles.forEach(arrow=>{


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



    // tower preview


    if(selectedTower==="arrow"){


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





    // existing tower hover


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



            ctx.fillStyle =
            "rgba(0,150,255,0.5)";



            ctx.fill();



        }


    });


}
