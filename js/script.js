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
var map = new L.Map("maps", {attributionControl: false , center: [ 46.519962, 6.633597], zoom: 2}).addLayer(new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));
build_icone();
//http://leaflet-extras.github.io/leaflet-providers/preview/
/*fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
  .then(function(response) { return response.json(); })
  .then(function(data) {L.geoJSON(data).addTo(map)});*/

var ArtistCluster = new PruneClusterForLeaflet(70,50);
ArtistCluster.BuildLeafletClusterIcon = function(cluster) {
        var e = new L.Icon.MarkerCluster();

        e.stats = cluster.stats;
        e.population = cluster.population;
        return e;
    };


map.addLayer(ArtistCluster);



// STREAM GRAPH
var year = undefined;

var stack = d3.stack(),
    layers = undefined;

var heightXAxis = 50;
var weightYAxis = 25;

var width = $("body").width();
var height = $("body").height()*0.25;

var svg = d3.select('#streamgraph')
         .append("svg").attr('class', 'svgstream').attr("width", width)
          .attr("height", height);


var xScale = d3.scaleLinear().domain([FIRSTYEAR, LASTYEAR ]);
var yScale = d3.scaleLinear();
var xAxis = d3.axisTop(xScale).tickFormat(d3.format("d")).ticks((LASTYEAR-FIRSTYEAR)/1.0);
var yAxis = d3.axisLeft(yScale);


svg.append('g').classed('x axis', true);
svg.append('g').classed('y axis', true);


var area = d3.area()
    .x(function(d, i) { return xScale(i+FIRSTYEAR); })
    .y0(function(d) { return yScale(d[0]); })
    .y1(function(d) { return yScale(d[1]); });


var brush = d3.brushX()
    .on("brush end", brushed);


svg.append("g")
    .attr("class", "stream");

svg.append("g")
    .attr("class", "brush");

function brushed()
{
  if (!d3.event.sourceEvent) return; // Only transition after input.
    //console.log(d3.event)
  //if(d3.event.type != "end") return;

    //console.log(d3.event)

    var s = d3.event.selection || xScale.range();
    s = s.map(xScale.invert);

 //console.log(s)
  YEARSTART = Math.floor(s[0]);
  YEAREND = Math.floor(s[1]);

  if(YEAREND-YEARSTART<1)
  YEAREND =YEARSTART+1;

  updatemap();

    //console.log([(YEARSTART),(YEAREND) ])

    //console.log([xScale(YEARSTART),xScale(YEAREND) ])

  if(d3.event.type != "end") return;
  d3.select(this).transition().call(d3.event.target.move, [weightYAxis+xScale(YEARSTART),weightYAxis+xScale(YEAREND) ] );


}

function stackMax(layer) {
  return d3.max(layer, function(d) { return d[1]; });
}

function stackMin(layer) {
  return d3.min(layer, function(d) { return d[0]; });
}

function fill_stream()
{
    var data = DATA;
    var n  = SELECTEDGENRE.length;
    year =  new Array(LASTYEAR-FIRSTYEAR);

    for(var element of data.data)
     {
        if(SELECTEDGENRE.includes(element[6][0]) )
        {
             if( year[element[0]-FIRSTYEAR] == undefined)
                year[element[0]-FIRSTYEAR] =  new Array(n).fill(0);

            year[element[0]-FIRSTYEAR][SELECTEDGENRE.indexOf(element[6][0])]+=1;


        }
     }
      if(year[0] == undefined)
            year[0] = new Array(n).fill(0)
     for(var y=1;y< year.length;y++)
     {
         if(year[y] == undefined)
         {
            year[y] = new Array(n).fill(0)
             for(var x=0;x< SELECTEDGENRE.length;x++)
             year[y][x]=0//Math.floor(Math.random() *(x+2) )
         }

         //for(var x=0;x< GENRES.length;x++)
         //    year[y][x] = year[y-1][x]+year[y][x];
     }
    stack = d3.stack();
    stack.keys(d3.range(SELECTEDGENRE.length)).offset(d3.stackOffsetWiggle);
    layers = stack(year);
    yScale.domain([d3.min(layers, stackMin), d3.max(layers, stackMax)]);
}


function updatestream()
{
    map.invalidateSize();


    //console.log("update");

    width = $("#streamgraph").width()-1;
    height =$("#streamgraph").height()-1;
    //console.log(width,height)


     xScale.range([0, width-weightYAxis]);

     yScale.range([height-heightXAxis, 0]);

     //xAxis.scale(xScale)
     //yAxis.scale(yScale);

    svg.attr("width", width).attr("height", height);

    var paths = svg.select(".stream").selectAll(".chemin")
               .data(layers);
    paths.exit().remove();
    var enter = paths.enter().append("path").attr("transform", "translate(" + weightYAxis + "," + heightXAxis + ")").attr('class', 'chemin')  ;
    enter.merge(paths).attr("d", area).attr("fill", function(d,i) { return COLOR[GENRES.indexOf(SELECTEDGENRE[i])] ; });

    svg.select(".stream").selectAll(".chemin")
        .attr("opacity", 1)
        .on("mouseover", function(d, i) {
            d3.select('#streamgraph').select(".stream").selectAll(".chemin").transition()
                .duration(250)
                .attr("opacity", function(d, j) {
                    return j != i ? 0.6 : 1;
                })
            })
    
    svg.select('.x.axis').call(xAxis);
    svg.select('.y.axis').call(yAxis)
     svg.select('.x.axis').attr("transform", "translate(" + weightYAxis + ","+heightXAxis+")")
     .selectAll("text")
            .attr("transform", function(d) {
                return "rotate(-65)"
                }) .attr("dx", "+2.2em")
            .attr("dy", "+1.3em");
;
     svg.select('.y.axis').attr("transform", "translate(" + weightYAxis + "," + heightXAxis + ")");

    brush.extent([[weightYAxis, 0], [width, heightXAxis]])
    //console.log(d3.brushSelection(d3.select(".brush").node()))

    svg.select(".brush")
      .call(brush)
      .call(brush.move, (d3.brushSelection(d3.select(".brush").node()) || [weightYAxis,width]));
}





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


function build_icone()
{
    ICONES = [];
    for(let color of COLOR)
    {

             
         var Icon = new L.Icon({
              iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-'+color+'.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
        })

    ICONES.push(Icon)
    }

}

function build_marker()
{



    for(var element of DATA.data)
    {

        let index_genre = GENRES.indexOf(element[6][0]);
        var color =  COLOR[index_genre];

        element["marker"] = new PruneCluster.Marker(element[1]+Math.random()/5.0, element[2]+Math.random()/5.0);//,{color:color}) // L.marker( [element[1], element[2]] , {icon: greenIcon});

        element["marker"].data.icon = ICONES[index_genre];  // See http://leafletjs.com/reference.html#icon
        element["marker"].data.popup = 'Year : '+element[0]+'<br/>Artist Name: '+element[4]+' <br/> Tittle: '+element[7]+'<br/> GENRE : '+element[6][0]+' <br/> hotness : '+element[3]+'/'+element[8];

        element["marker"].category = index_genre ;
        element["marker"].weight = 4;
        ArtistCluster.RegisterMarker(element["marker"]);
        //console.log("MARKER  :"+[element[1], element[2]])
    }


}
function updatemap()
{


    //var t = timer("SELECT");
    var data = SelectToShow();


       for(var element of DATA.data)
    {
        element['marker'].filtered = true;
    }


    for(var element of data)
    {

    //console.log("add"  + element['marker'] )
        // Artist.addLayer( element['marker'] );
        element['marker'].filtered = false;
        //console.log("MARKER  :"+[element[1], element[2]])
    }
    ArtistCluster.ProcessView();
    //Artist.addTo(map);
    //t.stop()
}


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


var colors =COLOR;// ['#ff4b00', '#bac900', '#EC1813', '#55BCBE', '#D2204C', '#FF0000', '#ada59a', '#3e647e'],
        pi2 = Math.PI * 2;

    L.Icon.MarkerCluster = L.Icon.extend({
        options: {
            iconSize: new L.Point(44, 44),
            className: 'prunecluster leaflet-markercluster-icon'
        },

        createIcon: function () {
            // based on L.Icon.Canvas from shramov/leaflet-plugins (BSD licence)
            var e = document.createElement('canvas');
            this._setIconStyles(e, 'icon');
            var s = this.options.iconSize;
            e.width = s.x;
            e.height = s.y;
            this.draw(e.getContext('2d'), s.x, s.y);
            return e;
        },

        createShadow: function () {
            return null;
        },

        draw: function(canvas, width, height) {

            var lol = 0;

            var start = 0;
            for (var i = 0, l = colors.length; i < l; ++i) {

                var size = this.stats[i] / this.population;


                if (size > 0) {
                    canvas.beginPath();
                    canvas.moveTo(22, 22);
                    canvas.fillStyle = colors[i];
                    var from = start + 0.14,
                        to = start + size * pi2;

                    if (to < from) {
                        from = start;
                    }
                    canvas.arc(22,22,22, from, to);

                    start = start + size*pi2;
                    canvas.lineTo(22,22);
                    canvas.fill();
                    canvas.closePath();
                }

            }

            canvas.beginPath();
            canvas.fillStyle = 'white';
            canvas.arc(22, 22, 18, 0, Math.PI*2);
            canvas.fill();
            canvas.closePath();

            canvas.fillStyle = '#555';
            canvas.textAlign = 'center';
            canvas.textBaseline = 'middle';
            canvas.font = 'bold 12px sans-serif';

            canvas.fillText(this.population, 22, 22, 40);
        }
    });
