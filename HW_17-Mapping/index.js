const API_KEY = "pk.eyJ1IjoiZG1vcmVubzI3IiwiYSI6ImNqd2lmZ2hlejBnbXU0NG14ZWc3ODA1dXcifQ.pTTC2bURE7ZJpsGi-ZSJTQ";

let map = L.map("map", {
    center:  [37.7749, 122.4194],
    zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",{
    attribution: "Map from mapbox",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(map);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"; 

d3.json(link).then((data)=>{
    L.geoJSON(data).addTo(map);
});