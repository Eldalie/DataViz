/*global L
global d3
*/

const GENRES = ["hip hop","soft rock","folk rock"];//...TODO
const COLOR = ["green","blue","red","violet"]
var YEARSTART = 0;
var YEAREND = 2900;
var FIRSTYEAR = 1900;
var LASTYEAR = 2015;
var SELECTEDGENRE = GENRES;
var DATA = [];

// DECLARATION ....

//MAP INIT:
var map = new L.Map("maps", {center: [37.8, -96.9], zoom: 4}).addLayer(new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));
var Artist =  L.layerGroup();



// STREAM GRAPH
var year = undefined;

var stack = d3.stack(),
    layers = undefined;

var width = $("body").width();
var height = $("body").height()*0.25;

var svg = d3.select('#streamgraph')
         .append("svg").attr("width", width)
          .attr("height", height);




var xScale = d3.scaleLinear().domain([0, LASTYEAR-FIRSTYEAR ]);
var yScale = d3.scaleLinear();
var xAxis = d3.axisTop(xScale)
var yAxis = d3.axisLeft(yScale);


svg.append('g').classed('x axis', true);
svg.append('g').classed('y axis', true);


var area = d3.area()
    .x(function(d, i) { return xScale(i); })
    .y0(function(d) { return yScale(d[0]); })
    .y1(function(d) { return yScale(d[1]); });


var brush = d3.brushX()
    .on("brush end", brushed);

svg.append("g")
    .attr("class", "brush");

function brushed()
{
    
    var s = d3.event.selection || xScale.range();
    s = s.map(xScale.invert);

  YEARSTART = s[0]+FIRSTYEAR;
  YEAREND = s[1]+FIRSTYEAR;
    console.log(YEARSTART,YEAREND)
  updatemap();

    
}

function stackMax(layer) {
  return d3.max(layer, function(d) { return d[1]; });
}

function stackMin(layer) {
  return d3.min(layer, function(d) { return d[0]; });
}

function fill_stream(data)
{
    var n  = GENRES.length;

    year =  new Array(LASTYEAR-FIRSTYEAR);

    for(var element of data.data)
     {
        if(GENRES.includes(element[6][0]) )
        {
            year[element[0]-FIRSTYEAR] =  new Array(n).fill(0);
            
            year[element[0]-FIRSTYEAR][GENRES.indexOf(element[6][0])]+=1;
        }
     }
      if(year[0] == undefined)
            year[0] = new Array(n).fill(0)
     for(var y=1;y< year.length;y++)
     {
         if(year[y] == undefined)
         {
            year[y] = new Array(n).fill(0)
             for(var x=0;x< GENRES.length;x++)
             year[y][x]+=Math.floor(Math.random() *(x+2) )
         }
         
         for(var x=0;x< GENRES.length;x++)
             year[y][x] = year[y-1][x]+year[y][x]; 
     }
    stack.keys(d3.range(GENRES.length)).offset(d3.stackOffsetWiggle);
    layers = stack(year);
    yScale.domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
}


function updatestream()
{
    map.invalidateSize();

    
    console.log("update");
    
    width = $("#streamgraph").width(),
    height =$("#streamgraph").height();
    console.log(width,height)


     xScale.range([0, width]);
    
     yScale.range([height, 0]);
     
     xAxis.scale(xScale)
     yAxis.scale(yScale);

    svg.attr("width", width).attr("height", height);

    var paths = svg.selectAll(".chemain")
               .data(layers);
    //paths.exit().remove();       
    var enter = paths.enter().append("path").attr('class', 'chemain')  ;
    enter.merge(paths).attr("d", area).attr("fill", function(d,i) { return COLOR[i]; });

    svg.select('.x.axis').call(xAxis);
    svg.select('.y.axis').call(yAxis);
    
    brush.extent([[0, 0], [width, height]])
    console.log(d3.brushSelection(d3.select(".brush").node()))
    
    svg.select(".brush") 
      .call(brush)
      .call(brush.move, (d3.brushSelection(d3.select(".brush").node()) || xScale.range()));
}





// GENRE SLECTION:
for(genre of GENRES)
{
    
    $('#genre').append("<label style=\"color:"+ COLOR[GENRES.indexOf(genre)]+"\" ><input  name=\""+genre+"\" type=\"checkbox\"/>"+genre+"</label><br/>");
}


$('input[type=checkbox]').change(function() {
    console.log(this.name)
    if (this.checked) {
        SELECTEDGENRE.push(this.name); 
    } else {
        SELECTEDGENRE = SELECTEDGENRE.filter(e => e !== this.name);
    }
    updatemap();
});



function updatemap()
{
    var data = SelectToShow();
    Artist.clearLayers();
    
    for(var element of data)
    {
 
        
        var color =  COLOR[GENRES.indexOf(element[6][0])];
        var greenIcon = new L.Icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-'+color+'.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
         var m = L.marker( [element[1], element[2]] , {icon: greenIcon});

         Artist.addLayer( m );
        
        //console.log("MARKER  :"+[element[1], element[2]])
    }
    //map.addLayer(Artist);
    Artist.addTo(map);
}


function SelectToShow()
{
    var data = DATA;
     var selected = [];
 
     for(var element of data.data)
     {
        if(SELECTEDGENRE.includes(element[6][0]) &&  element[0]>=YEARSTART  && element[0]<=YEAREND )
        {
            selected.push(element);
        }
     }
  return  selected;
}




d3.json("data.json", function(data) {
 
 DATA = data;
  updatemap();
  fill_stream(data);
  updatestream();
//MAPS !! 

});
