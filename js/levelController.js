/**
 * @author telecoda
 * 31/10/2012
 */

'use strict';
/** @namespace */
var A2B = A2B || {};

 
A2B.LevelController = function() {
};



A2B.LevelController.loadLevel  = function ( path, levelNum, onLoaded, onError ) {

	var xhr = new XMLHttpRequest();

	var url = path + "level" + levelNum+".json";
	
	xhr.onreadystatechange = function () {

		if ( xhr.readyState === 4 ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				//var levelData = JSON.parse( xhr.responseText );
				var levelJSONData = xhr.responseText;
				
				onLoaded(levelJSONData);

			} else {

				var errorDesc = "A2B.LevelController.loadLevel: Couldn't load [" + url + "] [" + xhr.status + "]";
				onError(errorDesc);

			}

		}

	};
	
	xhr.open( "GET", url, true );
	xhr.send( null );
	
};

A2B.LevelController.createBlocks = function(scene,blocksToCreate,materials) {

	// blocksToCreate is a list of objects in the following format
	/*
	  
"blocks" :
				  	[
				  		{ 
				  			"name" 			: "main_floor",
				  			"material" 		: "ground_material",
				  			"dimensions"		: {"x":20,"y":1,"z":20},
				  			"position"		: {"x":0,"y":0,"z":0},
							"rotation"		: {"x":0,"y":45,"z":0},
							"mass" 		: 0
				  		},
		  		
	  etc..	
	  
	 */


	// iterate through a list of blocks to create
	var len=blocksToCreate.length;

	for(var i=0; i<len; i++) {
		var blockToCreate = blocksToCreate[i];
		
		var material = materials[blockToCreate.material];
			if(material==undefined){
				alert("Block:" + blockToCreate.name + " Material:" + blockToCreate.material + " is not found.");
			}
		
		var block = new Physijs.BoxMesh(new THREE.CubeGeometry(blockToCreate.dimensions.x,blockToCreate.dimensions.y,blockToCreate.dimensions.z), material, blockToCreate.mass);
		var positionVector = new THREE.Vector3(blockToCreate.position.x,blockToCreate.position.y,blockToCreate.position.z);
		var rotationVector = new THREE.Vector3(blockToCreate.rotation.x,blockToCreate.rotation.y,blockToCreate.rotation.z);
		block.position = positionVector;
		block.rotation = rotationVector;
		block.receiveShadow = true;
		block.castShadow = true;
		block.name = blockToCreate.name;
		// add to scene
		scene.add(block);
			
	}



}

A2B.LevelController.createLevelScene = function(levelData,materials) {
	// This method will create a new scene object from the level data and return it
	var scene = A2B.createEmptyScene();
	
	// parse the data in the levelData an add the appropriate objects to the scene
	
	A2B.LevelController.createBlocks(scene,levelData.blocks,materials);
	
	A2B.LevelController.createLights(scene,levelData.lights);
	
	return scene; 
};

A2B.LevelController.createLight = function(name, colour, type, position, targetPosition, props) {
		var light;
		// Light
		switch(type) {
			case "spot":
				light = new THREE.SpotLight(colour );
				break;
			case "directional":
				light = new THREE.DirectionalLight(colour );
				break;
			case "ambient":
				light = new THREE.AmbientLight(colour );
				break;
			case "point":
				light = new THREE.PointLight(colour );
				break;
			default:
				alert("Cannot create a light of type:"+type);
				return;
		}
	
		light.position = position;
		light.target.position.copy(targetPosition);
		light.name = name;
		
		for ( var key in props ) {

			var newValue = props[ key ];

			if ( newValue === undefined ) {
	
				console.warn( 'createLight: \'' + key + '\' parameter is undefined.' );
				continue;
	
			}
			else {
				light[ key ] = newValue;
			}
		}
		
		return light;
		};


A2B.LevelController.createLights = function(scene,lightsToCreate) {

	// iterate through a list of lights to create
	var len=lightsToCreate.length;

	for(var i=0; i<len; i++) {
		var lightToCreate = lightsToCreate[i];

		var positionVector = new THREE.Vector3(lightToCreate.position.x,lightToCreate.position.y,lightToCreate.position.z);
		var targetVector = new THREE.Vector3(lightToCreate.targetPosition.x,lightToCreate.targetPosition.y,lightToCreate.targetPosition.z);
		
		var light = A2B.LevelController.createLight(lightToCreate.name,lightToCreate.colour,lightToCreate.type, positionVector, targetVector,lightToCreate.props);
		
		// add to scene
		scene.add(light);
			
	}



}


A2B.LevelController.initLevel = function(levelNum, onLevelInitialised) {
	// this method initialises a level from the json file describing the level.
	// it goes through the following steps:-
	// i.) read level definition from json file and parse into "levelData" object.
	// ii.) load textures required for level in levelData.textures held in levels/textures dir
	// iii.) create materials required for level in levelData.materials
	// iv.) create scene objects for level in levelData.sceneObjects
	
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
				var textures = A2B.loadTextures("levels/textures/",levelData.textures, onTexturesLoaded);
			}		
		} catch ( error ) {

			console.error( error );
			alert(error);

		}
	}

	var onTexturesLoaded = function(textures) {
		// create materials
		var materials = A2B.createMaterials(levelData.materials, textures);
		var levelScene = A2B.LevelController.createLevelScene(levelData,materials);
		onLevelInitialised(levelScene);	
	}

	var onLevelError = function(errorDesc) {
		alert(errorDesc);
		console.error(errorDesc);
	}

	

	A2B.LevelController.loadLevel(LEVEL_PATH,levelNum, onLevelLoaded, onLevelError);
	
	
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
