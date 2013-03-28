// main.js
// Mark Alessi
// project 4
// VFW 1303

// Wait until the DOM is ready
window.addEventListener("DOMContentLoaded", function(){

	//getElementById function
	function$(x){
		var theElement = document.getElementById(x);
		return theElement;
	}

	// Create select field element and populate with options. 
	function makeCats(){
		var formTag = document.getElementsByTagName("form"), //formTag is an array
		selectLi = $("select"),
		makeSelect = document.createElement("select");
		makeSelect.setAttribute("id", "groups");
		for(var i=0, j=contactGroups.length; i<j; i++){
			var makeOption = document.createElement("option");
			var optText = contactGroups[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		} 
		selectLi.appendChild(makeOption);
	}

	//Find value of selected radio buttons
	function getSelectedRadio(){
		var radios = document.forms[0].sex;
		for(var i = 0; i<radios.length; i++){
			if(radios[i].checked){
				sexValue = radios[i].value;
			}
		}
	}

	function getCheckboxValue(){
		if($("fav").checked){
			favoriteValue = $("fav").value;
		}else{
			favoriteValue = "No"
		}
	}
	
	function toggleControls(n){
		switch(n){
			case "on":
			$("contactForm").style.display = "none";
			$("clear").style.display = "inline";
			$("displayLink").style.display = "none";
			$("addNew").style.display = "inline"
			break;
		case "off":
			$("contactForm").style.display = "block";
			$("clear").style.display = "inline";
			$("displayLink").style.display = "inline";
			$("addNew").style.display = "none";
			$("items").style.display = "none"; 
			break; 
		default:
			return false; 
	}
}


function storeData(key){
	//If there is no key that means this is a new item and we need a new key
	if(!key){
		var id 		= Math.floor(Math.random()*100000001);
	}else{
		//Set id to existing key we are editing so it will save over data
		//The key is the same key thats been passed along from the editSubmit event handler
		//to the validate function, and then passed here, into the storeData function
		id = key;
	}
	getSelectedRadio();
	getCheckboxValue();
	var item 			={};
		item.group 		=["Group:", $("groups").value];
		item.fname 		=["First Name:", $("fname").value];
		item.lname 		=["Last Name:", $("lname").value];
		item.email 		=["Email:", $("email").value];
		item.sex 		=["Sex:", sexValue];
		item.favorite 	=["Is a favorite:", favoriteValue];	
		item.iq 		=["IQ:", $("iq").value];
		item.date 		=["Date:", $("date").value];
		item.notes 		=["Notes:", $("notes").value];
		// Save Data into local storage: Use Stringify to convert object to a string.
		localStorage.setItem(id, JSON.stringify(item));
		alert("Contact Saved");
	}

	function getData(){
		toggleControls("on");
		if(localStorage.length === 0){
			alert("There is no data in Local Storage.");
		}
		// Write Data from Local Storage to the browser.
		var makeDiv = document.createElement("div");
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement("ul");
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		$("items").style.display = "block";
		for(var i=0, len=localStorage.length; i<len; i++){
			var makeli = document.createElement("li");
			var linksLi = document.createElement("li");
			makeList.appendChild(makeli);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			// Convert the string from local Storage back to object
			var obj = JSON.parse(value);
			var makeSubList = document.createElement("ul");
			makeli.appendChild(makeSubList);
			for(var n in obj){
				var makeSubLi = document.createElement("li");
				makeSubList.appendChild(makeSubLi);
				var optSubText = obj[n][0]+" "+obj[n][1];
				makeSubLi.innerHTML = optSubText;
				makeSubList.appendChild(linksLi);
			}
			makeItemLinks(localStorage.key(i), linksLi); // Create Edit and Delete button links for each item in local storage
		}
	}

// Makes Item Links
// Create the edit and delete links for each stored item when displayed
function makeItemLinks(key, linksLi){
// add edit single item link
var editLink = document.createElement("a");
editLink.href = "#";
editLink.key = key;
var editText = "Edit Contact"; //change to movie
editLink.addEventListener("click", editItem);
editLink.innerHTML = editText;
linksLi.appendChild(editLink);

// add line break
var breakTag = document.createElement("br");
linksLi.appendChild(breakTag);


// added delete single item link
var deleteLink = document.createElement("a");
deleteLink.href = "#";
deleteLink.key = key;
var deleteText = "Delete Contact";
deleteLink.addEventListener("click", deleteItem);
deleteLink.innerHTML = deleteText;
linksLi.appendChild(deleteLink); 
}


function editItem(){
	// Grab the data from our item from local storage
	var value = localStorage.getItem(this.key); //this is same as editLink
	var item = JSON.parse(value);

	//Show the form
	toggleControls("off");

	//Populate form fields w/current localStorage values
	$("groups").value = item.group[1];
	$("fname").value = item.fname[1];
	$("lname").value = item.lname[1];
	$("email").value = item.email[1];
	var radios = document.forms[0].sex;
	for(var i =0; i<radios.length; i++){
		if (radios.value[i].value == "Male" && item.sex[1] == "Male"){
			radios[i].setAttribute("checked", "checked");
		}else if (radios[i].value == "Female" && item.sex[1] == "Female"){
			radios[i].setAttribute("checked", "checked");
		}
	}
	if(item.favorite[1] == "Yes") {
		$("fav").setAttribute("checked", "checked");
	}
	$("iq").value = item.iq[1];
	$("date").value = item.date[1];
	$("notes").value = item.notes[1];

	// Remove the initial listener from the input "save contact" button
	save.removeEventListener("click", storeData);
	// Change Submit Button Value to Edit Button
	$("submit").value = "Edit Contact";
	var editSubmit = $("submit");
	// Save the key value est. in this function as a property of the editSubmit event
	// so we can use that value when we save the date we edited
	editSubmit.addEventListener("click", validate);
	editSubmit.key = this.key;
}

function deleteItem(){
	var ask = confirm("Are you sure you want to delete this contact?")
	if(ask){
		localStorage.removeItem(this.key);
		alert("Contact was deleted!");
		window.location.reload();
	}else{
		alert("Contact was NOT deleted.")
	}
}

function clearLocal(){
	if(localStorage.length === 0){
		alert("There is no date to clear.");
	}else{
		localStorage.clear();
		alert("All contacts are deleted!");
		window.location.reload();
		return false;
	}
}

	function validate(){
		// Define the elements we want to check
		var getGroup = $("groups");
		var getFname = $("fname");
		var getLname = $("lname");
		var getEmail = $("email");

		//Reset Error Messages
		errMsg.innerHTML = "";
		getGroup.style.border = "1px solid black";
		getFname.style.border = "1px solid black";
		getLname.style.border = "1px solid black";
		getEmail.style.border = "1px solid black";

		//Get Error Messages
		var messageAry = [];
		//Group Validation
		if(getGroup.value === "--Choose A Group--"){
			var groupError = "Please choose a group.";
			getGroup.style.border = "1px solid red";
			messageAry.push(groupError);
		}

		//First Name Validation
		if(getFname.value ==== ""){
			var fNameError = "Please enter a first name.";
			getFname.style.border = "1px solid red";
			messageAry.push(fNameError);
	}

		//Last Name Validation
		if(getLname.value ==== ""){
			var LNameError = "Please enter a last name.";
			getLname.style.border = "1px solid red";
			messageAry.push(lNameError);
	}

		//Email Validation
		var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if(!re.exec(getEmail.value))){
			var emailError = "Please enter a valid email address.";
			getEmail.style.border = "1px solid red";
			messageAry.push(emailError);
		}

		//If there are errors, display on screen
		if(messageAry.length >= 1) {
			for (var i = 0, j=messageAry.length; i < j; i++);
				var txt = document.createElement("li");
				txt.innerHTML = messageAry[i];
				errMsg.appendChild(txt);
			}
			e.preventDefault();
			return false;
		}else{
			//If all is ok, save data. Send key value (came from editData function)
			//This key value was passed through the editSubmit event listener as a property.
			storeData(this.key);		
		}
	}		

	// Variable defaults 
	var contactGroups = ["--Choose A Group--", "Friends", "Family", "Work"],
		sexValue,
		favoriteValue = "No",
		errMsg = $("errors");
		;
		makeCats();

	// Set link & Submit click events

	var displayLink = $("displayLink");
	displayLink.addEventListener("click", getData);
	var clearLink = $("clear");
	clearLink.addEventListener("click", clearLocal);
	var save = $("submit");
	save.addEventListener("click", validate);




	});			