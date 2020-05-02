var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var plateLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
var plates;

d3.json(plateLink, function(plateData) {
    plates = L.geoJSON(plateData, {
            style: function(feature) {
                return {
                    color: "orange",
                    fillColor: "white",
                    fillOpacity: 0
                }
            },
            onEachFeature: function(feature, layer){
                layer.bindPopup(`Plate Name: ${feature.properties.Name}`)
            }
        })

        d3.json(link, function(earthQuakeData) {

            function createCircleMarker(feature, latlng){
               let options = {
                    radius: markerSize(feature.properties.mag),
                    color: "black",
                    fillColor: chooseColor(feature.properties.mag),
                    fillOpacity: 0.9,
                    stroke: true,
                    weight: 0.8
                }
                return L.circleMarker(latlng, options)
            }
        
            // Define a function we want to run once for each feature in the features array
            // Give each feature a popup describing the place and time of the earthquake
            function onEachFeature(feature, layer) {
                layer.bindPopup(`Place: ${feature.properties.place}
                <hr>Magnitude: ${feature.properties.mag}
                <hr>Time: ${new Date(feature.properties.time)}`)
            }
        
            // Create a GeoJSON layer containing the features array on earthquakeData object
            // Run the onEachFeature function once for each piece of data in the array
            earthQuakes = L.geoJSON(earthQuakeData, {
                onEachFeature: onEachFeature,
                pointToLayer: createCircleMarker
            })
        createMap(plates, earthQuakes)

        });
})


function createMap(plates, earthQuakes) {
    
    var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
    });

    var light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
    })

    var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/outdoors-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
    })

    // Defining a baseMaps object to hold the base layers
    var baseMaps = {
        "Satellite": satellite,
        "Light": light,
        "Outdoors": outdoors
    }

    var overlayMaps = {
        "Fault Lines": plates,
        "Earthquakes": earthQuakes
    }
    // Creating my map
    var myMap = L.map("map", {
        center: [45.52, -122.67],
        zoom: 3,
        layers: [satellite, plates, earthQuakes]
    })

    // Adding layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: "bottomright"});

    legend.onAdd = function (myMmap) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];
        
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(grades[i]) + '"></i> ' + 
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    
    legend.addTo(myMap); 
};

function markerSize(mag) {
    return mag * 3
}

function chooseColor(mag) {
    switch(true){
        case(mag >= 5):
            return "red"
        case(mag >= 4 && mag < 5):
            return "lightsalmon"
        case(mag >= 3 && mag < 4):
            return "orange"
        case(mag >= 2 && mag < 3):
            return "gold"
        case(mag >= 1 && mag < 2):
            return "limegreen"
        case(mag >= 0 && mag < 1):
            return "lightgreen"
        default:
            return "blue"
    };
}