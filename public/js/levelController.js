/**
 * @author telecoda
 * 31/10/2012
 */

'use strict';
/** @namespace */
var A2B = A2B || {};

//pointers to callback funcs
var onLevelInitialised;
var onLevelCompleted;
var onPlayerDied;
 
A2B.LevelController = function() {
};



A2B.LevelController.createLevelScene = function(levelData,materials) {
	// This method will create a new scene object from the level data and return it
	var scene = A2B.Graphics.createEmptyScene();
	
	// parse the data in the levelData an add the appropriate objects to the scene
	
	var blocks = A2B.Graphics.createBlocks(levelData.blocks,materials);

	A2B.Graphics.addObjectsToScene(scene,blocks);
	
	var spheres = A2B.Graphics.createSpheres(levelData.spheres,materials);

	A2B.Graphics.addObjectsToScene(scene,spheres);
	
	var lights = A2B.Graphics.createLights(levelData.lights);
	
	A2B.Graphics.addObjectsToScene(scene,lights);
	
	// position camera
	//gameView.camera.position=levelData.camera.position;
	// pan camera to position
	//gameController.cameraControls.panCamera(levelData.camera.position);
	
	return scene; 
};


/*
 * collision handling callback for level
 */
A2B.LevelController.handleActiveSphereCollision = function( collided_with, linearVelocity, angularVelocity ) {
	if(collided_with.name=="startBlock")
	{
		this.material.color.setHex(0x00ff00);
	}
	if(collided_with.name=="endBlock")
	{
		this.material.color.setHex(0xff0000);
		// level has ended!
		if(gameModel.mode == LEVEL_RUNNING_MODE) {
			onLevelCompleted();
		}
		/*if(onLevelCompleted != undefined) {
			onLevelCompleted();
			// disable repeated env of level calls
			onLevelCompleted = undefined;
		}*/
	}
	/*switch ( ++this.collisions ) {
		
		case 1:
			this.material.color.setHex(0xcc8855);
			break;
		
		case 2:
			this.material.color.setHex(0xbb9955);
			break;
		
		case 3:
			this.material.color.setHex(0xaaaa55);
			break;
		
		case 4:
			this.material.color.setHex(0x99bb55);
			break;
		
		case 5:
			this.material.color.setHex(0x88cc55);
			break;
		
		case 6:
			this.material.color.setHex(0x77dd55);
			break;
	}*/
};



A2B.LevelController.initLevel = function(levelNum, onLevelInitialisedCallback, onLevelCompletedCallBack , onPlayerDiedCallBack) {
	// this method initialises a level from the json file describing the level.
	// it goes through the following steps:-
	// i.) read level definition from json file and parse into "levelData" object.
	// ii.) load textures required for level in levelData.textures held in textures dir
	// iii.) create materials required for level in levelData.materials
	// iv.) create scene objects for level in levelData.sceneObjects
	
	// at the end of all this it will call your onLevelInitialised callback ;)
	
	// save callback refs
	onLevelInitialised = onLevelInitialisedCallback;
	onLevelCompleted = onLevelCompletedCallBack;
	onPlayerDied = onPlayerDiedCallBack;
	
	var levelData = null;

	var levelModel = new A2B.LevelModel();
	
	var onLevelLoaded = function(levelJSONData) {
		
		// parse JSON data to an object
		try {
			console.log("LevelController", "Parsing level JSON - started");
			levelModel.levelData = JSON.parse(levelJSONData );
			console.log("LevelController", "Parsing level JSON - ended");

			// JSON is well formed

			console.log("LevelController", "Validating level data - started");
			var errors = A2B.LevelController.validateLevel(levelModel.levelData );
			console.log("LevelController", "Validating level data - ended");
			
			if(errors.length>0) {
				// report errors
				console.log("LevelController", "Validate Level failed, data has errors");
				console.log("LevelController", errors);
				alert(errors);
			}
			else {
				// continue with level init
				levelModel.textures = A2B.Graphics.loadTextures("textures/",levelModel.levelData.textures, onTexturesLoaded);
			}		
		} catch ( error ) {

			console.error( error );
			alert(error);

		}
	}

	var onTexturesLoaded = function(textures) {
		// create materials
		levelModel.textures = textures;
		levelModel.materials = A2B.Graphics.createMaterials(levelModel.levelData.materials, textures);
		levelModel.scene = A2B.LevelController.createLevelScene(levelModel.levelData,levelModel.materials);
		
		onLevelInitialised(levelModel);	
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
	if(levelData.timeLimit==undefined) {
		// level must have a time limit
		errors[i++]="Level does not have a timeLimit";
	}

	if(levelData.minimumBallHeight==undefined) {
		// level must have a minimum ball height
		errors[i++]="Level does not have a minimumBallHeight";
	}

	// lights
	if(levelData.lights==undefined) {
		// level must have at least one light
		errors[i++]="Level does not have any lights";
	}

	// camera
	if(levelData.camera==undefined) {
		// level must have a camera
		errors[i++]="Level does not have a camera defined";
	}

	if(levelData.camera.position==undefined) {
		// level must have a camera postion
		errors[i++]="Level does not have a camera.position defined";
	}

	if(levelData.camera.lookAtPosition==undefined) {
		// level must have a camera lookAtPosition
		errors[i++]="Level does not have a camera.lookAtPosition defined";
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
			if(block.name==START_BLOCK) {
				startBlockFound=true;
			}
			if(block.name==END_BLOCK) {
				endBlockFound=true;
			}
		}
		
		if(!startBlockFound) {
			errors[i++]="Level does not have a "+START_BLOCK;
		}

		if(!endBlockFound) {
			errors[i++]="Level does not have a " + END_BLOCK;
		}

	}

	// spheres
	if(levelData.spheres==undefined) {
		// level must have some spheres for the player to control
		errors[i++]="Level does not have any spheres";
	}
	else {
		// spheres exist, check for mainSphere
		var len=levelData.spheres.length;

		var mainSphereFound = false;
		
		for(var i=0; i<len; i++) {
			var sphere = levelData.spheres[i];
			// check for mainSphere
			if(sphere.name==MAIN_SPHERE) {
				mainSphereFound=true;
			}
		}
		
		if(!mainSphereFound) {
			errors[i++]="Level does not have a " + MAIN_SPHERE;
		}

	}
	
	return errors;
}
