// Map components and initialization for use on web page
$(document).ready(function() {

    // Mapbox variables
    var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
    var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'; // Attribution for copyright/fair-use


    // Layers
    var light = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr});

    // Map initialization
    var map = L.map('mainMap', {
        center: [37.2, -105.5],
        zoom: 6.5,
        maxZoom: 9,
        fullscreenControl: true,
        layers: [light],
        tap: false
    });

    map.dragging.disable();
    map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();
	map.boxZoom.disable();
	map.keyboard.disable();
	map.removeControl(map.zoomControl);
	map.removeControl(map.fullscreenControl);

    var width = document.documentElement.clientWidth;
    // tablets are between 768 and 922 pixels wide
    // phones are less than 768 pixels wide
    if (width < 550) {
        // set the zoom level to 10
        //map.setZoom(6);
        map.setView([35.2, -105.5], 6)
    }

    // listen for screen resize events
    window.addEventListener('resize', function(event){
        // get the width of the screen after the resize event
        var width = document.documentElement.clientWidth;
        // tablets are between 768 and 922 pixels wide
        // phones are less than 768 pixels wide
        if (width < 768) {
            // set the zoom level to 10
            //map.setZoom(6);
            map.setView([35.2, -105.5], 6)
        }  else {
            // set the zoom level to 8
            //map.setZoom(6.5);
            map.setView([37.2, -105.5], 6.5)
        }
    }); 

    // Declaration of global variables for functions below
    var geojson;

     // Color states/counties differently if needed (based on property called "section" in statesData)
    function getColor(sec) {
        return sec == 1 ? '#00396a' :
        sec == 2  ? '#000000' :
        sec == 3  ? '#572642' :
        sec == 4  ? '#ce7019' :
        sec == 5  ? '#b30838' :
        'transparent';
    }


    // Add style properties to layer elements
    function style(feature) {
        return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.section)
        };
    }


    // Add definition and border highlight to layer selected
    function highlightFeature(e) {
        var layer = e.target;

        if(layer.feature.properties.section != 2){
            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }

            //var latlng = L.latLng(layer.feature.properties.center);
            var latlng = L.latLng([36.578, -102.16]);
            
                    var popup = L.popup()
                    .setLatLng(latlng)
                    .setContent('<span><strong>' + layer.feature.properties.name + '</strong><br/>'+ layer.feature.properties.counselor +'</span>')
                    .openOn(map);
        }
    }


    // Reset highlight
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        map.closePopup();
    }

    // Reset highlight for county Baca
    function resetHighlightOther(e) {
        geojson.resetStyle(e.target);
    }


    // Highlight and zoom to state
    function linkToFeature(e) {
        var layer = e.target;
        if(layer.feature.properties.section != 2){
            //opens a link in the same window
            //window.location = "https://www.csupueblo.edu/profile/" + layer.feature.properties.url;

            //opens a window in a new tab
            window.open("https://www.csupueblo.edu/profile/" + layer.feature.properties.url);
        }
    }


    // Bring all the functions together
    function onEachFeature(feature, layer) {
        layer.on({
            // function called when pointer hovers on a state(layer)
            mouseover: highlightFeature,
            // function called when pointer leaves a state(layer)
            // checks if the county is Baca and turns off the auto close feature
            mouseout: ((layer.feature.properties.name != "Baca") ? resetHighlight : resetHighlightOther),
            // function called when pointer clicks a state(layer)
            click: linkToFeature
        });
    }


    // Add all the states/counties to the map
    geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

});


// Return to the map using the button in the info div
function returnToMap() {
    $('html,body').animate({
        scrollTop: $("#mainMap").offset().top
    });
}
