/**
 * @author telecoda
 * 31/10/2012
 */

'use strict';
/** @namespace */
var A2B = A2B || {};

 
A2B.LevelController = function() {
};



A2B.LevelController.createLevelScene = function(levelData,materials) {
	// This method will create a new scene object from the level data and return it
	var scene = A2B.Graphics.createEmptyScene();
	
	// parse the data in the levelData an add the appropriate objects to the scene
	
	var blocks = A2B.Graphics.createBlocks(levelData.blocks,materials);

	A2B.Graphics.addObjectsToScene(scene,blocks);
	
	var lights = A2B.Graphics.createLights(levelData.lights);
	
	A2B.Graphics.addObjectsToScene(scene,lights);
	
	return scene; 
};


A2B.LevelController.initLevel = function(levelNum, onLevelInitialised) {
	// this method initialises a level from the json file describing the level.
	// it goes through the following steps:-
	// i.) read level definition from json file and parse into "levelData" object.
	// ii.) load textures required for level in levelData.textures held in textures dir
	// iii.) create materials required for level in levelData.materials
	// iv.) create scene objects for level in levelData.sceneObjects
	
	// at the end of all this it will call your onLevelInitialised callback ;)
	
	var scope = this;
	
	var levelData = null;
	
	var onLevelLoaded = function(levelJSONData) {
		
		// parse JSON data to an object
		try {
			console.log("LevelController", "Parsing level JSON - started");
			levelData = JSON.parse(levelJSONData );
			console.log("LevelController", "Parsing level JSON - ended");

			// JSON is well formed

			console.log("LevelController", "Validating level data - started");
			var errors = A2B.LevelController.validateLevel(levelData );
			console.log("LevelController", "Validating level data - ended");
			
			if(errors.length>0) {
				// report errors
				console.log("LevelController", "Validate Level failed, data has errors");
				console.log("LevelController", errors);
				alert(errors);
			}
			else {
				// continue with level init
				var textures = A2B.Graphics.loadTextures("textures/",levelData.textures, onTexturesLoaded);
			}		
		} catch ( error ) {

			console.error( error );
			alert(error);

		}
	}

	var onTexturesLoaded = function(textures) {
		// create materials
		var materials = A2B.Graphics.createMaterials(levelData.materials, textures);
		var levelScene = A2B.LevelController.createLevelScene(levelData,materials);
		onLevelInitialised(levelScene);	
	}

	var onLevelError = function(errorDesc) {
		alert(errorDesc);
		console.error(errorDesc);
	}

	
	var url = LEVEL_PATH+"level"+levelNum+".json";

	A2B.Utils.asyncFileLoad(url, onLevelLoaded, onLevelError);
	
	
}


A2B.LevelController.saveLevelToFile = function(path, levelName) {
}

A2B.LevelController.validateLevel = function(levelData) {
	/* this method is to validate that the levelData has all the mandatory attributes */
	var errors = [];
	var i=0;
	// name check
	if(levelData.name==undefined) {
		// level must have a name
		errors[i++]="Level does not have a name";
	}
	// lights
	if(levelData.lights==undefined) {
		// level must have at least one light
		errors[i++]="Level does not have any lights";
	}

	// blocks
	if(levelData.blocks==undefined) {
		// level must have some blocks for the player to play on
		errors[i++]="Level does not have any blocks";
	}
	else {
		// blocks exist, check for start block
		var len=levelData.blocks.length;

		var startBlockFound = false;
		var endBlockFound = false;
		
		for(var i=0; i<len; i++) {
			var block = levelData.blocks[i];
			// check for start and end blocks
			if(block.name=="startBlock") {
				startBlockFound=true;
			}
			if(block.name=="endBlock") {
				endBlockFound=true;
			}
		}
		
		if(!startBlockFound) {
			errors[i++]="Level does not have a startBlock";
		}

		if(!endBlockFound) {
			errors[i++]="Level does not have a endBlock";
		}

	}


	
	return errors;
}
