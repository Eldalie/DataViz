/*global L
global d3

Js Scirpt for Data visualisation Projet : Evolution of Rock Music
Autor : Benjamin Girard / Paul Feng / Olga Popovych


*/
// STREAM GRAPH
var year = undefined;

var stack = d3.stack(),
    layers = undefined;

var heightXAxis = 40;
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

    console.log(d3.event.sourceEvent)

    if( d3.event.selection == null) // if no sleection select only one year
    {
        var dest = xScale.invert(d3.event.sourceEvent.clientX-weightYAxis);
        YEARSTART = Math.floor(dest);
        YEAREND = Math.floor(dest);
    }
    else
    {

        var s = d3.event.selection;
        s[0] -=  weightYAxis;
        s[1] -=  weightYAxis;
        s = s.map(xScale.invert);
    
      YEARSTART = Math.round(s[0]);
      YEAREND = Math.round(s[1]);
    }

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
                }) .attr("dx", "+2.0em")
            .attr("dy", "+1.1em");
;
     svg.select('.y.axis').attr("transform", "translate(" + weightYAxis + "," + heightXAxis + ")");

    brush.extent([[weightYAxis, 0], [width, heightXAxis]])
    //console.log(d3.brushSelection(d3.select(".brush").node()))

    svg.select(".brush")
      .call(brush)
      .call(brush.move, (d3.brushSelection(d3.select(".brush").node()) || [weightYAxis,width]));
}