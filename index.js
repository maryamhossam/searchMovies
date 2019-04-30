var searchIndex = [];


; (function (window, document, undefined) {

	'use strict';

	//
	// Variables
	//
	var apiSearchUrl = 'http://www.omdbapi.com/?apikey=338f9a63&s=';
	var form = document.querySelector('#form-search');
	var input = document.querySelector('#input-search');
	var resultList = document.querySelector('#search-results');
	var message = document.querySelector('#search-message');
	var pageNumber = 1;
	var results = [];
    var stopLoadMore = true;
	//
	// Methods
	//

	var getMovies = (query) => {
		try {
			var httpRequest = new XMLHttpRequest();
			httpRequest.onreadystatechange = function () {
			//	var results = [];
				if (httpRequest.readyState == 4) {
					if (httpRequest.responseText) {
						var result = JSON.parse(httpRequest.responseText);
						if (result.Response && result.Search) {
							result.Search.forEach(article => results.push(article));
						}
						else {
							if(results.length <= 0) {

							message.innerHTML = showMessageHTML(result.Error);
							} //end of load more ore not
							stopLoadMore = false;
							return;
						}

						// Display the results
					  results.length < 1 ? message.innerHTML=showMessageHTML('Sorry, no matches were found.') : resultList.innerHTML=createResultsHTML(results);
					};
				};
			} 
			httpRequest.open("GET", apiSearchUrl + query, true);
			httpRequest.send();
		}
		catch (error) {
			alert(error);
		}
	};

	var createHTML = (article, id) => {
		var html =
			'<article class="article-container grid-item " id="search-result-' + id + '">' +
			'<div class="text">' +
			'<div class="centered">' + article.Title + '</div>' +
			'</div>' +
			'<img src="' + article.Poster +'" onerror="this.src= \'No-image-available.jpg\' " alt="' + article.Title + '"class="search-image"/>' +
			'</article>';
		return html;
	};


	var showMessageHTML = (error) => {
		clearData();
		return '<h2>' + error + '</h2>';
	};

	var createResultsHTML = results => {
		var html = '';
		html += results.map((article, index) => {
			return createHTML(article, index);
		}).join('');
		message.innerHTML = '';
		return html;
	};

	var search = (query,pageNumber) => {	
		if(!query){
			return message.innerHTML = showMessageHTML('please write something to search for.');			
		}
		query += '&page='+pageNumber;
		getMovies(query);
	};

	/**
	 * Handle submit events
	 */
	var submitHandler = event => {
		event.preventDefault();
		clearData();
		search(input.value,pageNumber);
	};

	var clearData = () => {
		pageNumber = 1;	
		results = [];
		resultList.innerHTML='';
		message.innerHTML = '';	
		stopLoadMore = true;	
	}

	//
	// Inits & Event Listeners
	//

	// Make sure required content exists
	if (!form || !input || !resultList || !searchIndex) return;
	
	// Create a submit handler
	form.addEventListener('submit', submitHandler, false);

	// Detect when scrolled to bottom.
	resultList.addEventListener('scroll', function () {
		if (resultList.scrollTop + resultList.clientHeight >= resultList.scrollHeight && stopLoadMore==true) {
			pageNumber= pageNumber +1;
			search(input.value,pageNumber)
		}
	});

})(window, document);