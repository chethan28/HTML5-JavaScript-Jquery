window.onload = init;
var url = "ws://localhost:8181/broadcast";
var socket;

// Randomly assign the user id
var lat =((Math.random()))/100;
var lng = ((Math.random()))/100;


// register the event handlers for buttons

function init() {
    
    document.getElementById("lat").value=lat;
    document.getElementById("lng").value=lng;
    
    var connectButton = document.getElementById("connectButton");
    connectButton.onclick = connectToServer;

    //var disconnectButton = document.getElementById("disconnectButton");
    //disconnectButton.onclick = disconnectFromServer;

}

function connectToServer() {
    // create the WebSocket object
    socket = new WebSocket(url);
   
    // event handlers for the WebSocket
    socket.onopen = setInterval(sendToServer, 3000);
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
    if (socket)
    {
          document.getElementById("lat").value=lat;
          document.getElementById("lng").value=lng;
        //log("Sending:" + lat + " , " + lng);
        var data = JSON.stringify({latitude: lat, longitude : lng});
        socket.send(data);
        document.getElementById("connectButton").disabled = true;
    }
    else
    {
        log("Not Connected");    
    }

    lat =((Math.random()))/100;
    lng = ((Math.random()))/100;
    document.getElementById("lat").value=lat;
    document.getElementById("lng").value=lng;

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
    log("Received:" + data.latitude + 
        " , " + data.longitude);
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









