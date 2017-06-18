/*var src, dst;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

google.maps.event.addDomListener(window, 'load', function() {
    //new google.maps.places.SearchBox(document.getElementById('txtsrc'));
    //new google.maps.places.SearchBox(document.getElementById('txtdst'));

    directionsDisplay = new google.maps.DirectionsRenderer({
        'draggable': true
    });
});

var mumbai = new google.maps.LatLng(25.040606, 121.536547);
var mapOptions = {
    zoom: 14,
    center: mumbai
};

map = new google.maps.Map(document.getElementById('dvmap'), mapOptions);
directionsDisplay.setMap(map);*/

/*function GetRoute() {
    var mumbai = new google.maps.LatLng(25.040606, 121.536547);
    var mapOptions = {
        zoom: 14,
        center: mumbai
    };

    map = new google.maps.Map(document.getElementByClassName('pass-map'), mapOptions);

    directionsDisplay.setMap(map);
    //directionsDisplay.setPanel(document.getElementByClassName('dvPanel'));

    /* Direction and route */
/*src = document.getElementById("txtsrc").value;
dst = document.getElementById("txtdst").value;

var request = {
    origin: src,
    dst: dst,
    travelMode: google.maps.TravelMode.DRIVING
};

directionsService.route(request, function(res, status) {
    if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(res);
    }
});

/* Distance and duration */
/*var service = new google.maps.DistanceMatrixService();

service.getDistanceMatrix({
    origins: [src],
    dsts: [dst],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
}, function(res, status) {
    if (status == google.maps.DistanceMatrixStatus.OK && res.rows[0].elements[0].status != "ZERO_RESULTS") {
        var distance = res.rows[0].elements[0].distance.text;
        var duration = res.rows[0].elements[0].duration.text;
        var dvDistance = document.getElementById("dvDistance");

        dvDistance.innerHTML = "";
        dvDistance.innerHTML += "total Distance: " + distance + "<br />";
        dvDistance.innerHTML += "total Time:" + duration;
    } else {
        alert("Unable to find the distance via road.");
    }
});
}*/