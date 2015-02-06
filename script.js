/*Name: Sang Hoon Lee
Class: CS290 Winter 2015
Assignment: Ajax Assignment
Date: 02/05/2015
Filename: index.html*/


//checks to see how many languages were checked
function matchLanguage(checkedLanguages, gistLang) {
	if (checkedLanguages.length === 0) {
		return true;
	}

	var gistLang = gistLang.toLowerCase();
	return checkedLanguages.indexOf(gistLang) !== -1;
}

//get the languages checked by user
function readCheckboxValues(nodeName) {
	var checkedValue = []; 
	var inputElements = document.getElementsByName(nodeName);
	for(var i=0; inputElements[i]; ++i){
		if(inputElements[i].checked){
			checkedValue.push(inputElements[i].value.toLowerCase());
		}
	}		

	console.log(checkedValue);
	return checkedValue;
}

//to remove the gists
function removeChildren(nodeId) {
	var myNode = document.getElementById(nodeId);
	while (myNode && myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}		
}

//checks the language in gists and if no language provided changes it to "Unknown Language"
function getLanguage(gist) {
	var language = null;
	var files = gist.files;
	if (files) {
		for (var file in files) {		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
			if (files.hasOwnProperty(file) && files[file].hasOwnProperty("language")) {
				language = files[file]["language"];
			}
		}
	}

	if (!language) {
		language = "Unknown Language"
	}
	return language;
}		

//get gists from github
function getGist() {
	//console.log("SUCCESS!");
	removeChildren('gistList');	//clear the previous search

	var baseURL = 'https://api.github.com/gists/public?';
	var endURL = '&per_page=30';
	var pageNums = document.getElementById('pageNums').value;
	//console.log(pageNums);
	
	var checkedLanguages = readCheckboxValues('langChk');
	for (i = 1; i <= pageNums; i++){
		var xmlHTTP = new XMLHttpRequest();		//from lecture
		xmlHTTP.onreadystatechange = function(){
			if (xmlHTTP.readyState == 4 && xmlHTTP.status == 200){
				gistLoad(xmlHTTP, checkedLanguages);
			}
		}

		var compURL = baseURL + 'page=' + i + endURL;
		xmlHTTP.open("GET", compURL, true);
		xmlHTTP.send();
		console.log(i);
	}
}

//build the nodes to append the gistList
function buildGistNode(gistId, desription, url, language) {
	
	//create the anchor element with description as text
	var a = document.createElement('a');
	var linkText = document.createTextNode(desription);
	a.appendChild(linkText);
	a.href = url;

	//create the favorite button
	var input = document.createElement("input");
	input.type = "submit";
	input.value = 'Favorite';
	input.id = 'favorite_button';

	//input for clicking favorite
	input.onclick = function onclick() {
		onFavoriteClick(gistId);
	}

	var languageNode = document.createTextNode(language);

	//create list element and append input, a, and language nodes to display on one line
	var b = document.createElement('li');
	b.appendChild(input);
	b.appendChild(a);
	b.appendChild(languageNode);
	b.id = gistId;

	return b;
}

//function for favorite click
function onFavoriteClick(nodeId) {
	//console.log("node id " + nodeId);

	var gistNode = document.getElementById(nodeId);
	gistNode = gistNode.parentNode.removeChild(gistNode);	//remove node from gistList

	//change the favorte button to remove button
	var favButton = gistNode.querySelector("#favorite_button");		//https://developer.mozilla.org/en-US/docs/Web/API/document.querySelector
	if (favButton) {
		favButton.value = "Remove";
		favButton.onclick = function () {
			onRemoveClick(nodeId);
		};
	}

	//insert favorited node into favList
	document.getElementById('favList').appendChild(gistNode);
}

//function for remove click
function onRemoveClick(nodeId) {
	//console.log("node id " + nodeId);

	var gistNode = document.getElementById(nodeId);
	gistNode = gistNode.parentNode.removeChild(gistNode);	//remove node from favList

	//change the remove button back to favorite
	var favButton = gistNode.querySelector("#favorite_button");		//https://developer.mozilla.org/en-US/docs/Web/API/document.querySelector
	if (favButton) {
		favButton.value = "Favorite";
		favButton.onclick = function () {
			onFavoriteClick(nodeId);
		};
	}

	//insert removed node to top of gistList
	var gistList = document.getElementById('gistList');
	gistList.insertBefore(gistNode, gistList.firstChild);
}


    //convert the gists to javascript objects to load onto webpage
    function gistLoad(xmlHTTP, checkedLanguages) {
	//console.log(xmlHTTP.responseText);
	
	var gists = JSON.parse(xmlHTTP.responseText);
	for (var i = 0; i < gists.length; i++){
		var gist = gists[i];
		//console.dir(gist);
		var strChk = gist.description;
		var urlChk = gist.url;
		var langChk = getLanguage(gist);
		//console.log("langauge " + langChk);
		//console.log(strChk + '\n');
		//console.log(langChk + '\n');

		if (!matchLanguage(checkedLanguages, langChk)) {
			continue;
		}

		if (isEmpty(strChk) == true){
			strChk = 'Description Not Available';
		}

		var gistNode = buildGistNode(gist.id, strChk, urlChk, langChk);		//build the gist to display
		document.getElementById('gistList').appendChild(gistNode);			//append the gist to gistList
	}
}


//check if description if null
function isEmpty(str) {
	if (!str){
		return true;
	}
	else if (str === ""){
		return true;
	}
	return false;
}	