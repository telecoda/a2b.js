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

var mouse;
var INTERSECTED;

// constants

var LEVEL_PATH = "levelData/";
var MENU_PATH = "menuData/";

A2B.GameController = function() {
};

A2B.GameController.prototype.initGameController = function(displayGraphicStats, displayGameStats) {

/*
 * This method initialises the capabilities of the game controller to look after the game
 * Set up UI and initial event handlers
 */

	this._displayGraphicStats = displayGraphicStats;
	this._displayGameStats = displayGameStats;

	this.initRenderer();
	this.initScene();
	this.initCameraForScene(this.scene);
	this.initCameraControls(this.camera);
	this.initProjector();

	this.initWindowResize();
	this.initScreenshotCapability();
	this.initFullscreenCapability();
	mouse = this.initMouseMoveListener();
	
	
	//var woodMaterial = this.materials['wood'];
	//this.player = new A2B.Player(woodMaterial);
	this._currentEventListener = null;

	if (this._displayGraphicStats) {
		// graphic stats
		this.initGraphicStats();
	}

	if (this._displayGameStats) {
		// game stats
		this.initGameStats();
	}

	this.startMainMenu();
	//this.changeMode(MAINMENU_MODE);

	this.startRenderCallback();

}
/*
 * Adds player to a different location dependent on level (only one level now..)
 */
A2B.GameController.prototype.addPlayerToScene = function(player, levelNumber) {
	this.player = player;
	this.scene.add(player.getMesh());
}

/*
 * change current mode
 */
A2B.GameController.prototype.changeMode = function(newMode) {
	// teardown previous mode
	if (this._currentMode != undefined) {
		this.teardownMode(); 
	}
	// set up new mode
	this._currentMode = newMode;
	this.setupMode();
}

A2B.GameController.prototype.getLives = function() {
	return this.lives;
}

A2B.GameController.prototype.getMousePosition = function() {
	return mouse;
}

A2B.GameController.prototype.getScore = function() {
	return this.score;
}

A2B.GameController.prototype.initCameraForScene = function(scene) {

	var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);

	camera.position.set(0, 50, 120);

	this.camera = camera;

	// position camera
	this.camera.lookAt(scene.position);
	// add camera to scene
	scene.add(this.camera);

};

A2B.GameController.prototype.initCameraControls = function(camera) {

	var cameraControls = new THREE.TrackballControls(camera);

	cameraControls.target.set(0, 0, 0);

	this.cameraControls = cameraControls;
};

A2B.GameController.prototype.initFullscreenCapability = function() {

	// allow 'f' to go fullscreen where this feature is supported
	if (THREEx.FullScreen.available()) {
		THREEx.FullScreen.bindKey();
		document.getElementById('inlineDoc').innerHTML += "- <i>f</i> for fullscreen";
	}

};

A2B.GameController.prototype.initGameStats = function() {

	var gameStats = new GameStats();
	gameStats.domElement.style.position = 'absolute';
	gameStats.domElement.style.top = '0px';
	gameStats.domElement.style.right = '0px';
	gameStats.domElement.style.zIndex = 100;
	document.getElementById('viewport').appendChild(gameStats.domElement);

	this.gameStats = gameStats;

};

A2B.GameController.prototype.initGraphicStats = function() {

	var stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	document.getElementById('viewport').appendChild(stats.domElement);

	this.graphicStats = stats;

};

A2B.GameController.prototype.initMouseMoveListener = function() {

	var mouse = {
		x : 0,
		y : 0
	};
	this.renderer.domElement.addEventListener('mousemove', this.setMousePosition);
	return mouse;
};

A2B.GameController.prototype.initProjector = function() {

	var projector = new THREE.Projector;

	this["projector"] = projector;

}

A2B.GameController.prototype.initRenderer = function() {

	var renderer = new THREE.WebGLRenderer({
		antialias : true, // to get smoother output
		preserveDrawingBuffer : true	// to allow screenshot
	});
	renderer.setClearColorHex(0xBBBBBB, 1);

	renderer.setSize(window.innerWidth, window.innerHeight);
	// ground does not appear with shadows enabled?
	// can we check card capabilities?

	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	document.getElementById('viewport').appendChild(renderer.domElement);

	this.renderer = renderer;

};

A2B.GameController.prototype.initScene = function() {

	this.scene = A2B.Graphics.createEmptyScene();
}

A2B.GameController.prototype.initScreenshotCapability = function() {

	// allow 'p' to make screenshot
	THREEx.Screenshot.bindKey(this.renderer);

};

A2B.GameController.prototype.initWindowResize = function() {

	// transparently support window resize
	THREEx.WindowResize.bind(this.renderer, this.camera);

};

/**
 * Bind a keys for running level
 */
A2B.GameController.prototype.levelRunningBindKeys = function(opts) {
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
				this.player.moveBackwards(this.camera.position);
				break;
			case upKey:
				this.player.moveForwards(this.camera.position);
				break;
			case leftKey:
				this.player.moveLeft(this.camera.position);
				break;
			case rightKey:
				this.player.moveRight(this.camera.position);
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
A2B.GameController.prototype.mainMenuModeBindKeys = function(opts) {
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
				this.startNewGame();
				//this.changeMode(LEVEL_RUNNING_MODE);
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
A2B.GameController.prototype.setupMode = function() {
	switch(this._currentMode) {
		case MAINMENU_MODE:
			//this.mainMenuModeInitScene(this.scene);
			this._currentEventListener = this.mainMenuModeBindKeys();
			break;
		case LEVEL_RUNNING_MODE:
			// load new level
			//this.levelRunningInitScene(this.scene, this._level);
			this._currentEventListener = this.levelRunningBindKeys(this.renderer);
			this.playerMesh = this.addPlayerToScene(this.player, this._level);
			break;

	}
	/*
	 this.playerMesh = this.addPlayerToScene(this._level,this.scene);
	 this.bindKeys(this._renderer);
	 */

}

A2B.GameController.prototype.setMousePosition = function(event) {
	// Find where mouse cursor intersects the ground plane
	mouse.x = (event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight ) * 2 + 1;

};

/*
 * This method is called when a new game starts
 */
A2B.GameController.prototype.startNewGame = function() {
	// init variables for a new game
	this.levelNum = 1;
	this.lives = 3;
	this.score = 0;

	this.startNewLevel();

	//this.changeMode(LEVEL_RUNNING_MODE);

}

A2B.GameController.prototype.startMainMenu = function() {

	var scope = this;

	var onMenuInitialised = function(menuScene) {
		// this function is called when the menu scene has been initialised

		// replace current scene with new scene
		scope.scene = menuScene;

		scope.initCameraForScene(scope.scene);

		scope.initCameraControls(scope.camera);

		// change to level running
		//A2B.MenuController.mainMenuModeInitScene(scope.scene);
		scope._currentEventListener = scope.mainMenuModeBindKeys();

	}
	// load details of the main menu
	var menuScene = A2B.MenuController.initMenu("mainMenu", onMenuInitialised);

}

A2B.GameController.prototype.startNewLevel = function() {

	var scope = this;

	var onLevelInitialised = function(levelScene) {
		// this function is called when a new scene has been initialised

		// replace current scene with new level
		scope.scene = levelScene;

		scope.initCameraForScene(scope.scene);

		scope.initCameraControls(scope.camera);

		// change to level running
		scope.changeMode(LEVEL_RUNNING_MODE);

	}
	// load details of the level
	A2B.LevelController.initLevel(this.levelNum, onLevelInitialised);

}

A2B.GameController.prototype.startRenderCallback = function() {
	
	var scope = this;	
	
	var render = function() {

		// update camera controls
		scope.cameraControls.update();
	
		// check for intersects
		var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
		scope.projector.unprojectVector(vector, scope.camera);
	
		var ray = new THREE.Ray(scope.camera.position, vector.subSelf(scope.camera.position).normalize());
	
		var intersects = ray.intersectObjects(scope.scene.children);
	
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
	
		scope.scene.simulate(undefined, 2);
		requestAnimationFrame(render);
		scope.renderer.render(scope.scene, scope.camera);
		scope.graphicStats.update();
		scope.gameStats.update();
	};
	requestAnimationFrame(render);


};
/*
 This function will tidys up anything for current mode
 */
A2B.GameController.prototype.teardownMode = function() {
	this._currentEventListener.unbind();
	//this.scene.remove();
	//this.clearSceneObjects(this.scene);

	switch(this._currentMode) {
		case MAINMENU_MODE:
			//this.mainMenuModeUnbindKeys();
			break;
		case LEVEL_RUNNING_MODE:
			//this.levelRunningUnbindKeys();
			break;

	}
}

