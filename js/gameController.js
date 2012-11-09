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
	gameController = {};

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
/*
 * Adds player to a different location dependent on level (only one level now..)
 */
A2B.GameController.addPlayerToScene = function(player, levelNumber) {
	A2B.GameController.player = player;
	A2B.GameController.scene.add(player.getMesh());
}

/*
 * change current mode
 */
A2B.GameController.changeMode = function(newMode) {
	// teardown previous mode
	if (A2B.GameController._currentMode != undefined) {
		A2B.GameController.teardownMode(); 
	}
	// set up new mode
	A2B.GameController._currentMode = newMode;
	A2B.GameController.setupMode();
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
				A2B.GameController.player.moveBackwards(gameView.camera.position);
				break;
			case upKey:
				A2B.GameController.player.moveForwards(gameView.camera.position);
				break;
			case leftKey:
				A2B.GameController.player.moveLeft(gameView.camera.position);
				break;
			case rightKey:
				A2B.GameController.player.moveRight(gameView.camera.position);
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

/**
 * Bind a keys for main menu
 */
A2B.GameController.mainMenuModeBindKeys = function(opts) {
	opts = opts || {};
	var goKey = opts.charCode || 'g'.charCodeAt(0);
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
			case goKey:
				// if here game should start
				A2B.GameController.startNewGame();
				//A2B.GameController.changeMode(LEVEL_RUNNING_MODE);
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



/*
 This function will initialise the scene and controls for the current mode
 */
A2B.GameController.setupMode = function() {
	switch(A2B.GameController._currentMode) {
		case MAINMENU_MODE:
			//A2B.GameController.mainMenuModeInitScene(A2B.GameController.scene);
			A2B.GameController._currentEventListener = A2B.GameController.mainMenuModeBindKeys();
			break;
		case LEVEL_RUNNING_MODE:
			// load new level
			//A2B.GameController.levelRunningInitScene(A2B.GameController.scene, A2B.GameController._level);
			A2B.GameController._currentEventListener = A2B.GameController.levelRunningBindKeys(A2B.GameView.renderer);
			A2B.GameController.playerMesh = A2B.GameController.addPlayerToScene(gameModel.player, gameModel.level);
			break;

	}
	/*
	 A2B.GameController.playerMesh = A2B.GameController.addPlayerToScene(A2B.GameController._level,A2B.GameController.scene);
	 A2B.GameController.bindKeys(A2B.GameController._renderer);
	 */

}

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

		// change to level running
		//A2B.MenuController.mainMenuModeInitScene(scope.scene);
		gameView._currentEventListener = A2B.GameController.mainMenuModeBindKeys();

	}
	// load details of the main menu
	var menuScene = A2B.MenuController.initMenu("mainMenu", onMenuInitialised);

}

A2B.GameController.startNewLevel = function() {

	
	var onLevelInitialised = function(levelScene) {
		// this function is called when a new scene has been initialised

		// replace current scene with new level
		gameView.scene = levelScene;

		gameView.camera = A2B.GameView.createCamera();
		gameView.scene.add(gameView.camera);
		// position camera
		gameView.camera.lookAt(gameView.scene.position);

		gameController.cameraControls = A2B.GameController.createCameraControls(gameView.camera);

		// change to level running
		A2B.GameController.changeMode(LEVEL_RUNNING_MODE);

	}
	// load details of the level
	A2B.LevelController.initLevel(gameModel.levelNum, onLevelInitialised);

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
/*
 This function will tidys up anything for current mode
 */
A2B.GameController.teardownMode = function() {
	A2B.GameController._currentEventListener.unbind();
	//A2B.GameController.scene.remove();
	//A2B.GameController.clearSceneObjects(A2B.GameController.scene);

	switch(A2B.GameController._currentMode) {
		case MAINMENU_MODE:
			//A2B.GameController.mainMenuModeUnbindKeys();
			break;
		case LEVEL_RUNNING_MODE:
			//A2B.GameController.levelRunningUnbindKeys();
			break;

	}
}

