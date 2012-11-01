/**
 * @author telecoda
 * 31/10/2012
 */

'use strict';
/** @namespace */
var A2B = A2B || {};

 
A2B.LevelController = function() {
};



A2B.LevelController.prototype.loadLevel  = function ( path, levelNum, onLoaded, onError ) {

	var scope = this;

	var xhr = new XMLHttpRequest();

	var url = path + "level" + levelNum+".json";
	
	xhr.onreadystatechange = function () {

		if ( xhr.readyState === 4 ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				var levelData = JSON.parse( xhr.responseText );
				//var json = xhr.responseText;
				
				onLoaded(levelData);

			} else {

				var errorDesc = "A2B.LevelController.loadLevel: Couldn't load [" + url + "] [" + xhr.status + "]";
				onError(errorDesc);

			}

		}

	};
	
	xhr.open( "GET", url, true );
	xhr.send( null );
	
};
A2B.LevelController.prototype.createLevelScene = function(levelData) {
	// This method will create a new scene object from the level data and return it
	var scene = this.initScene();
	
	// parse the data in the levelData an add the appropriate objects to the scene
	
	// dummy setup for now
	
	this.materials = A2B.initMaterials('images');

	var ground_material = this.materials["rock"];

	var floor = new Physijs.BoxMesh(new THREE.CubeGeometry(20, 1, 20), ground_material, 0 // mass
	);
	floor.receiveShadow = true;
	scene.add(floor);
	
	// add spotlight to scene
	var spotLight = A2B.getSpotLight();
	spotLight.position.set(20, 40, -15);
	spotLight.target.position.copy(scene.position);
	scene.add( spotLight );


	
	
	return scene; 
};
A2B.LevelController.prototype.initLevel = function(levelNum, onLevelInitialised) {
	// this method will load the level data from the JSON file
	var scope = this;
	
	var onLevelLoaded = function(levelData) {
		//scope.levelData = levelData;
		var levelScene = scope.createLevelScene(levelData);
		onLevelInitialised(levelScene);	
	}
	
	var onLevelError = function(errorDesc) {
		alert(errorDesc);
		console.error(errorDesc);
	}
	this.loadLevel(LEVEL_PATH,levelNum, onLevelLoaded, onLevelError);
	
	
}

A2B.LevelController.prototype.initScene = function() {

	var scene = new Physijs.Scene;
	scene.setGravity({
		x : 0,
		y : -20,
		z : 0
	});

	return scene;
}


A2B.Game.prototype.saveLevelToFile = function(path, levelName) {
}
