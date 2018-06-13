// Map components and initialization for use on web page
$(document).ready(function() {

    // Mapbox variables
    var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
    var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'; // Attribution for copyright/fair-use


    // Layers
    var light = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr});


    // Map initialization
    var map = L.map('mainMap', {
        center: [40, -125],
        zoom: 4,
        maxZoom: 7,
        fullscreenControl: true,
        layers: [light]
    });


    // Declaration of global variables for functions below
    var geojson;


    // Show counselor info when state or county is clicked
    function infoUpdate(props) {
        // Change html elements here for styling
        document.getElementById('info').innerHTML = (props ? '<div class=\'row\'><div class=\'col-xs-12 col-sm-6 col-md-6 col-lg-6\'><div class=\'counselorText\'>' +
        '<h2><em><strong>' + props.name + '</em></strong></h2><h3><i class="fa fa-user" aria-hidden="true"></i> ' + props.counselor +
        '<br></h3><p><i class="fa fa-envelope" aria-hidden="true"></i> <a href="mailto:' + props.email + '">' + props.email + '</a><br></p><p><i class="fa fa-phone-square" aria-hidden="true"></i> <a href="tel:1-' + props.phone + '">' + props.phone +
        '</a></p><p>' + props.quote + '</p></div></div><div class=\'col-xs-12 col-sm-6 col-md-6 col-lg-6\'><img class=\'counselorImg\' src=' + props.imageUrl +
        ' alt="' + props.counselor + '"></div></div><br><div class=\'returnBtn\'><button class=\'btn btn-lg btn-primary center-block\' onclick=\'returnToMap()\'>Return to Map</button></div>':
        'Click on a State or Colorado county to see who your counselor is');
        $('html,body').animate({
            scrollTop: $("#info").offset().top
        });
    };


    // Color states/counties differently if needed (based on property called "section" in statesData)
    function getColor(sec) {
        return sec == 1 ? '#00396a' :
        sec == 2  ? '#58595b' :
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

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }


    // Reset highlight
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }


    // Highlight and zoom to state
    function zoomToFeature(e) {
        var layer = e.target;

        // Check if layer is a Colorado county: if it is, keep the zoom level and bounds on Colorado instead of zooming into the county
        if (layer.feature.id.indexOf("CO") >= 0) {
            map.fitBounds([[41.02964, -109.06128], [36.99378, -102.04102]]);
        }
        else {
            map.fitBounds(e.target.getBounds());
        }

        infoUpdate(layer.feature.properties);
    }


    // Bring all the functions together
    function onEachFeature(feature, layer) {
        layer.on({
            // function called when pointer hovers on a state(layer)
            mouseover: highlightFeature,
            // function called when pointer leaves a state(layer)
            mouseout: resetHighlight,
            // function called when pointer clicks a state(layer)
            click: zoomToFeature
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
