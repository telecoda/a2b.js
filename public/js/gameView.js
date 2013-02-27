/*
 * @author telecoda
 * 09/11/2012
 */

'use strict';
/** @namespace */
var A2B = A2B || {};

 
A2B.GameView = function() {
};

A2B.GameView.createGameView = function(displayGraphicStats, displayGameStats) {
	
	var gameView = {};
	
	gameView.renderer = A2B.GameView.createRenderer();
	gameView.projector = new THREE.Projector; 
	gameView.scene = A2B.Graphics.createEmptyScene();
	
	gameView.camera = A2B.GameView.createCamera();
	
	if (displayGraphicStats) {
		// graphic stats
		gameView.graphicStats = A2B.GameView.createGraphicStats();
	}

	if (displayGameStats) {
		// game stats
		gameView.gameStats = A2B.GameView.createGameStats();
	}
	
	gameView.setSceneToRender = function(currentScene) {
		gameView.scene = currentScene;

		gameView.camera = A2B.GameView.createCamera();
		gameView.scene.add(gameView.camera);
		
	};
	


	return gameView;
};

A2B.GameView.createCamera = function() {

	var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);

	camera.position.set(0, 50, 120);
	//camera.position.set(0, 50, 0);

	return camera;
};

A2B.GameView.createGameStats = function() {

	var gameStats = new GameStats();
	gameStats.domElement.style.position = 'absolute';
	gameStats.domElement.style.top = '0px';
	gameStats.domElement.style.right = '0px';
	gameStats.domElement.style.zIndex = 100;
	document.getElementById('viewport').appendChild(gameStats.domElement);

	return gameStats;

};



A2B.GameView.createGraphicStats = function() {

	var stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	document.getElementById('viewport').appendChild(stats.domElement);

	return stats;

};




A2B.GameView.createRenderer = function() {

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
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = '0px';
	renderer.domElement.style.left = '0px';
	renderer.domElement.style.zIndex = -100;
	
	document.getElementById('viewport').appendChild(renderer.domElement);

	return renderer;

};



