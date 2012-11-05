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

A2B.LevelController.createFloors = function(scene,floorsToCreate,materials) {

	// floorsToCreate is a list of objects in the following format
	/*
	  
	"floors" :
				  	[
				  		{ 
				  			"name" 			: "main_floor",
				  			"material" 		: "ground_material",
				  			"dimensions"		: [20,1,20],
				  			"position"		: [0,0,0],
							"mass" 		: 0
				  		},
				  		{ 
				  			"name" 			: "floor_2",
				  			"material" 		: "rock_material",
				  			"dimensions"		: [5,1,5],
				  			"position"		: [10,10,0],
							"mass" 		: 0
				  		}
				  	]
	  
	  		
	  	
	  }
	 */


	// iterate through a list of floors to create
	var len=floorsToCreate.length;

	for(var i=0; i<len; i++) {
		var floorToCreate = floorsToCreate[i];
		
		var material = materials[floorToCreate.material];
			if(material==undefined){
				alert("Material:" + floorToCreate.material + " is not found.");
			}
		
		// add create floor bit here...
		var floor = new Physijs.BoxMesh(new THREE.CubeGeometry(floorToCreate.dimensions.x,floorToCreate.dimensions.y,floorToCreate.dimensions.z), material, floorToCreate.mass);
		var positionVector = new THREE.Vector3(floorToCreate.position.x,floorToCreate.position.y,floorToCreate.position.z);
		var rotationVector = new THREE.Vector3(floorToCreate.rotation.x,floorToCreate.rotation.y,floorToCreate.rotation.z);
		//floor.position = floorToCreate.position;
		floor.position = positionVector;
		floor.rotation = rotationVector;
		floor.receiveShadow = true;
		
		// add to scene
		scene.add(floor);
			
	}



}

A2B.LevelController.createLevelScene = function(levelData,materials) {
	// This method will create a new scene object from the level data and return it
	var scene = A2B.createEmptyScene();
	
	// parse the data in the levelData an add the appropriate objects to the scene
	
	// dummy setup for now
	
	//this.materials = A2B.initMaterials('images');

	//var ground_material = materials["rock_material"];

	//var floor = new Physijs.BoxMesh(new THREE.CubeGeometry(20, 1, 20), ground_material, 0 // mass
	//);
	//floor.receiveShadow = true;
	//scene.add(floor);
	
	A2B.LevelController.createFloors(scene,levelData.floors,materials);
	
	// add spotlight to scene
	var spotLight = A2B.getSpotLight();
	spotLight.position.set(20, 40, -15);
	spotLight.target.position.copy(scene.position);
	scene.add( spotLight );


	
	
	return scene; 
};

A2B.LevelController.initLevel = function(levelNum, onLevelInitialised) {
	// this method initialises a level from the json file describing the level.
	// it goes through the following steps:-
	// i.) read level definition from json file and parse into "levelData" object.
	// ii.) load textures required for level in levelData.textures held in levels/textures dir
	// iii.) create materials required for level in levelData.materials
	// iv.) create scene objects for level in levelData.sceneObjects
	
	var scope = this;
	
	var currentLevelData = null;
	
	var onLevelLoaded = function(levelData) {
		//scope.levelData = levelData;
		currentLevelData = levelData;
		var textures = A2B.loadTextures("levels/textures/",currentLevelData.textures, onTexturesLoaded);
	}

	var onTexturesLoaded = function(textures) {
		// create materials
		var materials = A2B.createMaterials(currentLevelData.materials, textures);
		var levelScene = A2B.LevelController.createLevelScene(currentLevelData,materials);
		onLevelInitialised(levelScene);	
	}

//	var onMaterialsCreated = function(textures) {
//		var levelScene = scope.createLevelScene(levelData);
//		onLevelInitialised(levelScene);	
//	}

	var onLevelError = function(errorDesc) {
		alert(errorDesc);
		console.error(errorDesc);
	}

	

	A2B.LevelController.loadLevel(LEVEL_PATH,levelNum, onLevelLoaded, onLevelError);
	
	
}


A2B.Game.saveLevelToFile = function(path, levelName) {
}
