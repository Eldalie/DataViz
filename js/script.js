/*global L
global d3
*/

const GENRES = ["rock 'n roll","pop rock","blues-rock","indie rock","soft rock","alternative rock"];//...TODO
const COLOR = ["green","blue","red","violet","yellow","orange"]
var YEARSTART = 0;
var YEAREND = 2900;
var FIRSTYEAR = 1960;
var LASTYEAR = 2010;
var SELECTEDGENRE = GENRES;
var DATA = [];

// DECLARATION ....

//MAP INIT:
var map = new L.Map("maps", {attributionControl: false , center: [ 46.519962, 6.633597], zoom: 2})//.addLayer(new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));
fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
  .then(function(response) { return response.json(); })
  .then(function(data) {L.geoJSON(data).addTo(map)});

var Artist =  L.layerGroup();



// STREAM GRAPH
var year = undefined;

var stack = d3.stack(),
    layers = undefined;

var heightXAxis = 25;
var weightYAxis = 25;

var width = $("body").width();
var height = $("body").height()*0.25;

var svg = d3.select('#streamgraph')
         .append("svg").attr('class', 'svgstream').attr("width", width)
          .attr("height", height);




var xScale = d3.scaleLinear().domain([FIRSTYEAR, LASTYEAR ]);
var yScale = d3.scaleLinear();
var xAxis = d3.axisTop(xScale).tickFormat(d3.format("d")).ticks((LASTYEAR-FIRSTYEAR)/2);
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
 
  
    var s = d3.event.selection || xScale.range();
    s = s.map(xScale.invert);

 console.log(s)
  YEARSTART = Math.floor(s[0]);
  YEAREND = Math.floor(s[1]);

  if(YEAREND-YEARSTART<1)
  YEAREND =YEARSTART+1; 

  updatemap();
  
    console.log([(YEARSTART),(YEAREND) ])

    console.log([xScale(YEARSTART),xScale(YEAREND) ])


  d3.select(this).transition().call(d3.event.target.move, [weightYAxis+xScale(YEARSTART),weightYAxis+xScale(YEAREND) ] );

    
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
             if( year[element[0]-FIRSTYEAR] == undefined)
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
             year[y][x]=0//Math.floor(Math.random() *(x+2) )
         }
         
         //for(var x=0;x< GENRES.length;x++)
         //    year[y][x] = year[y-1][x]+year[y][x]; 
     }

    stack.keys(d3.range(GENRES.length)).offset(d3.stackOffsetWiggle);
    layers = stack(year);
    yScale.domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
}


function updatestream()
{
    map.invalidateSize();

    
    console.log("update");
    
    width = $("#streamgraph").width()-1;
    height =$("#streamgraph").height()-1;
    console.log(width,height)


     xScale.range([0, width-weightYAxis]);
    
     yScale.range([height-heightXAxis, 0]);
     
     //xAxis.scale(xScale)
     //yAxis.scale(yScale);

    svg.attr("width", width).attr("height", height);

    var paths = svg.select(".stream").selectAll(".chemain")
               .data(layers);
    //paths.exit().remove();       
    var enter = paths.enter().append("path").attr("transform", "translate(" + weightYAxis + "," + heightXAxis + ")").attr('class', 'chemain')  ;
    enter.merge(paths).attr("d", area).attr("fill", function(d,i) { return COLOR[i]; });

    svg.select('.x.axis').call(xAxis);
    svg.select('.y.axis').call(yAxis)
     svg.select('.x.axis').attr("transform", "translate(" + weightYAxis + ","+heightXAxis+")");
     svg.select('.y.axis').attr("transform", "translate(" + weightYAxis + "," + heightXAxis + ")");
     
    brush.extent([[weightYAxis, heightXAxis], [width, height]])
    console.log(d3.brushSelection(d3.select(".brush").node()))
    
    svg.select(".brush") 
      .call(brush)
      .call(brush.move, (d3.brushSelection(d3.select(".brush").node()) || [weightYAxis,width]));
}





// GENRE SLECTION:
for(genre of GENRES)
{
    
    $('#genre').append("<label style=\"color:"+ COLOR[GENRES.indexOf(genre)]+"\" ><input  name=\""+genre+"\" type=\"checkbox\" checked >"+genre+"</label><br/>");
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
        if(SELECTEDGENRE.includes(element[6][0]) &&  element[0]>=YEARSTART  && element[0]<YEAREND )
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
