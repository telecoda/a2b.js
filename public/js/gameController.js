'use strict';
/** @namespace */
var A2B = A2B || {};

var INTERSECTED;

var gameModel, gameView;

// constants

var LEVEL_PATH = "levelData/";
var MENU_PATH = "menuData/";

var START_FROM_LEVEL = 1;

var TOTAL_LEVELS = 6;

// scene object names
var MAIN_SPHERE = "mainSphere";
var START_BLOCK = "startBlock";
var END_BLOCK = "endBlock";

A2B.GameController = function() {
};

A2B.GameController.createCameraControls = function(camera, position, lookAtPosition) {

	var cameraControls = new THREE.TrackballControls(camera);

	if (lookAtPosition == undefined) {
		cameraControls.target.set(0, 0, 0);
	} else {
		cameraControls.object.position.copy(position);
		cameraControls.target = lookAtPosition;
	}
	return cameraControls;
};

A2B.GameController.createGameController = function(displayGraphicStats, displayGameStats) {

	/*
	 * This method initialises the capabilities of the game controller to look after the game
	 * Set up UI and initial event handlers
	 */
	var gameController = {};

	//gameModel = A2B.GameModel.createGameModel();
	gameModel = new A2B.GameModel();

	gameView = A2B.GameView.createGameView(displayGameStats, displayGraphicStats);

	gameController.cameraControls = A2B.GameController.createCameraControls(gameView.camera);

	A2B.GameController.initWindowResize();
	A2B.GameController.initScreenshotCapability();
	A2B.GameController.initFullscreenCapability();
	gameController.mouse = A2B.GameController.initMouseMoveListener();

	A2B.GameController._currentEventListener = null;

	A2B.GameController.startMainMenu();

	A2B.GameController.startRenderCallback();

	return gameController;
}

A2B.GameController.initFullscreenCapability = function() {

	// allow 'f' to go fullscreen where this feature is supported
	if (THREEx.FullScreen.available()) {
		THREEx.FullScreen.bindKey();
		//document.getElementById('inlineDoc').innerHTML += "- <i>f</i> for fullscreen";
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
		setTimeout(onActionCallback, 1000);

	}
	if (heading === undefined) {
		heading = "heading";
	}
	if (subHeading === undefined) {
		subHeading = "subHeading";
	}
	if (paragraph === undefined) {
		paragraph = "paragraph";
	}
	if (actionButtonText === undefined) {
		actionButtonText = "actionButtonText";
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
		
		if(LEVEL_RUNNING_MODE == gameModel.mode) {
		
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

	gameModel.mode = GAME_COMPLETED_MODE;

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

	A2B.GameController.stopLevelTimer();
	
	gameModel.mode = LEVEL_COMPLETED_MODE;

	var onActionButton2 = function(event) {
		// do stuff here after click "Next" button on end of level dialog

		console.log("onLevelCompleted action clicked");

		// check for final level
		if (gameModel.levelNum === TOTAL_LEVELS) {
			// game completed
			A2B.GameController.onGameCompleted();
		} else {
			// move to next level
			gameModel.levelNum++;
			A2B.GameController.startNewLevel();
		}

	}
	var heading = "Congratulations!";
	var subHeading = "Name:" + gameModel.currentLevel.levelData.name + " completed.";
	var paragraph = gameModel.currentLevel.levelData.completedMessage || "Well done.";
	var actionButtonText = "Next";

	A2B.GameController.initStatusDialog(onActionButton2, heading, subHeading, paragraph, actionButtonText);

	console.log("onLevelCompleted ended");

};

A2B.GameController.onLevelInitialised = function(levelModel) {
	// this function is called when a new scene has been initialised

	gameModel.mode = LEVEL_INTRO_MODE;

	gameModel.setCurrentLevel(levelModel);
	
	// replace current scene with new level
	gameView.setSceneToRender(gameModel.currentLevel.scene);
		
	// position camera
	gameController.cameraControls = A2B.GameController.createCameraControls(gameView.camera, levelModel.levelData.camera.position, levelModel.levelData.camera.lookAtPosition);

	// set active sphere
	gameModel.currentLevel.setActiveSphere(gameModel.currentLevel.getMainSphere());

	// set up key bindings
	A2B.GameController._currentEventListener = A2B.GameController.levelRunningBindKeys(A2B.GameView.renderer);

	// display start of level dialog
	var onActionButton2 = function(event) {
		// do stuff here after click "play" button on level info box
		// perhaps start level timer?
		A2B.GameController.startLevelTimer();
		
		gameModel.mode = LEVEL_RUNNING_MODE;		

	}
	var heading = "Level:" + gameModel.levelNum;
	var subHeading = "Name:" + levelModel.levelData.name;
	var paragraph = levelModel.levelData.objective;
	var actionButtonText = "Play";

	A2B.GameController.initStatusDialog(onActionButton2, heading, subHeading, paragraph, actionButtonText);

}

A2B.GameController.startLevelTimer = function() {
	//
	if (gameModel.timerRunning) {
		console.log("ERROR: level timer already running...");
	} else {
		gameModel.timerRunning = true;
		setTimeout(A2B.GameController.updateLevelTimer, 1000);
	}
};

A2B.GameController.updateLevelTimer = function() {
	
	if(gameModel.timerRunning) {
		// decrease timer by 1 second
		gameModel.timeRemaining--;
	
		// check for end of time
		if (gameModel.timeRemaining > 0) {
			// submit again
			setTimeout(A2B.GameController.updateLevelTimer, 1000);
		} else {
			A2B.GameController.stopLevelTimer();
			A2B.GameController.onLevelTimeExpired();
		}
		
	}
};


A2B.GameController.onLevelTimeExpired = function() {

	// time up dialog
	
	gameModel.mode = PLAYER_TIMEUP_MODE;

	A2B.GameController.stopLevelTimer();
	gameModel.decreaseLives();

	// the player has run out of time
	var onActionButton = function(event) {
		// do stuff here after clicking "Next"
		console.log("onLevelTimeExpired action clicked");

		if (gameModel.lives > 0) {
			// restart level
			A2B.GameController.startNewLevel();
		} else {
			// game over
			A2B.GameController.onGameOver();
		}
	}
	var heading = "Time Up!";
	var subHeading = "You have run out of time:";
	
	var lifeText = " lives ";
	if (gameModel.lives == 1) {
		lifeText=" life ";
	}
	var paragraph = "That has cost you one of your lives. You have " + gameModel.lives + lifeText +" remaining. Try to be a little faster next time..";
	var actionButtonText = "Next";
	A2B.GameController.initStatusDialog(onActionButton, heading, subHeading, paragraph, actionButtonText);

};

A2B.GameController.onGameOver = function() {

	// game over dialog
	gameModel.mode = GAME_OVER_MODE;

	// the player has lost all their lives
	var onActionButton = function(event) {
		// do stuff here after clicking "Next" button
		console.log("onGameOver action clicked");

		A2B.GameController.startMainMenu();
	}
	var heading = "Game Over!";
	var subHeading = "You have lost all your lives:";
	var paragraph = "Bad luck you just weren't good enough...";
	var actionButtonText = "Next";
	A2B.GameController.initStatusDialog(onActionButton, heading, subHeading, paragraph, actionButtonText);

};


A2B.GameController.stopLevelTimer = function() {
	//
	gameModel.timerRunning = false;
	
};

A2B.GameController.onPlayerDied = function() {
	
	gameModel.mode = PLAYER_DIED_MODE;

	// this player has died
	A2B.GameController.stopLevelTimer();
	gameModel.decreaseLives();

	// the player has died
	var onActionButton = function(event) {
		// do stuff here after clicking "Next"
		console.log("onPlayerDied action clicked");

		if (gameModel.lives > 0) {
			// restart level
			A2B.GameController.startNewLevel();
		} else {
			// game over
			A2B.GameController.onGameOver();
		}
	}
	var heading = "Arrrggghhhhh!";
	var subHeading = "You have died:";
	var lifeText = " lives ";
	
	if (gameModel.lives == 1) {
		lifeText=" life ";
	}

	var paragraph = "You must not fall off the platforms. You have " + gameModel.lives + lifeText +"remaining. Try to stay on the platforms next time..";
	var actionButtonText = "Next";
	A2B.GameController.initStatusDialog(onActionButton, heading, subHeading, paragraph, actionButtonText);
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
	gameModel = new A2B.GameModel();
	
	// display game hud
	$("#game-hud").removeClass("hide");
	$("#editing-menu").addClass("hide");

	A2B.GameController.startNewLevel();

}

A2B.GameController.startMainMenu = function() {

	// load details of the main menu
	var menuScene = A2B.MenuController.initMenuData("mainMenu", A2B.GameController.onMenuInitialised);

}

A2B.GameController.onMenuInitialised = function(menuScene) {
	// this function is called when the menu scene has been initialised

	gameModel.mode = MAIN_MENU_MODE;
	// replace current scene with new scene
	gameView.scene = menuScene;

	gameView.camera = A2B.GameView.createCamera();
	gameView.scene.add(gameView.camera);
	// position camera
	gameView.camera.lookAt(gameView.scene.position);

	gameController.cameraControls = A2B.GameController.createCameraControls(gameView.camera);

	A2B.MenuController.initMainMenuDialog();
}

A2B.GameController.startNewLevel = function() {

	// load details of the level
	gameModel.mode = LEVEL_INTRO_MODE;

	A2B.LevelController.initLevel(gameModel.levelNum, A2B.GameController.onLevelInitialised, A2B.GameController.onLevelCompleted, A2B.GameController.onPlayerDied);

}

A2B.GameController.startRenderCallback = function() {

	var render = function() {

		// update camera controls
		gameController.cameraControls.update();

		A2B.GameController.checkMouseCollision();

		if(gameModel.mode == LEVEL_RUNNING_MODE) {
			// check falling ball
			A2B.GameController.checkFallingBall();
		}

		// do not update physics when editing a leve
		if(gameModel.mode != LEVEL_EDIT_MODE) {
			gameView.scene.simulate(undefined, 2);
		}
		requestAnimationFrame(render);
		gameView.renderer.render(gameView.scene, gameView.camera);

		// update side-bar
		A2B.GameController.updateSidebar();

		if (gameView.graphicStats != undefined) {
			gameView.graphicStats.update();
		}

		if (gameView.gameStats != undefined) {
			gameView.gameStats.update(gameModel, gameView, gameController);
		}

	};
	requestAnimationFrame(render);

};


A2B.GameController.checkFallingBall = function() {
	// this method checks if a ball has fallen below a certain threshold
	// for the level data.  If so the player dies
	
	if(gameModel.currentLevel) {
		if(gameModel.currentLevel.activeSphere.position.y < gameModel.currentLevel.levelData.minimumBallHeight) {
		// 
		A2B.GameController.onPlayerDied();
		}
	}
}

A2B.GameController.checkMouseCollision = function() {
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

}

A2B.GameController.updateSidebar = function() {

	// update HUD
	if (gameModel.currentLevel) {
		$("#panel-level-name").text(gameModel.currentLevel.levelData.name);
		$("#panel-lives").text(gameModel.lives);
		$("#panel-score").text(gameModel.score);
		$("#panel-time-remaining").text(gameModel.timeRemaining + ' seconds');
	}
};
