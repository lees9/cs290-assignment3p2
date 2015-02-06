
function matchLanguage(checkedLanguages, gistLang) {
	if (checkedLanguages.length === 0) {
		return true;
	}

	var gistLang = gistLang.toLowerCase();
	return checkedLanguages.indexOf(gistLang) !== -1;
}

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

function removeChildren(nodeId) {
	var myNode = document.getElementById(nodeId);
	while (myNode && myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}		
}

function getLanguage(gist) {
	var language = null;
	var files = gist.files;
	if (files) {
		for (var file in files) {
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
			console.log("SUCCESS!");
			removeChildren('gistList');

			var baseURL = 'https://api.github.com/gists/public?';
			var endURL = '&per_page=30';
			var pageNums = document.getElementById('pageNums').value;
			console.log(pageNums);
			

			var checkedLanguages = readCheckboxValues('langChk');
			for (i = 1; i <= pageNums; i++){
				var xmlHTTP = new XMLHttpRequest();
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

		function getHtmlItemOfGist(desription, url, language) {
			return '<li><a href="{0}">{1}</a>{2}</li>'.format(url, desription, language);
		}

		function buildGistNode(gistId, desription, url, language) {
			var a = document.createElement('a');
			var weblink = document.createTextNode(desription);
			a.appendChild(weblink);
			a.href = url;


			var input = document.createElement("input");
			input.type = "submit";
			input.value = 'Favorite';
			input.id = 'favorite_button';

			input.onclick = function onclick() {
				onFavoriteClick(gistId);
			}

			var languageNode = document.createTextNode(language);


			var b = document.createElement('li');
			b.appendChild(input);
			b.appendChild(a);

			b.appendChild(languageNode);
			b.id = gistId;

			return b;
		}

		function onFavoriteClick(nodeId) {
			console.log("node id " + nodeId);

			var gistNode = document.getElementById(nodeId);
			gistNode = gistNode.parentNode.removeChild(gistNode);

			var favButton = gistNode.querySelector("#favorite_button");
			if (favButton) {
				favButton.value = "Remove";
				favButton.onclick = function () {
					onRemoveClick(nodeId);
				};
			}

			document.getElementById('favList').appendChild(gistNode);
		}

		function onRemoveClick(nodeId) {
			console.log("node id " + nodeId);

			var gistNode = document.getElementById(nodeId);
			gistNode = gistNode.parentNode.removeChild(gistNode);

			var favButton = gistNode.querySelector("#favorite_button");
			if (favButton) {
				favButton.value = "Favorite";
				favButton.onclick = function () {
					onFavoriteClick(nodeId);
				};
			}

			var gistList = document.getElementById('gistList');
			gistList.insertBefore(gistNode, gistList.firstChild);
		}


            //convert the gists to javascript objects to load onto webpage
            function gistLoad(xmlHTTP, checkedLanguages) {
			//console.log(xmlHTTP.responseText);
			
			var htmlText = "";
			
			var gists = JSON.parse(xmlHTTP.responseText);
			for (var i = 0; i < gists.length; i++){
				var gist = gists[i];
				console.dir(gist);
				var strChk = gist.description;
				var urlChk = gist.url;
				var langChk = getLanguage(gist);
				console.log("langauge " + langChk);
				//console.log(strChk + '\n');
				console.log(langChk + '\n');

				if (!matchLanguage(checkedLanguages, langChk)) {
					continue;
				}

				if (isEmpty(strChk) == true){
					strChk = 'Description Not Available';
				}

				var gistNode = buildGistNode(gist.id, strChk, urlChk, langChk);
				document.getElementById('gistList').appendChild(gistNode);
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