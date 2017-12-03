const GENRES = ["hip hop","soft rock","folk rock"];//...TODO
var YEARSTART = 0;
var YEAREND = 2900;
var SELECTEDGENRE = GENRES;
var DATA = [];

// DECLARATION ....

//MAP INIT:
var map = new L.Map("maps", {center: [37.8, -96.9], zoom: 4}).addLayer(new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));
var Artist =  L.layerGroup();


// GENRE SLECTION:
for(genre of GENRES)
{
    $('#genre').append("<input name=\""+genre+"\" type=\"checkbox\">"+genre+"</input><br/>");
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
        const COLOR = ["green","blue","red","violet"]
        
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
        
        console.log("MARKER  :"+[element[1], element[2]])
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
//MAPS !! 

});
