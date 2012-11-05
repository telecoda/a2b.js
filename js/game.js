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

var LEVEL_PATH = "levels/";

A2B.Game = function() {
};

A2B.Game.prototype.initGame = function(displayGraphicStats, displayGameStats) {

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

	this.materials = A2B.initMaterials('images');
	var woodMaterial = this.materials['wood'];
	this.player = new A2B.Player(woodMaterial);
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
A2B.Game.prototype.addPlayerToScene = function(player, levelNumber) {
	this.player = player;
	this.scene.add(player.getMesh());
}
/*
 A2B.Game.prototype.addWebUI = function()
 {

 return;

 // this adds the WebUI components of the game, ie. the non-webGL stuff
 // on game start display window over screen with info.
 var webUIDiv, background = [[16, 16, 48], [0, 255, 255]];
 webUIDiv = document.createElement("div");
 webUIDiv.style.cursor = "pointer";
 webUIDiv.style.width = "100px";
 webUIDiv.style.opacity = "0.9";
 webUIDiv.style.zIndex = "10001";
 innerDiv = document.createElement("div");
 innerDiv.style.textAlign =
 "left";
 innerDiv.style.lineHeight = "1.2em";
 innerDiv.style.backgroundColor = "rgb(0,0,0)";
 innerDiv.style.padding = "0 0 3px 3px";
 innerDiv.innerHTML = "info!";

 webUIDiv.appendChild(innerDiv);

 webUIDiv.style.position = 'absolute';
 webUIDiv.style.top = '0px';
 webUIDiv.style.zIndex = 500;
 document.getElementById( 'viewport' ).appendChild( webUIDiv );

 }
 */

/*
 * change current mode
 */
A2B.Game.prototype.changeMode = function(newMode) {
	// teardown previous mode
	if (this._currentMode != undefined) {
		this.teardownMode(); 
	}
	// set up new mode
	this._currentMode = newMode;
	this.setupMode();
}
/*
 * clear all objects from a scene, iterate through child objects
 */
A2B.Game.prototype.clearSceneObjects = function(sceneObject) {
	var children = sceneObject.children;
	for (var i = children.length - 1; i >= 0; i--) {
		var child = children[i];
		this.clearSceneObjects(child);
		sceneObject.remove(child);
	};
}

A2B.Game.prototype.getLives = function() {
	return this.lives;
}

A2B.Game.prototype.getMousePosition = function() {
	return mouse;
}

A2B.Game.prototype.getScore = function() {
	return this.score;
}

A2B.Game.prototype.initCameraForScene = function(scene) {

	var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);

	camera.position.set(0, 50, 120);

	this.camera = camera;

	// position camera
	this.camera.lookAt(scene.position);
	// add camera to scene
	scene.add(this.camera);

};

A2B.Game.prototype.initCameraControls = function(camera) {

	var cameraControls = new THREE.TrackballControls(camera);

	cameraControls.target.set(0, 0, 0);

	this.cameraControls = cameraControls;
};

A2B.Game.prototype.initFullscreenCapability = function() {

	// allow 'f' to go fullscreen where this feature is supported
	if (THREEx.FullScreen.available()) {
		THREEx.FullScreen.bindKey();
		document.getElementById('inlineDoc').innerHTML += "- <i>f</i> for fullscreen";
	}

};

A2B.Game.prototype.initGameStats = function() {

	var gameStats = new GameStats();
	gameStats.domElement.style.position = 'absolute';
	gameStats.domElement.style.top = '0px';
	gameStats.domElement.style.right = '0px';
	gameStats.domElement.style.zIndex = 100;
	document.getElementById('viewport').appendChild(gameStats.domElement);

	this.gameStats = gameStats;

};

A2B.Game.prototype.initGraphicStats = function() {

	var stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	document.getElementById('viewport').appendChild(stats.domElement);

	this.graphicStats = stats;

};

A2B.Game.prototype.initMouseMoveListener = function() {

	var mouse = {
		x : 0,
		y : 0
	};
	this.renderer.domElement.addEventListener('mousemove', this.setMousePosition);
	return mouse;
};

A2B.Game.prototype.initProjector = function() {

	var projector = new THREE.Projector;

	this["projector"] = projector;

}

A2B.Game.prototype.initRenderer = function() {

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

A2B.Game.prototype.initScene = function() {

	this.scene = A2B.createEmptyScene();
}

A2B.Game.prototype.initScreenshotCapability = function() {

	// allow 'p' to make screenshot
	THREEx.Screenshot.bindKey(this.renderer);

};

A2B.Game.prototype.initWindowResize = function() {

	// transparently support window resize
	THREEx.WindowResize.bind(this.renderer, this.camera);

};

/**
 * Bind a keys for running level
 */
A2B.Game.prototype.levelRunningBindKeys = function(opts) {
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
/*
 * Initialise object in scene for current level
 */
A2B.Game.prototype.levelRunningInitScene = function(currentScene, levelNumber) {
	// init level
	/* for now EVERYTHING is level 1 */

	// add ground for scene
	///////////////////
	// Create Ground //
	///////////////////

	var ground_material = this.materials["rock"];

	var floor = new Physijs.BoxMesh(new THREE.CubeGeometry(100, 1, 100), ground_material, 0 // mass
	);
	floor.receiveShadow = true;
	currentScene.add(floor);

	////////////////////////
	// Create Brick walls //
	////////////////////////

	// ground is 100 X 1000
	// build an inner wall

	var brick_material = this.materials["brick"];

	// front wall
	for (var i = 0; i < 18; i++) {
		var brick = new Physijs.BoxMesh(new THREE.CubeGeometry(4.5, 4.5, 4.5), brick_material, 5000);
		brick.position.set(-45 + (i * 5), 5 + i, 45);
		brick.rotation.set(0, 0, 0);

		brick.castShadow = true;
		brick.receiveShadow = true;

		currentScene.add(brick);
		//bricks.push( brick );
	}

	// right wall
	for (var i = 0; i < 18; i++) {
		var brick = new Physijs.BoxMesh(new THREE.CubeGeometry(4.5, 4.5, 4.5), brick_material, 5000);
		brick.position.set(45, 5 + i, 45 - (i * 5));
		brick.rotation.set(0, 0, 0);

		brick.castShadow = true;
		brick.receiveShadow = true;
		currentScene.add(brick);
		//bricks.push( brick );
	}

	// left wall
	for (var i = 0; i < 18; i++) {
		var brick = new Physijs.BoxMesh(new THREE.CubeGeometry(4.5, 4.5, 4.5), brick_material, 5000);
		brick.position.set(-45, 5 + i, -45 + (i * 5));
		brick.rotation.set(0, 0, 0);

		brick.castShadow = true;
		brick.receiveShadow = true;
		currentScene.add(brick);
		//bricks.push( brick );
	}

	// back wall
	for (var i = 0; i < 18; i++) {
		var brick = new Physijs.BoxMesh(new THREE.CubeGeometry(4.5, 4.5, 4.5), brick_material, 5000);
		brick.position.set(+45 - (i * 5), 5 + i, -45);
		brick.rotation.set(0, 0, 0);

		brick.castShadow = true;
		brick.receiveShadow = true;
		currentScene.add(brick);
		//bricks.push( brick );
	}

	////////////////////////
	// Create Start Block //
	////////////////////////

	var blockA_material = this.materials["blockA"];

	var startBlock = new Physijs.BoxMesh(new THREE.CubeGeometry(10, 0.1, 10), blockA_material, 500);
	startBlock.name = "startBlock";
	startBlock.position.set(35, 5, 35);
	startBlock.rotation.set(0, 0, 0);
	startBlock.castShadow = false;
	startBlock.receiveShadow = true;
	currentScene.add(startBlock);

	var blockA_material = this.materials["blockA"];

	////////////////////////
	// Create End Block //
	////////////////////////

	var blockB_material = this.materials["blockB"];

	var endBlock = new Physijs.BoxMesh(new THREE.CubeGeometry(10, 0.1, 10), blockB_material, 500);
	endBlock.position.set(-35, 5, -35);
	endBlock.name = "endBlock";

	endBlock.rotation.set(0, 0, 0);
	endBlock.castShadow = false;
	endBlock.receiveShadow = true;

	currentScene.add(endBlock);

	var wood_material = this.materials["wood"];

	// add directional light to scene
	var dirLight = A2B.getDirectionalLight();
	dirLight.position.set(20, 40, -15);
	dirLight.target.position.copy(currentScene.position);

	//currentScene.add(dirLight);

	// add spotlight to scene
	var spotLight = A2B.getSpotLight();
	spotLight.position.set(20, 40, -15);
	spotLight.target.position.copy(currentScene.position);
	//currentScene.add( spotLight );

};

/**
 * Bind a keys for main menu
 */
A2B.Game.prototype.mainMenuModeBindKeys = function(opts) {
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


A2B.Game.prototype.render = function() {

	// update camera controls
	game.cameraControls.update();

	// check for intersects
	var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
	game.projector.unprojectVector(vector, game.camera);

	var ray = new THREE.Ray(game.camera.position, vector.subSelf(game.camera.position).normalize());

	var intersects = ray.intersectObjects(game.scene.children);

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

	game.scene.simulate(undefined, 2);
	requestAnimationFrame(game.render);
	game.renderer.render(game.scene, game.camera);
	game.graphicStats.update();
	game.gameStats.update();
};

/*
 This function will initialise the scene and controls for the current mode
 */
A2B.Game.prototype.setupMode = function() {
	switch(this._currentMode) {
		case MAINMENU_MODE:
			this.mainMenuModeInitScene(this.scene);
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

A2B.Game.prototype.setMousePosition = function(event) {
	// Find where mouse cursor intersects the ground plane
	mouse.x = (event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight ) * 2 + 1;

};

/*
 * This method is called when a new game starts
 */
A2B.Game.prototype.startNewGame = function() {
	// init variables for a new game
	this.levelNum = 1;
	this.lives = 3;
	this.score = 0;

	this.startNewLevel();

	//this.changeMode(LEVEL_RUNNING_MODE);

}

A2B.Game.prototype.startMainMenu = function() {

	var scope = this;

	var onMenuInitialised = function(menuScene) {
		// this function is called when the menu scene has been initialised

		// replace current scene with new scene
		scope.scene = menuScene;

		scope.initCameraForScene(scope.scene);

		scope.initCameraControls(scope.camera);

		// change to level running
		A2B.MenuController.mainMenuModeInitScene(scope.scene);
		scope._currentEventListener = scope.mainMenuModeBindKeys();

	}
	// load details of the main menu
	var menuScene = A2B.MenuController.mainMenuModeInitScene();
	onMenuInitialised(menuScene);

}

A2B.Game.prototype.startNewLevel = function() {

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

A2B.Game.prototype.startRenderCallback = function() {

	requestAnimationFrame(this.render);

};
/*
 This function will tidys up anything for current mode
 */
A2B.Game.prototype.teardownMode = function() {
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

