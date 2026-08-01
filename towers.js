// =========================
// RANGE CIRCLES v0.4.4.2
// =========================

function drawRangeCircles(){



    // =====================
    // PLACING TOWER
    // =====================

    if(selectedTower==="arrow"){



        // Show forbidden zones around towers

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







        invalidPlacement =
        !canPlaceTower(

            mouseX,

            mouseY

        );







        // Attack range preview

        ctx.beginPath();



        ctx.arc(

            mouseX,

            mouseY,

            220,

            0,

            Math.PI*2

        );





        if(invalidPlacement){


            ctx.fillStyle=
            "rgba(255,0,0,0.25)";


            ctx.strokeStyle="red";


        }
        else{


            ctx.fillStyle=
            "rgba(0,150,255,0.25)";


            ctx.strokeStyle="lime";


        }





        ctx.fill();


        ctx.lineWidth=3;


        ctx.stroke();







        // Placement collision circle

        ctx.beginPath();



        ctx.arc(

            mouseX,

            mouseY,

            20,

            0,

            Math.PI*2

        );



        ctx.strokeStyle =

        invalidPlacement

        ? "red"

        : "white";



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
