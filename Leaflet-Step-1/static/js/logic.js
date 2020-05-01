var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
var plateLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
var myMap;

d3.json(plateLink, function(data){
    console.log(data)
    plates = L.geoJSON(data, {
        style: function(feature){
            return {
                color: "orange",
                fillColor: "white",
                fillOpacity: 0
            }
        },
        onEachFeature: function(feature, layer){
            console.log(feature.geometry.coordinates)
            layer.bindPopup("Plate NameL " + feature.properties.Name)
        }
    })
})


d3.json(link, function(data){
    
    console.log(data);

    function createCircleMarker(feature, latlng){
        let options = {
            radius: feature.properties.mag*4,
            fillColor: chooseColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
        }
        return L.circleMarker(latlng, options);
    }

    var earthQuakes = L.geoJSON(data, {
        onEachFeature: function(feature, layer){
            layer.bindPopup("Place:" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag + "<br> Time: " + new Date(feature.properties.time));
        },
        pointToLayer: createCircleMarker
    });

    createMap(plates, earthQuakes)

})




function createMap(plates, earthQuakes) {

    var outdoors  = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
    });

    // Defining a baseMaps object to hold the base layers
    var baseMaps = {
        "Outdoors": outdoors
    }

    // Creating my map
    var myMap = L.map("map", {
        center: [45.52, -122.67],
        zoom: 5,
        layers: [outdoors]
    })

    var overlayMaps = {
        "Fault Lines": plates,
        Earthquakes: earthQuakes
    }

    // Adding layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = function(){
        var div = L.DomUtill.create("div","legend");
        return div;
    }

    info.addTo(myMap);

    document.querySelector(".legent").innerHTML=displayLegend();


  


}

function chooseColor(mag){
    switch(true){
        case (mag<1):
            return "chartreuse";
        case (mag<2):
            return "greenyellow";
        case (mag<3):
            return "gold";
        case (mag<4):
            return "DarkOrange"
        case (mag<5):
            return "Peru";
        default:
            return "red";
    };
}

function displayLegend(){
    var legendInfo = [{
        limits: "Mag: 0-1",
        color: "chartreuse"
    }

]
}