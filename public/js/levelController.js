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

A2B.LevelController.startLevelEditor = function() {
	
	// init variables for a new game
	gameModel = new A2B.GameModel();
	
	gameModel.mode = LEVEL_EDIT_MODE;
	
	// display editing menu
	$("#editing-menu").removeClass("hide");
	$("#game-hud").addClass("hide");

	// bind click handlers
	$("#new-level-button").click(A2B.LevelController.createNewLevel);
	$("#load-level-button").click(A2B.LevelController.loadLevel);
	$("#save-level-button").click(A2B.LevelController.saveLevel);

	
}

A2B.LevelController.createNewLevel = function() {
	
	// selected from menu
	alert("Create new level selected!");
}

A2B.LevelController.loadLevel = function() {
	
	// selected from menu
	// load details of the level
	A2B.LevelController.initLevel(gameModel.levelNum, A2B.LevelController.onLevelToEditLoaded, null,null);

}

A2B.LevelController.saveLevel = function() {
	
	// display JSON to save to file in a dialog box
	// selected from menu
	A2B.LevelController.initSaveDialog();
}

A2B.LevelController.initSaveDialog = function(onActionCallback) {

	var onActionClick = function(event) {
		console.log("saveLevelDialog.onActionClick method");
		$("#saveLevelDialogBox").modal('hide');
		// delay action callback to allow previous fade in/out to complete cleanly
		setTimeout(onActionCallback, 1000);

	}
	
	//levelModel.levelData = JSON.parse(levelJSONData );
	
	var jsonData = JSON.stringify(gameModel.currentLevel.levelData);
	$("#saveLevelJSONData").text(jsonData);
	$("#saveLevelDialogBox").modal("show");

};

A2B.LevelController.onLevelToEditLoaded = function(levelModel) {

	gameModel.setCurrentLevel(levelModel);
	
	// replace current scene with new level
	gameView.setSceneToRender(gameModel.currentLevel.scene);
	
	// position camera
	gameController.cameraControls = A2B.GameController.createCameraControls(gameView.camera, levelModel.levelData.camera.position, levelModel.levelData.camera.lookAtPosition);

	A2B.LevelController.bindLevelDataToEditorUI(gameModel.currentLevel.levelData);
	
}

A2B.LevelController.bindLevelDataToEditorUI = function(levelData) {
	
	// Level details
	$("#edit-level-name").val(levelData.name);
	$("#edit-level-author").val(levelData.author);
	$("#edit-level-objective").val(levelData.objective);
	$("#edit-level-completedMessage").val(levelData.completedMessage);
	$("#edit-level-timeLimit").val(levelData.timeLimit);
	$("#edit-level-minimumBallHeight").val(levelData.minimumBallHeight);
	
	// Texture data
	
	A2B.LevelController.bindTexturesToUI(levelData.textures);
	
	
};

A2B.LevelController.bindTexturesToUI = function(textures) {
	$("#edit-textures-list").empty();
	
	var listHTML = "<ul class=\"unstyled\">";
	
	
	for(var i=0;i<textures.length;i++) {
		var texture = textures[i];
		listHTML += "<li class=\"edit-item\">" + texture.name
			+ "<a class=\"delete-texture-button edit-button btn btn-small btn-primary pull-right\" href\"#\" id=\""+texture.id +"\" >delete</a>"
			+ "<a class=\"edit-texture-button edit-button btn btn-small btn-primary pull-right\" href\"#\" id=\""+texture.id +"\" >edit</a>"
			+ "</li>";
	}
	
	listHTML += "<li class=\"edit-item\">New texture->" 
	+ "<a class=\"add-texture-button edit-button btn btn-small btn-primary pull-right\" href\"#\" id=\"texture-xx\" >add</a>"
	+ "</li>";
	
	listHTML += "</ul>";
	
	$("#edit-textures-list").html(listHTML);	
	
	// bind callbacks to buttons
	$(".edit-texture-button").click(function () {
		//alert("edit clicked:"+this.id);
		A2B.LevelController.initTextureDialog(this.id);
	});

	$(".delete-texture-button").click(function () {
		alert("delete clicked:"+this.id);
	});

	$(".add-texture-button").click(function () {
		alert("add clicked:"+this.id);
	});

	
}; 

A2B.LevelController.initTextureDialog = function(textureId) {

	$("#editTextureDialogSaveButton").click(function () {
		// save new details
		$("#editTextureDialogBox").hide();
	
	});

	$("#editTextureDialogCloseButton").click(function () {
	
		$("#editTextureDialogBox").hide();
	
	});

	$("#editTextureDialogBox").show();
	
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

	// textures
	if(levelData.textures==undefined) {
		// level must have textures
		errors[i++]="Level does not have any textures";
	}
	
	// textures must have id's
	if(levelData.textures) {
		// textures must be valid
		var len=levelData.textures.length;

		for(var i=0; i<len; i++) {
			var texture = levelData.textures[i];
			if(texture.id==undefined) {
				errors[i++]="Texture does not have id defined";
			}
		}
	
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
