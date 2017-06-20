var destination;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

google.maps.event.addDomListener(window, 'load', function() {
    new google.maps.places.SearchBox(document.getElementById('txtDestination'));
    directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': true });
});

function getRoute() {
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('passenger-direction'));

    // Direction and route
    destination = document.getElementById('txtDestination').value;

    var request = {
        origin: src, // get booking src
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(res, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(res);
        }
    });

    // Distance and duration
    var service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
        origins: [src], // get booking src
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function(res, status) {
        if (status == google.maps.DistanceMatrixStatus.OK && res.rows[0].elements[0].status != 'ZERO_RESULTS') {
            var distance = res.rows[0].elements[0].distance.text;
            var duration = res.rows[0].elements[0].duration.text;
            var dvDistance = document.getElementById("passenger-distance");

            /* return miles and arrival time */
            /*dvDistance.innerHTML = '';
            dvDistance.innerHTML += 'total Distance: ' + distance + "<br />";
            dvDistance.innerHTML += "total Time:" + duration;*/
        } else {
            alert('Unable to find the distance via road.');
        }
    });
}