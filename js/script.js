/*global L
global d3

Js Scirpt for Data visualisation Projet : Evolution of Rock Music
Autor : Benjamin Girard / Paul Feng / Olga Popovych


*/

//Class for benchmark !
var timer = function(name) {
    var start = new Date();
    return {
        stop: function() {
            var end  = new Date();
            var time = end.getTime() - start.getTime();
            console.log('Timer:', name, 'finished in', time, 'ms');
        }
    }
};
//Class for benchmark !
//"psychedelic rock","progressive rock" ,'#33a02c' - 4
const GENRES = ["rock 'n roll","pop rock","glam rock","blues-rock","psychedelic rock", "soft rock", "alternative rock", "indie rock", "post rock"]//["rock 'n roll","pop rock","blues-rock","indie rock","soft rock","alternative rock","hard rock"].sort();//...TODO
const COLOR = ['#800026','#e31a1c','#fd8d3c','#980043','#df65b0','#7a0177','#6a51a3','#9e9ac8','#3690c0']
//['#a6cee3','#1f78b4','#b2df8a','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a']//["#d53e4f", "#fc8d59", "#fee08b", "#ffffbf", "#e6f598", "#99d594", "#3288bd"] //[ "#547980" ,"#355C7D","#9DE0AD","#EDE574","#594F4F","#F8B195","#86AF49" ]
const ICONE_NAMES = ["guitar","guitare", "music-note", "star","star","rock-and-roll","headphones"]

var ICONES = [];
//First year of studie
const FIRSTYEAR = 1956;
//Last years of studie
const LASTYEAR = 2010;
//

//Select what year show on the maps:
var YEARSTART = 0;
var YEAREND = 2900;

//Select what genre are selected by the user
var SELECTEDGENRE = GENRES.sort();
//ALL the DATA
var DATA = [];
//MAP INIT:



// GENRE SLECTION:
for(let genre of GENRES.slice().reverse())
{

    $('#genre').append("<label style=\"color:"+  COLOR[GENRES.indexOf(genre)]+"\" ><input  name=\""+genre+"\" type=\"checkbox\" checked >"+genre+"</label><br/>");
}


$('input[type=checkbox]').change(function() {
    //console.log(this.name)
    if (this.checked) {
        SELECTEDGENRE.push(this.name);
    } else {
        SELECTEDGENRE = SELECTEDGENRE.filter(e => e !== this.name);
    }
    SELECTEDGENRE = SELECTEDGENRE.sort();
    fill_stream();
    updatestream();
    updatemap();
});



function SelectToShow()
{
    var data = DATA;
     var selected = [];

     for(var element of data.data)
     {
        if(SELECTEDGENRE.includes(element[6][0]) &&  element[0]>=YEARSTART  && element[0]<YEAREND )
        {
            selected.push(element);
        }
     }
  return  selected;
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


//let stop = false;
let isPaused = false;
let resolvePause = () => {};
let pauseProm = Promise.resolve();

var history_button = document.getElementById('history_button');
//history_button.value = "Start";

function history_button_action() {
    if (!in_discover) {
        return discover();
    } else if (!isPaused) {
        return sendPause();
    } else {
        return sendContinue();
    }
}

function sendPause() {
    if(isPaused)
    {
        sendContinue();
        return;
    }
    isPaused = true;
    history_button.value = "Continue";
    pauseProm = new Promise(resolve => resolvePause = resolve);
}

function sendContinue() {
    isPaused = false;
    history_button.value = "Pause";
    resolvePause();
}
  
/* function sendStop() {
    stop = true;
} */

var in_discover = false;
async function discover()
{
    if(in_discover)
    {
        sendPause();    
        return;
    }
    
    console.log("Enter in discover");

    in_discover = true;
    //history_button.value = "Pause";

    YEARSTART = FIRSTYEAR;
    YEAREND = FIRSTYEAR+1;

    for(let i = YEARSTART ; i!= LASTYEAR + 1;i++)
    {
        //if (stop) break;
        await pauseProm;

        updatemap();
       // brush.extent([YEARSTART,YEARSTART]);
        d3.select(".brush").transition().call(brush.move,  [weightYAxis+xScale(YEARSTART),weightYAxis+xScale(YEAREND) ]  );
        await sleep(750);

        //YEARSTART= i;
        YEAREND=i+1;

    }


    in_discover = false;
    history_button.value = "Restart";

}



d3.json("data.json", function(data) {

 DATA = data;
 //DATA.data =  DATA.data.slice(0,100)

  fill_stream();
  updatestream();
  build_marker();
  updatemap();

});
