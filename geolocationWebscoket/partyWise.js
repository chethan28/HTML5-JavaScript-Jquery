window.onload=init;


/*var senator={senators :[
	{"name":"",
	"party":"",
	"voted":""}
]};*/


var senatorslist;
var src, republican,democrat, msg;
var sourceId;


//
function init(){
	
	//load the xml file
	console.log("window.localStorage"+window.localStorage.getItem("senators"));
	if(window.localStorage.getItem("senators")==null){
        loadxml();
    }


     // initialize the JSON array
    senatorslist = new Array();

    src = document.getElementById("members");
    republican = document.getElementById("republicans");
    democrat = document.getElementById("democrats");
    msg = document.getElementById("msg");


    // Add event handlers for the source
    src.ondragstart = dragStartHandler;
    src.ondragend = dragEndHandler;
    src.ondrag = dragHandler;

    //Add event handler for the democrat list 
    democrat.ondragenter = dragEnterHandlerdemocrats;
    democrat.ondragover = dragOverHandlerdemocrats;
    democrat.ondrop = dropHandlerdemocrats;


     // Add event handlers for the republican list
    republican.ondragenter = dragEnterHandlerrepublicans;
    republican.ondragover = dragOverHandlerrepublicans;
    republican.ondrop = dropHandlerrepublicans;

   //call updateDOM and check local storage
	if(window.localStorage.getItem("senators")!=null){
        updateDOMItems();
        var jsonarray=window.localStorage.getItem("senators");
        var count=JSON.parse(jsonarray);
        msg.innerHTML="localStorage loaded "+count.length+" Senators";
   }
    

}


//make the AJAX Asynchronous call
function loadxml(){

   
	var XMLHttpRequestObj=false;
	if(window.XMLHttpRequest){
		XMLHttpRequestObj= new XMLHttpRequest();
		XMLHttpRequestObj.overrideMimeType("text/xml");
	}

	else if( window.ActiveXObject){
		XMLHttpRequestObj =new ActiveXObject("Microscoft.XMLHTTP");
	}

    
   if (XMLHttpRequestObj) {
   
   	XMLHttpRequestObj.open("GET","partyList.xml",true);
    XMLHttpRequestObj.send();
   	XMLHttpRequestObj.onreadystatechange=function(){
            
   		if (XMLHttpRequestObj.readyState ==4  && XMLHttpRequestObj.status == 200) {
            
   			var xmlDocument=XMLHttpRequestObj.responseXML;
   			populateJSON(xmlDocument);
   		}

   	}
   
    
   }


//create JSON object and push that ib local storage
   function populateJSON(xmldoc){
         var jsonSenators=[];
         console.log(xmldoc);
         var elems = xmldoc.getElementsByTagName("senator");
        for (var i = 0; i < elems.length; i++) {
        	
        	var nm=elems[i].getElementsByTagName("name")[0].textContent;
        	var pty=elems[i].getElementsByTagName("party")[0].textContent;
        	var vtd="false";

             // create a new JSON object for each song
                var senator = {
                    "name" : nm,
                    "party" : pty,
                    "voted" : vtd
                };

      
            senatorslist.push(senator);
        	
           }

        window.localStorage.setItem("senators",JSON.stringify(senatorslist));
        updateDOMItems();
        var jsonarray=window.localStorage.getItem("senators");
        var count=JSON.parse(jsonarray);
        msg.innerHTML="AJAX loaded "+count.length;+" Senators";

   }
    
}


//check which party

function whichParty(name){
    var jsonarray=window.localStorage.getItem("senators");
    senators=JSON.parse(jsonarray);
    for(var i=0;i<senators.length;i++)
    {
        if(senators[i].name==name)
        {
            return senators[i].party;
        }
    }


}

//check whether the senator is voted
function isVoted(index,senators){

 return  senators[index].voted; 
}

//check whether the senator is voted
function votetrue(index,jsonarray){
    return jsonarray.senators[i].voted="true";
}


//update the DOM by using the local storage
function updateDOMItems() {
	 console.log("updateDOMItems");
    var democrateList = document.getElementById("democrats");
    var republicanList=document.getElementById("republicans");
    var list=document.getElementById("members");
    list.innerHTML="";
    democrateList.innerHTML="";
    republicans.innerHTML="";
    var jsonarray=window.localStorage.getItem("senators");
   
    senators=JSON.parse(jsonarray);
    
    for (var index = 0; index<senators.length;index++) { 
        var party=senators[index].party;
        var voted=senators[index].voted;
        
        if(voted=="true"){
                if(party=="Democrat"){
              
                    addItemToDemocrateDOM(senators[index].name);
                }
                else{
                
                   addItemToRepublicanDOM(senators[index].name);
                }
        }
        else{
          
           addItemToMainDOM(senators[index].name);
        }

        
    }   
}



//add to the Republicans list
function addItemToRepublicanDOM(name) {
    var list = document.getElementById("republicans");
    // create a line item and add to the end of the list
    var item = document.createElement("li");
    item.innerHTML =name;
  
    list.appendChild(item);

}



//add to the democrates list
function addItemToDemocrateDOM(name) {
    var list = document.getElementById("democrats");
    // create a line item and add to the end of the list
    var item = document.createElement("li");
   // item.appendChild(document.createTextNode(name));
    item.innerHTML = name;
    
    list.appendChild(item);
}



//add to the main unvoted list
function addItemToMainDOM(name){
    var list=document.getElementById("members");
    var item=document.createElement("li");
    item.setAttribute('id',name);
    item.setAttribute('draggable',"true");
    item.innerHTML = name;
   
    list.appendChild(item);
}





function dragStartHandler(e) {
    e.dataTransfer.setData("Text", e.target.id);
    sourceId = e.target.id;     // explicitly for some browsers
    e.target.classList.add("dragged");
}

function dragEndHandler(e) {
    var elems = document.querySelectorAll(".dragged");
    for(var i = 0; i < elems.length; i++) {
        elems[i].classList.remove("dragged");
    }

   
}

function dragHandler(e) {
 
}


//event handler on drag enter for Democrats
function dragEnterHandlerdemocrats(e) {
    console.log("Drag Entering " + e.target.id + 
            " source is " + e.dataTransfer.getData("Text") );
  
    var name = e.dataTransfer.getData("text") || sourceId;
    
    var party=whichParty(name);
    if (party == "Democrat") {
        e.preventDefault();
    }
}

//event handler on drag over for Democrats
function dragOverHandlerdemocrats(e) {
    console.log("Drag Over " + e.target.id + 
             " source is " + e.dataTransfer.getData("Text")) ;
  
    var name = e.dataTransfer.getData("text") || sourceId;
    var party=whichParty(name);
    console.log("party"+party);
    if (party == "Democrat") {
        e.preventDefault();
    }
}

//event handler on drop for Democrats
function dropHandlerdemocrats(e) {
    console.log("Drop on " + e.target.id + 
             " source is " + e.dataTransfer.getData("Text")) ;
    e.preventDefault();

   //add to democrats list 
   var id = e.dataTransfer.getData("text") || sourceId;
   var list = document.getElementById("democrats");
   list.innerHTML="";
   var item = document.createElement("li");
   item.innerHTML = name;
   list.appendChild(item);
    var jsonarray=window.localStorage.getItem("senators");
    senators=JSON.parse(jsonarray);
    

    //update local storage 
     for(var index=0;index<senators.length;index++){
        if(senators[index].name==id){
        	      console.log(senators[index].name);
                  senators[index].voted="true";
                  console.log(senators[index].voted);
        }
        window.localStorage.setItem("senators",JSON.stringify(senators));
     }

     msg.innerHTML="Drag ended";
     updateDOMItems();
    
}


//event handler on drag enter for republicans
function dragEnterHandlerrepublicans(e) {
    console.log("Drag Entering " + e.target.id + 
            " source is " + e.dataTransfer.getData("Text") );
  
    var name = e.dataTransfer.getData("text") || sourceId;
    var party=whichParty(name);
    if (party == "Republican") {
        e.preventDefault();
    }
}

//event handler on drag over for republicans
function dragOverHandlerrepublicans(e) {
    console.log("Drag Over " + e.target.id + 
             " source is " + e.dataTransfer.getData("Text")) ;
  
    var name = e.dataTransfer.getData("text") || sourceId;
    var party=whichParty(name);
    if (party == "Republican") {
        e.preventDefault();
    }
}

//event handler on drop for republicans
function dropHandlerrepublicans(e) {
    console.log("Drop on " + e.target.id + 
             " source is " + e.dataTransfer.getData("Text")) ;
    e.preventDefault();

   //add to democrats list 
   var id = e.dataTransfer.getData("text") || sourceId;
   var list = document.getElementById("republicans");
   list.innerHTML="";
   var item = document.createElement("li");
   item.innerHTML = name;
   list.appendChild(item);
    var jsonarray=window.localStorage.getItem("senators");
    senators=JSON.parse(jsonarray);
    

    //update local storage 
     for(var index=0;index<senators.length;index++){
        if(senators[index].name==id){
        	      console.log(senators[index].name);
                  senators[index].voted="true";
                  console.log(senators[index].voted);
        }
        window.localStorage.setItem("senators",JSON.stringify(senators));
     }
     msg.innerHTML="Drag ended";
     updateDOMItems();
    
}


//update on change to local storage
window.onstorage = function(e) {
    updateDOMItems();
}

