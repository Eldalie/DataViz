/*global L
global d3

Js Scirpt for Data visualisation Projet : Evolution of Rock Music
Autor : Benjamin Girard / Paul Feng / Olga Popovych


Mains Script : It load the json , manage data , and manange the automatic timeline

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


//List of all Genre with theire associated color/icone that we use in the projet
//"psychedelic rock","progressive rock" ,'#33a02c' - 4
const GENRES = ["alternative rock","blues-rock","glam rock","indie rock","pop rock", "post rock", "psychedelic rock","rock 'n roll", "soft rock"]//["rock 'n roll","pop rock","blues-rock","indie rock","soft rock","alternative rock","hard rock"].sort();//...TODO
const COLOR = ['#e31a1c','#6a51a3','#800026','#fd8d3c','#ff6600','#df65b0','#7a0177','#3690c0','#9e9ac8']
//['#a6cee3','#1f78b4','#b2df8a','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a']//["#d53e4f", "#fc8d59", "#fee08b", "#ffffbf", "#e6f598", "#99d594", "#3288bd"] //[ "#547980" ,"#355C7D","#9DE0AD","#EDE574","#594F4F","#F8B195","#86AF49" ]
const ICONE_NAMES = ["guitar","guitare", "stars", "music-note", "star","bus","rocker","rock-and-roll","headphones"]


//First year of studie
const FIRSTYEAR = 1956;
//Last years of studie
const LASTYEAR = 2010;
//

//Select what year are selected by the user:
var YEARSTART = 0;
var YEAREND = 2900;

//Select what genre are selected by the user
var SELECTEDGENRE = GENRES.sort();
//ALL the DATA
var DATA = [];
//List of icone : array fill once at start up
var ICONES = [];



// GENRE SLECTION bar:
// for in reverse to have the same orther that in the strem graph
for(let genre of GENRES.slice().reverse())
{
    //build a canvas,with size proportionaly to the name of genre 
    let can =  $("<canvas  width=\""+(15+5+7+10*genre.length)+"\" height=\"40\"></canvas>");
    $('#genre').append(can)
     let check =   can[0];
     //check.type = "canvas";
    //console.log(check)
    let canvas = check.getContext("2d");
    
    //Draw a circle lije in the map
    canvas.beginPath();
                    canvas.fillStyle = COLOR[GENRES.indexOf(genre)];
                    canvas.arc(20, 20, 15, 0, Math.PI*2);
                    canvas.fill();
                    canvas.closePath();

                    canvas.fillStyle = '#FFFFFF';
                    //canvas.textAlign = 'center';
                    canvas.textBaseline = 'middle';
                    canvas.font = 'bold 14px Rockwell';

                    canvas.fillText(genre, 40, 20);
                    
    //add name propriety              
    check.name =genre ;
    
     can.on("click",
                 function() {
                console.log(this.name)
                if (this.checked) {
                    this.checked = false;
                    //Push the genre in the SELECTEDGENRE if the user click on the circle or texte if we are checked 
                    SELECTEDGENRE.push(this.name);
                    
                    // remove opacity if we add the genre
                    can.fadeTo(250,1);
                } else {
                   //remove the genre in the SELECTEDGENRE if the user click on the circle or texte and we are not checked 
                    SELECTEDGENRE = SELECTEDGENRE.filter(e => e !== this.name);
                                        this.checked = true;
                   // set opacity if we remove the genre
                                        can.fadeTo(250,0.25);
                }
               // keep SELECTEDGENRE in the right order
                SELECTEDGENRE = SELECTEDGENRE.sort();
                // Update all if SELECTEDGENRE is modified
                fill_stream();
                updatestream();
                updatemap();
            }
     )
}



// Return what are the actual data selected buy the user
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

// DO a asycronous sleep 
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



// Variable to the automatic timeline 
let stop = false;
let isPaused = false;
let resolvePause = () => {};
let pauseProm = Promise.resolve();

//var history_button = document.getElementById('history_button');
//history_button.value = "Start";

// When the user click on the start/stop button, start/stop the automatic timeline if needed 
function history_button_action() {
    if (!in_discover) {
        return discover();
    } else if (!isPaused) {
        return sendPause();
    } else {
        return sendContinue();
    }
}

//Pause the automatic timeline
function sendPause() {
    if(isPaused)
    {
        sendContinue();
        return;
    }
    isPaused = true;
    //history_button.value = "Continue";
    pauseProm = new Promise(resolve => resolvePause = resolve);
}
//Continue the automatic timeline
function sendContinue() {
    isPaused = false;
    //history_button.value = "Pause";
    resolvePause();
}
//STOP the automatic timeline

 function sendStop() {
    sendContinue();
    stop = true;
}

// varaible useful, so that the user can't launch twice the the automatic timeline
var in_discover = false;
//initiale time to wait bewtenne transition
var speed = 750;
async function discover()
{

    if(in_discover)//FOr safety
    {
        sendPause();
        return;
    }

    console.log("Enter in discover");
    stop = false;
    in_discover = true;
    //history_button.value = "Pause";

    YEARSTART = FIRSTYEAR;
    YEAREND = FIRSTYEAR+1;

    for(let i = YEARSTART ; i!= LASTYEAR + 1;i++)
    {

        await pauseProm;
        if (stop) break;
        updatemap();
       // brush.extent([YEARSTART,YEARSTART]);
        d3.select(".brush").transition().call(brush.move,  [weightYAxis+xScale(YEARSTART),weightYAxis+xScale(YEAREND) ]  );
        await sleep(speed);

        //YEARSTART= i;
        YEAREND=i+1;

    }

    console.log("outs of discover");
    in_discover = false;
    //history_button.value = "Restart";

}


function sendSpeedUP()
{
    //since speed is a time wi divide it to speed up the transition

    speed/=2;
}

function sendSpeedDown()
{
        //since speed is a time times by Two to slow to down

    speed*=2;
}


//load the data from the json 
d3.json("../data/data.json", function(data) {

 DATA = data;
 
 // build map stream graph

  fill_stream();
  updatestream();
  build_marker();
  updatemap();

});
