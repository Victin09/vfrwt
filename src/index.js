import L from 'leaflet';
import Papa from 'papaparse';

import 'leaflet/dist/leaflet.css';
import './index.css';

const baseMaps = {
    'Mapa': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    'Topográfico': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }),
    'Carreteras': L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
};

const map = L.map('map', {
    center: [38.380422, -3.982544],
    zoom: 8,
    layers: [baseMaps.Mapa]
});

const smallAirportLayer = L.layerGroup().addTo(map);
const overlayMaps = {
    "Aeropuertos": smallAirportLayer
};
// Add layer control to map
L.control.layers(baseMaps, overlayMaps).addTo(map)
L.control.scale({ maxWidth: 150 }).addTo(map);

function doStuff(data) {
    // var airports = [];
    var smallAirportIcon = L.icon({
        iconUrl: 'img/small-airport-marker.png',
        iconSize: [26, 33],
        iconAnchor: [16, 37],
        popupAnchor: [0, -28]
    });
    // smallAirportLayer.remove();
    for (let index = 0; index < data.length; index++) {
        console.log("airport", data[index][1]);
        console.log("lat", Number(lat));
        console.log("marker", Number(data[index][4]));
        console.log("lng", Number(lng));
        console.log("marker", Number(data[index][5]));
        console.log("-----------");
        
        if ((Number(lat) >= Number(data[index][4])) && (Number(lng) >= Number(data[index][5])) && data[index][2] === 'small_airport') {
            // const airport = {
            //     "type": "Feature",
            //     "properties": {
            //         "name": data[index][3],
            //         "type": data[index][2]
            //     },
            //     "geometry": {
            //         "type": "Point",
            //         "coordinates": [data[index][5], data[index][4]]
            //     }
            // }
            // airports.push(airport)
            const marker = L.marker([data[index][4], data[index][5]], { icon: smallAirportIcon }).bindPopup(data[index][1] + ' - ' + data[index][3])
            
            // const marker = new L.marker([data[index][5], data[index][4]], { icon: myIcon })
            // map.addLayer(marker)
            smallAirportLayer.addLayer(marker);
        }
        // layerGroup.addTo(map)
    }
    // console.log('airports', airports.length);
}

function parseData(url, callBack) {
    Papa.parse(url, {
        download: true,
        dynamicTyping: true,
        complete: function (results) {
            callBack(results.data);
            // airports = results.data
        }
    });
}

// map.on('moveend', () => checkData())

map.on('dragend', () => checkData());
map.on('zoomend', () => checkData());
map.on('load', () => checkData());

var lat
var lng
const checkData = () => {
    const width = map.getBounds().getEast() - map.getBounds().getWest();
    const height = map.getBounds().getNorth() - map.getBounds().getSouth();

    // lat = map.getCenter().lat
    lat = map.getBounds().toBBoxString().split(',')[1]
    lng = map.getBounds().toBBoxString().split(',')[0]

    // console.log(
    //     `center:${map.getCenter()}\n` +
    //     `bounds:${map.getBounds().toBBoxString().split(',')[1] + map.getBounds().toBBoxString().split(',')[0]}\n` +
    //     `width:${width}\n` +
    //     `height:${height}\n` +
    //     `size in pixels:${map.getSize()}` +
    //     `zoom:${map.getZoom()}`
    // )
    smallAirportLayer.clearLayers()
    getVisibleTilesCoords()
    parseData("./csv/airports_spain.csv", doStuff);
}

// get bounds, zoom and tileSize        
   function getVisibleTilesCoords()
    {
      
      // get bounds, zoom and tileSize        
      var bounds = map.getPixelBounds();
      var zoom = map.getZoom();
      var tileSize = 256;
      var tileCoordsContainer = [];


      // get NorthWest and SouthEast points
      var nwTilePoint = new L.Point(Math.floor(bounds.min.x / tileSize),
          Math.floor(bounds.min.y / tileSize));

      var seTilePoint = new L.Point(Math.floor(bounds.max.x / tileSize),
          Math.floor(bounds.max.y / tileSize));

      // get max number of tiles in this zoom level
      var max = map.options.crs.scale(zoom) / tileSize; 

      // enumerate visible tiles 
      for (var x = nwTilePoint.x; x <= seTilePoint.x; x++) 
      {
         for (var y = nwTilePoint.y; y <= seTilePoint.y; y++) 
         {

            var xTile = Math.abs(x % max);
            var yTile = Math.abs(y % max);
            
            tileCoordsContainer.push({ 'x':xTile, 'y':yTile });

            console.log('tile ' + xTile + ' ' + yTile);
          }
      }
      console.log("coords", tileCoordsContainer);
      
      return tileCoordsContainer;
      
    };