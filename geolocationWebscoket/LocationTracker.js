window.onload=init;

var latitude;
var longitude; 

var map=null;
var url = "ws://localhost:8181/broadcast";
var socket;

var path=[];

var lastMarker=null;
 var latlong=null;
 var counter = 0;


// register the event handlers for buttons
function init()
{
	

    getLocation();

	var connectButton = document.getElementById("connectButton");
    connectButton.onclick = connectToServer;

    var disconnectButton = document.getElementById("disconnectButton");
    disconnectButton.onclick = disconnectFromServer;

}

//call the geolocation API 
function getLocation()
{

	var options={
		enableHighAcuuracy : true,
		timeout : 50000 ,
		maximumAge : 0
	};


	navigator.geolocation.getCurrentPosition(
        displayLocation, handleError, options);

}




//display the map pn the browser
function displayLocation(position) {

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    
    var accuracy = position.coords.accuracy;
    var timestamp = position.timestamp;

    document.getElementById("latitude").innerHTML = 
            "Latitude: " + latitude;
    document.getElementById("longitude").innerHTML = 
            "Longitude: " + longitude;
    document.getElementById("counter").innerHTML=
            "Update#: " + counter;       
 
              
    // Show the google map with the position  
    showOnMap(position.coords);
}


//event handlers for errors
function handleError(error) {
    switch(error.code) {
        case 1:
            updateStatus("The user denied permission");
            break;
        case 2:
            updateStatus("Position is unavailable");
            break;
        case 3:
            updateStatus("Timed out");
            break;
    }
}


//to display error
function updateStatus(message) {
    document.getElementById("status").innerHTML = 
        "<strong>Error</strong>: " + message;
}



// initialize the map and show the position
function showOnMap(pos) {
    
    var googlePosition = 
        new google.maps.LatLng(pos.latitude, pos.longitude);
    
    var mapOptions = {
        zoom: 15,
        center: googlePosition,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var mapElement = document.getElementById("map");
    map = new google.maps.Map(mapElement, mapOptions);
    
    // add the marker to the map
    var title = "Location Details";
    var content = "Lat: " + pos.latitude + 
                    ", Long: " + pos.longitude;
                    
    addMarker(map, googlePosition, title, content);
}


// add position marker to the map
function addMarker(map, latlongPosition, title, content) {
   
    var options = {
        position: latlongPosition,
        map: map,
        title: title,
        clickable: true
    };
    var marker = new google.maps.Marker(options);

    var popupWindowOptions = {
        content: content,
        position: latlongPosition
    };

    var popupWindow = new google.maps.InfoWindow(popupWindowOptions);

    google.maps.event.addListener(marker, 'click', function() {
        popupWindow.open(map);
    });
    
    return marker;
}



//Drwing the path
function showSamplePath()
{
    
  
  // first point  
    var latlong = new google.maps.LatLng(latitude, longitude);
    path.push(latlong);
  
   
    
  // next point
    latlong = new google.maps.LatLng(latitude, longitude);
    path.push(latlong);
  
  
    var line = new google.maps.Polyline({
        path : path,
        strokeColor : '#0000ff',
        strokeOpacity : 1.0,
        strokeWeight : 3
    });
    line.setMap(map);

    map.panTo(latlong);

    if (lastMarker)
        lastMarker.setMap(null);
    // add the new marker
    lastMarker = addMarker(map, latlong, "Your new location", "You moved to: " + latitude + ", " + longitude);
}





//call the server to send the lat lng 
function connectToServer() {
    // create the WebSocket object
    socket = new WebSocket(url);
   
    // event handlers for the WebSocket
    socket.onopen = setInterval(sendToServer, 5000);
    socket.onclose = handleCloseConnection;
    socket.onerror = handleError;
    socket.onmessage = handleMessage;
}

function disconnectFromServer() {
    // close the WebSocket
    socket.close();
}

// sending a message to the WebSocket server
function sendToServer() {

    
     counter=counter+1; 
    if (socket)
    {   getLocation();
        document.getElementById("latitude").value=latitude;
        document.getElementById("longitude").value=longitude;
        //log("Sending:" + latitude + " , " + longitude+","+counter);
        var data = JSON.stringify({latitude: latitude, longitude : longitude, counter:counter});
        socket.send(data);
    }
    else
    {
        log("Not Connected");    
    }

}

// WebSocket event handlers
function handleOpenConnection(event) {
    log("Open");
}
// WebSocket event handlers
function handleCloseConnection(event) {
    log("Close");
    socket = null;
}
// WebSocket event handlers
function handleMessage(event) {
    var data = JSON.parse(event.data);
    //log("Received:" + data.latitude + " , " + data.longitude+","+counter);
    document.getElementById("Rlatitude").innerHTML="Current latitude"+data.latitude;
    document.getElementById("Rlongitude").innerHTML="Current longitude"+data.longitude;
    document.getElementById("counter").innerHTML="Update#:"+ data.counter;

   
    latitude += Math.random() / 100;
    longitude -= Math.random() / 100;

   

    showSamplePath();
   
}


// WebSocket event handlers
function handleError(event) {
    log("Error:" + event.data);
}

// log messages in the HTML document
function log(message) {
    var pre = document.createElement("p");
    pre.innerHTML = message;
    var status = document.getElementById("status");
    status.appendChild(pre);
}

