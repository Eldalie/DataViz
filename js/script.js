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

const GENRES = ["rock 'n roll","pop rock","blues-rock","indie rock","soft rock","alternative rock"].sort();//...TODO


const COLOR = ["#594F4F","#EDE574" ,"#355C7D" ,"#F8B195" ,"#9DE0AD","#547980" ]

var ICONES = [];
//First year of studie
const FIRSTYEAR = 1956;
//Last years of studie
const LASTYEAR = 2010;
//

//Select what yer show on the maps:
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

var in_discover = false;
async function discover()
{
    if(in_discover)
    return;
    in_discover = true;

    YEARSTART = FIRSTYEAR;
    YEAREND = FIRSTYEAR+1;

    for(let i = YEARSTART ; i!= LASTYEAR;i++)
    {


        updatemap();
       // brush.extent([YEARSTART,YEARSTART]);
        d3.select(".brush").transition().call(brush.move,  [weightYAxis+xScale(YEARSTART),weightYAxis+xScale(YEAREND) ]  );
        await sleep(750);

        YEARSTART= i;
        YEAREND=i+1;

    }


    in_discover = false;

}


d3.json("data.json", function(data) {

 DATA = data;
 //DATA.data =  DATA.data.slice(0,100)

  fill_stream();
  updatestream();
  build_marker();
  updatemap();

});


