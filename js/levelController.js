/**
 * @author telecoda
 * 31/10/2012
 */

'use strict';
/** @namespace */
var A2B = A2B || {};

 
A2B.LevelController = function() {
};



A2B.LevelController.prototype.loadLevel  = function ( url ) {

	var scope = this;

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {

		if ( xhr.readyState === 4 ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				var json = JSON.parse( xhr.responseText );
				//var json = xhr.responseText;
				
				scope.onLoaded(json);

			} else {

				var errorDesc = "A2B.LevelController.loadLevel: Couldn't load [" + url + "] [" + xhr.status + "]";
				scope.onError(errorDesc);

			}

		}

	};
	
	xhr.open( "GET", url, true );
	xhr.send( null );
	
};

A2B.LevelController.prototype.onLoaded  = function ( json ) {
	
	this.levelJson = json;

};

A2B.LevelController.prototype.onError  = function ( error ) {
	
	this.levelJson = null;
	console.error(errorDesc);
				
};

A2B.Game.prototype.saveLevelToFile = function(path, levelName) {
}
