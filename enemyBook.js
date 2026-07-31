// =========================
// GEORGE TD v0.4.2
// ENEMY BOOK
// =========================



// =========================
// ENEMY INFORMATION
// =========================

var enemyBook = {


    1:{
        hp:1,
        split:"Nothing"
    },


    2:{
        hp:3,
        split:"Tier 1 + Tier 1"
    },


    3:{
        hp:5,
        split:"Tier 2 + Tier 1"
    },


    4:{
        hp:10,
        split:"Tier 3 + Tier 2"
    },


    5:{
        hp:25,
        split:"Tier 4 + Tier 3"
    },


    6:{
        hp:50,
        split:"Tier 5 + Tier 4"
    },


    7:{
        hp:100,
        split:"Tier 6 + Tier 5"
    },


    8:{
        hp:300,
        split:"Tier 7 + Tier 6"
    },


    9:{
        hp:750,
        split:"Tier 8 + Tier 8"
    }


};







// =========================
// DRAW ENEMY MENU
// =========================

function drawEnemyMenu(){



    if(!enemyMenuOpen)
        return;





    // background


    ctx.fillStyle =
    "rgba(0,0,0,0.85)";


    ctx.fillRect(

        150,

        80,

        980,

        580

    );





    ctx.fillStyle="white";


    ctx.font="35px Arial";


    ctx.textAlign="center";



    ctx.fillText(

        "ENEMY BOOK",

        canvas.width/2,

        125

    );





    ctx.font="20px Arial";


    ctx.textAlign="left";





    var y = 170;



    for(
        var i=1;
        i<=9;
        i++
    ){



        ctx.fillText(

            "Tier "+i,

            220,

            y

        );



        ctx.fillText(

            "HP: "+enemyBook[i].hp,

            400,

            y

        );



        ctx.fillText(

            "Splits into: "+enemyBook[i].split,

            620,

            y

        );



        y += 45;



    }





    ctx.textAlign="left";


}
