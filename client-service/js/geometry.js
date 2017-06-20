// Get One time location
// Usage: getCurrentLocation(err,data) => data = {lat:...,lng:...}
function getCurrentLocation(callback){
    // One time see location !
    if(navigator.geolocation){
        var startPos;
        var geoSuccess = function(position){
            startPos = position;
            // alert("You now in (" + startPos.coords.latitude + "," + startPos.coords.longitude + ")");
            var pos = {
                lat: startPos.coords.latitude,
                lng: startPos.coords.longitude
            }
            callback(0,pos);
        };
        navigator.geolocation.getCurrentPosition(geoSuccess);
    }else {
        callback(1,"Current browser doesn't support navigator!");
    }
}

// Location to address 
// Usage: pos2address(pos_data,callback) => pos_data = {lat:...,lng:...} , callback(err,msg_data) => if success , return address
function pos2address(pos_data,callback){
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': pos_data},function(results,status){
        if(status === 'OK'){
            if(results[1]){
                console.log("Get converted address: " + results[1].formatted_address);
                callback(0,results[1].formatted_address);
            }
            else{
                callback(1,"Not results found");
            }
        } 
        else{
            callback(1,"Geocoder failed due to: " + status);
        }
    });
}

// Address to location
// Usage: address2pos (address_data,callback) => address_data = "..." (String) , callback(err,msg_data) => if success , return pos_data
function address2pos(address_data,callback){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address_data},function(results,status){
        if(status === 'OK'){
            console.log("Get converted location: " + results[0].geometry.location);
            callback(0,results[0].geometry.location);
        }else{
            callback(1,"Geocode was not successful for the following reason: " + status);
        }
    });
}

// Get distance and time (2 point)
function getDistTime(pos1,pos2,callback){
    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
        origins: [pos1],
        destinations: [pos2],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    },function(response,status){
        if(status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS" ){
            // Get result 
            callback(0,{
                distance: response.rows[0].elements[0].distance.text,
                duration: response.rows[0].elements[0].duration.text
            });
        }else{
            // error
            callback(1,"Unable to find the distance via road.");
        }
    });
}