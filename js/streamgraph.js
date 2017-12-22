/*global L
global d3

Js Scirpt for Data visualisation Projet : Evolution of Rock Music
Autor : Benjamin Girard / Paul Feng / Olga Popovych


*/
// STREAM GRAPH
var year = undefined;

var stack = d3.stack(),
    layers = undefined;

var heightXAxis = 45;
var weightYAxis = 5;

var width = $("body").width()-40;
var height = $("body").height()*0.25;

var svg = d3.select('#streamgraphSVG')
         .append("svg").attr('class', 'svgstream').attr("width", width)
          .attr("height", height);


var xScale = d3.scaleLinear().domain([FIRSTYEAR, LASTYEAR ]);
var yScale = d3.scaleLinear();
var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks((LASTYEAR-FIRSTYEAR)/1.0);
var yAxis = d3.axisLeft(yScale);


svg.append('g').classed('x axis', true);
svg.append('g').classed('y axis', true);


var area = d3.area()
    .x(function(d, i) { return xScale(i+FIRSTYEAR); })
    .y0(function(d) { return yScale(d[0]); })
    .y1(function(d) { return yScale(d[1]); });


var brush = d3.brushX()
    .on("brush end", brushed);



var tooltip  =  d3.select(".tooltip");

svg.append("g")
    .attr("class", "stream");

svg.append("g")
    .attr("class", "brush");

function brushed()
{
    

  if (!d3.event.sourceEvent) return; // Only transition after input.
    //console.log(d3.event)
  //if(d3.event.type != "end") return;

    console.log(d3.event);//.sourceEvent)

    if( d3.event.selection == null /*|| d3.event.sourceEvent.type=="mouseup"*/) // if no sleection select only one year
    {
        var dest = xScale.invert(d3.event.sourceEvent.layerX-weightYAxis);
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

    width = $("#streamgraphSVG").width()-40;
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
    var enter = paths.enter().append("path").attr("transform", "translate(" + weightYAxis + "," + 0 + ")").attr('class', 'chemin')  ;
    enter.merge(paths).attr("d", area).attr("fill", function(d,i) { return COLOR[GENRES.indexOf(SELECTEDGENRE[i])] ; });

    svg.select(".stream").selectAll(".chemin")
        .attr("opacity", 0.95)
        .classed('selected', true)
        .on("mousemove", function(d, i) {
            d3.select('#streamgraph').select(".stream").selectAll(".chemin").transition()
                .duration(250)
                .attr("stroke", function(d, j) {
                    return j != i ? "none" : COLOR[GENRES.indexOf(SELECTEDGENRE[i])];
                })
                .attr("stroke-width", 2)
            
            console.log();
            let anner = Math.floor(xScale.invert(d3.event.layerX));
            
            
            tooltip.html(SELECTEDGENRE[i]+"<br/>"+year[anner-FIRSTYEAR][i]+" songs in the year "+anner);
            
            let clip = function(a,b,c){return Math.max(a,Math.min(b,c)) ;} 
            
            tooltip.style("color",(COLOR[GENRES.indexOf(SELECTEDGENRE[i])] ))
                .style("left",  clip(0+15,d3.event.layerX+40,width -85) + "px")		
                .style("top", (d3.event.layerY+5) + "px");	
            
             }
            )
        .on("mouseout", function() {
            d3.select('#streamgraph').select(".stream").selectAll(".chemin").attr('stroke', 'none')
            tooltip.style("left", "-10%")		
                .style("top", "-10%");
        })
        
    
    svg.select('.x.axis').call(xAxis);
    svg.select('.y.axis').call(yAxis).selectAll("text").remove();
     svg.select('.x.axis').attr("transform", "translate(" + weightYAxis + ","+ (height-heightXAxis )+")")
     .selectAll("text").attr("dx", "-1.2em")
            .attr("dy", "+1.6em")
            .attr("transform", function(d) {
                return "rotate(-65)"
                }) 

     svg.select('.y.axis').attr("transform", "translate(" + weightYAxis + "," + 0 + ")");

    brush.extent([[weightYAxis, height-heightXAxis], [width, height]])
    //console.log(d3.brushSelection(d3.select(".brush").node()))

    svg.select(".brush")
      .call(brush)
      .call(brush.move, (d3.brushSelection(d3.select(".brush").node()) || [weightYAxis,weightYAxis]));
}