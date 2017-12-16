/*global L
global d3
global GENRES
Js Scirpt for Data visualisation Projet : Evolution of Rock Music
Autor : Benjamin Girard / Paul Feng / Olga Popovych

*/

var map = new L.Map("maps", {minZoom:1.7,/*maxBounds:[
    [-180, 0],
    [180, 180]
],*/ attributionControl: false , center: [ 46.519962, 6.633597], zoom: 2}).addLayer(new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));
build_icone();
//http://leaflet-extras.github.io/leaflet-providers/preview/
/*fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
  .then(function(response) { return response.json(); })
  .then(function(data) {L.geoJSON(data).addTo(map)});*/

var ArtistCluster = new PruneClusterForLeaflet(250,150);
ArtistCluster.BuildLeafletClusterIcon = function(cluster) {
            var e = new L.Icon.MarkerCluster();

            e.stats = cluster.stats;
            e.population = cluster.population;
            return e;
};

map.addLayer(ArtistCluster);


//var ArtistCluster =  L.featureGroup() ;



function build_icone()
{
    ICONES = [];
    for(let icon_name of ICONE_NAMES)
    {

         var Icon = new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/GandalfAtEpfl/DataViz/master/icons/'+ icon_name +'.png',
            // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [41, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              //shadowSize: [41, 41]
        })

    ICONES.push(Icon)
    }

}

function build_marker()
{

    // at start slecto to show return all song that we want studie
    for(var element of SelectToShow())
    {

            let index_genre = GENRES.indexOf(element[6][0]);
            var color =  COLOR[index_genre];
<<<<<<< HEAD
    
            element["marker"] = new PruneCluster.Marker(element[1]+Math.random()/25.0, element[2]+Math.random()/25.0);//,{color:color}) // L.marker( [element[1], element[2]] , {icon: greenIcon});
    
    
=======

            element["marker"] = new PruneCluster.Marker(element[1]+Math.random()/10.0, element[2]+Math.random()/10.0);//,{color:color}) // L.marker( [element[1], element[2]] , {icon: greenIcon});


>>>>>>> 2a1ae20b047f7b81a0a60f13d71073253b9e9f14
            element["marker"].data.icon = ICONES[index_genre];  // See http://leafletjs.com/reference.html#icon
            element["marker"].data.popup = 'Year : '+element[0]+'<br/>Artist Name: '+element[4]+' <br/> Tittle: '+element[7]+'<br/> GENRE : '+element[6][0]+' <br/> hotness : '+element[3]+'/'+element[8];

            element["marker"].category = index_genre ;
            element["marker"].weight = 4;
            ArtistCluster.RegisterMarker(element["marker"]);

            //console.log("MARKER  :"+[element[1], element[2]])
            /*let angle = 0///360.0*Math.random()
            element["marker"] = L.circle([element[1]+Math.cos(angle)/20, element[2]+Math.sin(angle)/20], {radius: 200,color:color,fillColor:color,fill:true,fillOpacity: 1.0})
            element["marker"].bindPopup('Year : '+element[0]+'<br/>Artist Name: '+element[4]+' <br/> Tittle: '+element[7]+'<br/> GENRE : '+element[6][0]+' <br/> hotness : '+element[3]+'/'+element[8])
            element["marker"].addTo(ArtistCluster);*/

    }


}
function updatemap()
{

    var t = timer("SELECT");
    var data = SelectToShow();

    //ArtistCluster.remove();
    //ArtistCluster = L.featureGroup()
    for(var element of DATA.data)
    {
        if(element['marker'] != undefined )
        {
            element['marker'].filtered = true;
        }
       // element['marker'].opacity  = 0 ;

    }


    for(var element of data)
    {

    //console.log("add"  + element['marker'] )
        //Artist.addLayer( element['marker'] );
        element['marker'].filtered = false;
        //console.log("MARKER  :"+[element[1], element[2]])

         //element["marker"].addTo(ArtistCluster);
        //element['marker'].opacity  = 1 ;
         //element['marker'].redraw()
    }
    ArtistCluster.ProcessView();
    //Artist.addTo(map);

    //ArtistCluster.addTo(map)
    t.stop()
}


var colors = COLOR; // ['#ff4b00', '#bac900', '#EC1813', '#55BCBE', '#D2204C', '#FF0000', '#ada59a', '#3e647e'],
        pi2 = Math.PI * 2;

    L.Icon.MarkerCluster = L.Icon.extend({
        options: {
           // iconSize: new L.Point(150, 100),
            className: 'prunecluster leaflet-markercluster-icon'
        },

        createIcon: function () {
              var maxr = 0;
              var nbr = 0;
              const r = 30/10;
              const minr = 10;
              for (var i = 0; i <  colors.length; ++i) {

                  if(this.stats[i]>0)
                    nbr+=1;
                  let percent = Math.log(this.stats[i])*r;
                  if(percent>maxr)
                    maxr=percent;
              }

              maxr = Math.max(minr,maxr);

            let sx=0;
            let sy=1;
            while(sx*sy<nbr)
            {
                if(sy+1<=sx)
                sy+=1;
                else
                sx+=1;

            }
                          console.log(maxr,sx,sy)
            this.options.iconSize = new L.Point(maxr*(2*sx)+maxr, maxr*(2*sy)+maxr);


            var e = document.createElement('canvas');
            this._setIconStyles(e, 'icon');
            var s = this.options.iconSize;
            e.width = s.x;
            e.height = s.y;
            this.draw(e.getContext('2d'), s.x, s.y,maxr,sx,sy);
            return e;
        },

        createShadow: function () {
            return null;
        },

        draw: function(canvas, width, height,maxr,sx,sy) {

                              const r = 30/10;

            var start = 0;
            for (var i = 0,j=0; i <  colors.length; ++i) {
                // for each genre:
                if(this.stats[i]==0)//if not null
                    continue;

                var percent = Math.log(this.stats[i])*r;
                percent = Math.max(10,percent);
                var x =  j%sx*2*maxr+maxr+5;
                var y =  Math.floor(j/sx)*2*maxr+maxr+5;
                    /*canvas.beginPath();
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
                    canvas.closePath();/*/

                    canvas.beginPath();
                    canvas.fillStyle = COLOR[i];
                    canvas.arc(x, y, percent, 0, Math.PI*2);
                    canvas.fill();
                    canvas.closePath();

                    canvas.fillStyle = '#555';
                    canvas.textAlign = 'center';
                    canvas.textBaseline = 'middle';
                    canvas.font = 'bold 12px sans-serif';

                    canvas.fillText(this.stats[i], x, y, 2*maxr-5);
                    j+=1;
            }


        }
    });
