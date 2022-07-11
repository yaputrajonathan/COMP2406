var xhttp;
var items = null;
var foundItems = null;
window.onload = function initializePage(){
  let submitButton = document.querySelector("#btnSubmit");
  let inputs = document.querySelectorAll("input");

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", checkInputs);
  }

  sendRequest("http://localhost:8000/search/items");
};

function sendRequest(URL){
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = processData;
    xhttp.open("GET", URL, true);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send();
}

function processData(){
    if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        let data = xhttp.responseText;
        items = JSON.parse(data);
        console.log(items);

        clearTable();
        populateItems(items);
    } else if (xhttp.status === 500) {
        console.log(xhttp.responseText);
    } else {
        console.log("The server is not done processing the request...");
    }
}

function processResults(URL){
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
              // console.log("The fridge was successfully added!");
              // console.log(xhttp.responseText);
        let data = xhttp.responseText;
        let foundItems = JSON.parse(data);
        console.log(foundItems);
        clearTable();
        populateItems(foundItems);
      }
            else if(xhttp.status === 400){
              badRequestMessage();
              console.log(xhttp.responseText);
      }
            else if(xhttp.status === 404){
                errorMessage();
              console.log(xhttp.responseText);
      }
    };
    xhttp.open("GET", URL, true);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send();
  
  }

function populateItems(items){

    let column = document.getElementById("column");
    
    

    for(let element of items){
        let type = null;

        switch(element.type){
            case "1":
                type = "Dairy";
                break;
            case "2":
                type = "Produce";
                break;
            case "3":
                type = "Pantry";
                break;
            default:
                type = "Any";

        }
        
		let itemID = parseInt(element.id);
		// let item = element[itemID];

		let mdItem = document.createElement("div");
		mdItem.className = "item " + type;
		mdItem.id = "item-" + itemID;
		// mdItem.innerHTML = "<img src='" + element.img + "' width='100px' height='100px'; />";

		let itemDetails = document.createElement("div");
		itemDetails.id = "item_details";
		itemDetails.innerHTML = "<p id='nm-" + itemID + "'>Name: " + element.name + "</p><p>Type: <span id='qt-" + itemID + "'>" + type + "</span></p>";


		mdItem.appendChild(itemDetails);
		column.appendChild(mdItem);
	}
}

function checkInputs(event) {
    let element = event.target;
    let numFilled = 0;
    let inputs = document.querySelectorAll("input");
  
    if (element.id == "itemName" ||element.id == "typeName"){
      if(!isNaN(element.value)){
        element.classList.add("error");
        element.classList.remove("valid");
      }else{
        element.classList.add("valid");
        element.classList.remove("error");
      }
    }
  
    for (let i = 0; i < inputs.length; i++) {
      if(inputs[i].value.length > 0 && !inputs[i].classList.contains("error")){
              numFilled++;
          }
    }
  
    if (numFilled > 0) {
      document.querySelector("#btnSubmit").disabled = false;
    }else{
      document.querySelector("#btnSubmit").disabled = true;
    }
    document.querySelector("#btnSubmit").addEventListener("click", getResults);
    
  }

  function getResults(event){
    event.preventDefault();
    let name = document.getElementById("itemName").value;
    let type = document.getElementById("typeName").value;
    let newType = undefined;

    switch(type){
        case "dairy":
            newType = "1";
            break;
        case "produce":
            newType = "2";
            break;
        case "pantry":
            newType = "3";
            break;
        default:
            newType = "error";

    }

  
    let url = "http://localhost:8000/search/items?";
    if (name !== undefined){
      url += "name=" + name +"&";
    }
    if (newType !== undefined){
      url += "type=" + newType +"&";
    }

    console.log(url);
    processResults(url);
  }
  
  function clearTable(){
    let column = document.getElementById("column");
    column.innerHTML = "";
  }

function errorMessage(){
    let column = document.getElementById("column");
    column.innerHTML = "Cannot find Item...";
}

function badRequestMessage(){
    let column = document.getElementById("column");
    column.innerHTML = "Please fill in the form correctly...";
}