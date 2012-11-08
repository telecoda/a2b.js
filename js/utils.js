'use strict';
/** @namespace */
var A2B	= A2B 		|| {};

A2B.Utils = function() {
};

A2B.Utils.asyncFileLoad  = function ( url, onLoaded, onError ) {

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {

		if ( xhr.readyState === 4 ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				var fileData = xhr.responseText;
				
				onLoaded(fileData);

			} else {

				var errorDesc = "A2B.Utils.asyncFileLoad: Couldn't load [" + url + "] [" + xhr.status + "]";
				onError(errorDesc);

			}

		}

	};
	
	xhr.open( "GET", url, true );
	xhr.send( null );
	
};

