var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map", {
    zoom: 6,
    center: [36.7783, -119.4179]
})

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

function markerSize(mag) {
    return mag * 8000
}

function markerColor(mag) {
    switch(true){
        case(mag > 5):
            return "red"
        case(mag > 4):
            return "lightsalmon"
        case(mag > 3):
            return "orange"
        case(mag > 2):
            return "gold"
        case(mag >1):
            return "limegreen"
        case(mag > 0):
            return "green"
    }
}

d3.json(link, function(data) {

    var features = data.features;
    console.log(features)
    
    features.forEach(function(feature){
        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: markerSize(feature.properties.mag),
            color: "black",
            fillColor: markerColor(feature.properties.mag),
            fillOpacity: 0.9,
            stroke: true,
            weight: 0.25
        })
        .bindPopup(`Place: ${feature.properties.place}
        <hr>Magnitude: ${feature.properties.mag}
        <hr>Time: ${new Date(feature.properties.time)}`)
        .addTo(myMap)
    })

    var legend = L.control({position: "bottomright"});

    legend.onAdd = function (myMmap) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];
        
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' + 
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    
    legend.addTo(myMap);  
})



