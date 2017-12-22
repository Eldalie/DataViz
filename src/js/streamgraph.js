/*global L
global d3

Js Scirpt for Data visualisation Projet : Evolution of Rock Music
Autor : Benjamin Girard / Paul Feng / Olga Popovych

This file contain all materail to draw the stream graph


*/
// STREAM GRAPH Variable
// Array contenaing the number of sont by year and genre
var year = undefined;

//D3 stack
var stack = d3.stack(),
    layers = undefined;

//size of the X and Y axis
var heightXAxis = 45;
var weightYAxis = 5;

//size of the SVG at start up
var width = $("body").width()-40;
var height = $("body").height()*0.25;


//Build the svg
var svg = d3.select('#streamgraphSVG')
         .append("svg").attr('class', 'svgstream').attr("width", width)
          .attr("height", height);


//The axis and scale
var xScale = d3.scaleLinear().domain([FIRSTYEAR, LASTYEAR ]);
var yScale = d3.scaleLinear();
var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks((LASTYEAR-FIRSTYEAR)/1.0);
var yAxis = d3.axisLeft(yScale);


svg.append('g').classed('x axis', true);
svg.append('g').classed('y axis', true);

//Area to draw the stream graph
var area = d3.area()
    .x(function(d, i) { return xScale(i+FIRSTYEAR); })
    .y0(function(d) { return yScale(d[0]); })
    .y1(function(d) { return yScale(d[1]); });

//the brush on the timeline
var brush = d3.brushX()
    .on("brush end", brushed);


//Select the tooltip to show number of song by year/genre on the stremgraph 
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

    // if user do not a have selection : jsute  click on the streamgraph 
    if( d3.event.selection == null /*|| d3.event.sourceEvent.type=="mouseup"*/) // if no sleection select only one year
    {
        // we only slect one year
        var dest = xScale.invert(d3.event.sourceEvent.layerX-weightYAxis);
        YEARSTART = Math.floor(dest);
        YEAREND = Math.floor(dest);
    }
    else
    {
        // if we have a selection we roud to the nearrest years
        var s = d3.event.selection;
        s[0] -=  weightYAxis;
        s[1] -=  weightYAxis;
        s = s.map(xScale.invert);
    
      YEARSTART = Math.round(s[0]);
      YEAREND = Math.round(s[1]);
    }

  // In case of bad selection
  if(YEAREND-YEARSTART<1)
  YEAREND =YEARSTART+1;


//finlay we update the map to the slection
  
  updatemap();


  // We only force the brush to take rouded value if user quit the brush slection
  if(d3.event.type != "end") return;
  d3.select(this).transition().call(d3.event.target.move, [weightYAxis+xScale(YEARSTART),weightYAxis+xScale(YEAREND) ] );


}

function stackMax(layer) {
  return d3.max(layer, function(d) { return d[1]; });
}

function stackMin(layer) {
  return d3.min(layer, function(d) { return d[0]; });
}

//her we fill the sream graph we the data
function fill_stream()
{
    var data = DATA;
    var n  = SELECTEDGENRE.length;
    year =  new Array(LASTYEAR-FIRSTYEAR);
    // first we built the year data with seleted data

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
            
      // Also fill the array with 0 if not set        
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
     //build the D3 stack 
    stack = d3.stack();
    stack.keys(d3.range(SELECTEDGENRE.length)).offset(d3.stackOffsetWiggle);
    layers = stack(year);
    yScale.domain([d3.min(layers, stackMin), d3.max(layers, stackMax)]);
}


//update the strem graph when the size of the svg must bu update: ie the windows is resize by example
function updatestream()
{
    //also refrech the map: it cas be useful to avoi glitch
    map.invalidateSize();

    //console.log("update");

    //calculate the new size
    width = $("#streamgraphSVG").width()-40;
    height =$("#streamgraph").height()-1;
    //console.log(width,height)

    //and the new scale
     xScale.range([0, width-weightYAxis]);
     yScale.range([height-heightXAxis, 0]);

     //xAxis.scale(xScale)
     //yAxis.scale(yScale);


    svg.attr("width", width).attr("height", height);

    // add or remove data if user have change the selection
    var paths = svg.select(".stream").selectAll(".chemin")
               .data(layers);
    paths.exit().remove();
    var enter = paths.enter().append("path").attr("transform", "translate(" + weightYAxis + "," + 0 + ")").attr('class', 'chemin')  ;
    enter.merge(paths).attr("d", area).attr("fill", function(d,i) { return COLOR[GENRES.indexOf(SELECTEDGENRE[i])] ; });


    //Mouse event when the user enter the mouse on one line on the stremgraph
    function MouseEvent(d,i)
    {
        //Add brithness
        d3.select('#streamgraph').select(".stream").selectAll(".chemin").transition()
                .duration(250)
                .attr("stroke", function(d, j) {
                    return j != i ? "none" : COLOR[GENRES.indexOf(SELECTEDGENRE[i])];
                })
                .attr("stroke-width", 2)
            
            //console.log();
            //calculte what yer the mouse is
            let anner = Math.floor(xScale.invert(d3.event.clientX));
            //Add the texte to the toolip
            tooltip.html(SELECTEDGENRE[i]+"<br/>"+year[anner-FIRSTYEAR][i]+" songs in the year "+anner);
            
            
            let clip = function(a,b,c){return Math.max(a,Math.min(b,c)) ;} //console.log(d3.event)
            
            // color the tooltip to the color of genre and place it under the cursor 
            tooltip.style("color",(COLOR[GENRES.indexOf(SELECTEDGENRE[i])] ))
                .style("left",  clip(0+15,d3.event.clientX,width -85) + "px")		
                .style("top", (d3.event.clientY+5) + "px");	
        
    }


    //lisiten to event
    svg.select(".stream").selectAll(".chemin")
        .attr("opacity", 0.95)
        .classed('selected', true)
                .on("mouseover", MouseEvent     )
        .on("mousemove", MouseEvent
            )
        .on("mouseout", function() {
            // uncolor graph on mouseout and hide the tooltip
            d3.select('#streamgraph').select(".stream").selectAll(".chemin").attr('stroke', 'none')
            tooltip.style("left", "-10%")		
                .style("top", "-10%");
        })
        
    
    //update axis
    svg.select('.x.axis').call(xAxis);
    svg.select('.y.axis').call(yAxis).selectAll("text").remove();
    
    // rotate label of year to print years by years 
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