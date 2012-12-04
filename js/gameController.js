'use strict';
/** @namespace */
var A2B = A2B || {};

// game modes
var ATTRACT_MODE = 1;
var MAINMENU_MODE = 2;
var LEVEL_INTRO_MODE = 3;
var LEVEL_RUNNING_MODE = 4;
var LEVEL_COMPLETE_MODE = 5;
var GAME_OVER_MODE = 6;
var GAME_COMPLETE_MODE = 7;
var ENTER_HIGHSCORE_MODE = 8;
var DISPLAY_CREDITS_MODE = 9;
var DISPLAY_HIGHSCORES_MODE = 10;

var INTERSECTED;

var gameModel, gameView;

// constants

var LEVEL_PATH = "levelData/";
var MENU_PATH = "menuData/";

var TOTAL_LEVELS = 1;

// scene object names
var MAIN_SPHERE = "mainSphere";
var START_BLOCK = "startBlock";
var END_BLOCK = "endBlock";

A2B.GameController = function() {
};

A2B.GameController.createCameraControls = function(camera) {

	var cameraControls = new THREE.TrackballControls(camera);

	cameraControls.target.set(0, 0, 0);

	return cameraControls;
};


A2B.GameController.createGameController = function(displayGraphicStats, displayGameStats) {

/*
 * This method initialises the capabilities of the game controller to look after the game
 * Set up UI and initial event handlers
 */
	var gameController = {};

	gameModel = A2B.GameModel.createGameModel();

	gameView = A2B.GameView.createGameView(displayGameStats, displayGraphicStats);
	
	gameController.cameraControls =A2B.GameController.createCameraControls(gameView.camera);

	A2B.GameController.initWindowResize();
	A2B.GameController.initScreenshotCapability();
	A2B.GameController.initFullscreenCapability();
	gameController.mouse = A2B.GameController.initMouseMoveListener();
	
	
	//var woodMaterial = A2B.GameController.materials['wood'];
	//A2B.GameController.player = new A2B.Player(woodMaterial);
	A2B.GameController._currentEventListener = null;


	A2B.GameController.startMainMenu();
	//A2B.GameController.changeMode(MAINMENU_MODE);

	A2B.GameController.startRenderCallback();
	

	return gameController;
}


A2B.GameController.getLives = function() {
	return A2B.GameController.lives;
}


A2B.GameController.initFullscreenCapability = function() {

	// allow 'f' to go fullscreen where this feature is supported
	if (THREEx.FullScreen.available()) {
		THREEx.FullScreen.bindKey();
		document.getElementById('inlineDoc').innerHTML += "- <i>f</i> for fullscreen";
	}

};


A2B.GameController.initMouseMoveListener = function() {

	var mouse = {
		x : 0,
		y : 0
	};
	gameView.renderer.domElement.addEventListener('mousemove', A2B.GameController.setMousePosition);
	return mouse;
};


A2B.GameController.initScreenshotCapability = function() {

	// allow 'p' to make screenshot
	THREEx.Screenshot.bindKey(A2B.GameView.renderer);

};

A2B.GameController.initStatusDialog = function(onActionCallback, heading, subHeading, paragraph, actionButtonText) {

	var onActionClick = function(event) {
	    console.log("initStatusDiaload.onActionClick method");
		$("#statusDialogBox").modal('hide');
		// delay action callback to allow previous fade in/out to complete cleanly
		setTimeout(onActionCallback,1000);

	}
			
	if(heading===undefined) {
		heading="heading";
	}
	if(subHeading===undefined) {
		subHeading="subHeading"; 
	}
	if(paragraph===undefined) {
		paragraph="paragraph";
	}
	if(actionButtonText===undefined) {
		actionButtonText="actionButtonText";
	}
	$("#statusDialogHeading").text(heading); 
	$("#statusDialogSubHeading").text(subHeading);
	$("#statusDialogParagraph").text(paragraph); 
	$("#statusDialogActionButton").text(actionButtonText); 
	$("#statusDialogActionButton").unbind('click');
	$("#statusDialogActionButton").click(onActionClick);
    $("#statusDialogBox").modal("show");	
	
};

A2B.GameController.initWindowResize = function() {

	// transparently support window resize
	THREEx.WindowResize.bind(A2B.GameView.renderer, gameView.camera);

};

/**
 * Bind a keys for running level
 */
A2B.GameController.levelRunningBindKeys = function(opts) {
	opts = opts || {};
	var upKey = opts.charCode || 'w'.charCodeAt(0);
	var downKey = opts.charCode || 's'.charCodeAt(0);
	var leftKey = opts.charCode || 'a'.charCodeAt(0);
	var rightKey = opts.charCode || 'd'.charCodeAt(0);
	var dblclick = opts.dblclick !== undefined ? opts.dblclick : false;
	var element = opts.element

	// callback to handle keypress
	var __bind = function(fn, me) {
		return function() {
			return fn.apply(me, arguments);
		};
	};
	var onKeyPress = __bind(function(event) {
		// return now if the KeyPress isnt for the proper charCode
		switch(event.which) {
			case downKey:
				gameModel.currentLevel.moveBackwards(gameView.camera.position);
				break;
			case upKey:
				gameModel.currentLevel.moveForwards(gameView.camera.position);
				break;
			case leftKey:
				gameModel.currentLevel.moveLeft(gameView.camera.position);
				break;
			case rightKey:
				gameModel.currentLevel.moveRight(gameView.camera.position);
				break;

		}
		return;

	}, this);

	// listen to keypress
	// NOTE: for firefox it seems mandatory to listen to document directly
	document.addEventListener('keypress', onKeyPress, false);

	return {
		unbind : function() {
			document.removeEventListener('keypress', onKeyPress, false);
		}
	};
}

A2B.GameController.onGameCompleted = function() {
    console.log("onGameCompleted started");

	// the player has completed the game
	var onActionButton2 = function(event) {
	    // do stuff here after click "Next" button on end of game dialog
	    console.log("onGameCompleted action clicked");

		// return to main menu
	    
	    A2B.GameController.startMainMenu();
		}
		
	var heading = "Congratulations!";
	var subHeading = "You have finished the entire game";
	var paragraph = "You are officially awesome!!!";
	var actionButtonText = "End";
	
	
	A2B.GameController.initStatusDialog(onActionButton2, heading, subHeading, paragraph, actionButtonText);

    console.log("onGameCompleted completed");

};



A2B.GameController.onLevelCompleted = function() {
	// the player has reached the end block!
    console.log("onLevelCompleted started");

	var onActionButton2 = function(event) {
	    // do stuff here after click "Next" button on end of level dialog
		
	    console.log("onLevelCompleted action clicked");

		// check for final level
		if(gameModel.levelNum===TOTAL_LEVELS) {
			// game completed
			A2B.GameController.onGameCompleted();
		} else {
			// move to next level
			gameModel.levelNum++;
			A2B.GameController.startNewLevel();
		}
		
	}
	
	
	var heading = "Congratulations!";
	var subHeading = "Name:"+gameModel.currentLevel.levelData.name + " completed.";
	var paragraph = gameModel.currentLevel.levelData.completedMessage || "Well done.";
	var actionButtonText = "Next";
	
	
	A2B.GameController.initStatusDialog(onActionButton2, heading, subHeading, paragraph, actionButtonText);

	console.log("onLevelCompleted ended");

};

A2B.GameController.onLevelInitialised = function(levelModel) {
		// this function is called when a new scene has been initialised

		gameModel.currentLevel = levelModel;
		// replace current scene with new level
		gameView.scene = gameModel.currentLevel.scene;

		gameView.camera = A2B.GameView.createCamera();
		gameView.scene.add(gameView.camera);
		// position camera
		gameView.camera.lookAt(gameView.scene.position);

		gameController.cameraControls = A2B.GameController.createCameraControls(gameView.camera);

		// set active sphere
		gameModel.currentLevel.setActiveSphere(gameModel.currentLevel.getMainSphere());

		// set up key bindings
		A2B.GameController._currentEventListener = A2B.GameController.levelRunningBindKeys(A2B.GameView.renderer);
		
		// display start of level dialog
		var onActionButton2 = function(event) {
		    // do stuff here after click "play" button on level info box
			// perhaps start level timer?
			var string = "stuff";
		}
		
		var heading = "Level:" +gameModel.levelNum;
		var subHeading = "Name:"+levelModel.levelData.name;
		var paragraph = levelModel.levelData.objective;
		var actionButtonText = "Play";
		
		
		A2B.GameController.initStatusDialog(onActionButton2, heading, subHeading, paragraph, actionButtonText);
				
	}

A2B.GameController.onPlayerDied = function() {
		// this player has died
};


A2B.GameController.setMousePosition = function(event) {
	// Find where mouse cursor intersects the ground plane
	gameController.mouse.x = (event.clientX / window.innerWidth ) * 2 - 1;
	gameController.mouse.y = -(event.clientY / window.innerHeight ) * 2 + 1;

};

/*
 * This method is called when a new game starts
 */
A2B.GameController.startNewGame = function() {
	// init variables for a new game
	gameModel = new A2B.GameModel.createGameModel();

	A2B.GameController.startNewLevel();


}

A2B.GameController.startMainMenu = function() {


	var onMenuInitialised = function(menuScene) {
		// this function is called when the menu scene has been initialised

		// replace current scene with new scene
		gameView.scene = menuScene;

		gameView.camera = A2B.GameView.createCamera();
		gameView.scene.add(gameView.camera);
		// position camera
		gameView.camera.lookAt(gameView.scene.position);


		gameController.cameraControls = A2B.GameController.createCameraControls(gameView.camera);

		var onActionButton = function(event) {
		    console.log("onMenuInitialised.onActionButton method");
			A2B.GameController.startNewGame();
		}

		/*
		$("#startDialogHeading").text("Welcome to A2B"); 
		$("#startDialogSubHeading").text("Mission directive:");
		$("#startDialogParagraph").text("Get the ball from point A to point B. That's it!"); 
		$("#startDialogActionButton").text("Play"); 
		$("#startDialogBox").modal();    
		
		$("#startDialogActionButton").click(onActionButton);
		*/
		
		// display start game dialog
		
		var heading = "Welcome to A2B";
		var subHeading = "Mission directive:";
		var paragraph = "Get the ball from point A to point B. That's it!";
		var actionButtonText = "Play";
		A2B.GameController.initStatusDialog(onActionButton, heading, subHeading, paragraph, actionButtonText);

		
		//A2B.GameController.startNewGame();
		
		
		// change to level running
		//A2B.MenuController.mainMenuModeInitScene(scope.scene);
		//gameView._currentEventListener = A2B.GameController.mainMenuModeBindKeys();

	}
	// load details of the main menu
	var menuScene = A2B.MenuController.initMenu("mainMenu", onMenuInitialised);

}

A2B.GameController.startNewLevel = function() {

	// load details of the level
	A2B.LevelController.initLevel(gameModel.levelNum, A2B.GameController.onLevelInitialised, 
		A2B.GameController.onLevelCompleted, A2B.GameController.onPlayerDied);

}

A2B.GameController.startRenderCallback = function() {
	
	var render = function() {

		// update camera controls
		gameController.cameraControls.update();
	
		// check for intersects
		var vector = new THREE.Vector3(gameController.mouse.x, gameController.mouse.y, 1);
		gameView.projector.unprojectVector(vector, gameView.camera);
	
		var ray = new THREE.Ray(gameView.camera.position, vector.subSelf(gameView.camera.position).normalize());
	
		var intersects = ray.intersectObjects(gameView.scene.children);
	
		if (intersects.length > 0) {
	
			if (INTERSECTED != intersects[0].object) {
	
				if (INTERSECTED)
					INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
	
				INTERSECTED = intersects[0].object;
				INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
				INTERSECTED.material.emissive.setHex(0xff0000);
	
			}
	
		} else {
	
			if (INTERSECTED)
				INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
	
			INTERSECTED = null;
	
		}
	
		gameView.scene.simulate(undefined, 2);
		requestAnimationFrame(render);
		gameView.renderer.render(gameView.scene, gameView.camera);
		
		if(gameView.graphicStats != undefined) {
			gameView.graphicStats.update();	
		}
		
		if(gameView.gameStats != undefined) {
			gameView.gameStats.update(gameModel,gameView, gameController);	
		}
	};
	requestAnimationFrame(render);


};

