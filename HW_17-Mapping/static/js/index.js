let map = L.map("map", {
    center: [40.66, -73.82],
    zoom: 10
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",{
    attribution: "Stolen from mapbox",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(map);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson" 

d3.json(link).then((data)=>{
    L.geoJSON(data).addTo(map);
})