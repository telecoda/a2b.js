GameTest = TestCase("GameTest");

GameTest.prototype.setUp = function setUp() {
	console.log("GameTest", "Setup started");

	// this add a viewport div for main canvas
	/*:DOC += <div id="viewport"></div> */

	// this adds an inlineDoc div for control details
	/*:DOC += <div id="inlineDoc"></div> */
	assertNotNull(document.getElementById('viewport'));

	Physijs.scripts.worker = '../vendor/physi.js/physijs_worker.js';
	Physijs.scripts.ammo = 'ammo.js';

	//A2B.initMaterials('../images');

	console.log("GameTest", "Setup finished");
};

GameTest.prototype.testCreateGame = function() {
	var game = new A2B.Game(false, false);
	assertNotNull("Should create an instance of the Game class", game);
};

GameTest.prototype.testAddGameToPage = function() {
	var game = new A2B.Game(false, false);

	assertNotNull("Should add an instance of Game to current page", game);
	var viewportBefore = document.getElementById('viewport').innerHTML;
	console.log("GameTest", "viewportBefore:" + viewportBefore);

	game.initRenderer();
	var viewportAfter = document.getElementById('viewport').innerHTML;
	console.log("GameTest", "viewportAfter:" + viewportAfter);
	assertNotNull(document.getElementById('viewport'));
	assertNotEquals("viewport div should look different after call", viewportBefore, viewportAfter);
};

GameTest.prototype.testAddPlayerToScene = function() {
	console.log("GameTest", "testAddPlayerToScene - started");
	// create a game
	var game = new A2B.Game(false, false);
	assertNotNull("Should have created an instance of a Game", game);
	// create a scene
	game.initScene();
	// create a player
	var player = new A2B.Player();
	assertNotNull("Should have created an instance of a Player", player);
	assertNotNull("A player should have a mesh", player.getMesh());

	game.addPlayerToScene(player, 1);
	console.log("GameTest", "testAddPlayerToScene - ended");
};

GameTest.prototype.testChangeMode = function() {
	console.log("GameTest", "testChangeMode - started");
	assertFalse("test not written", true);
	console.log("GameTest", "testChangeMode - ended");
};

GameTest.prototype.testClearSceneObject = function() {
	console.log("GameTest", "testClearSceneObject - started");
	var game = new A2B.Game(false, false);
	assertNotNull("Should have created an instance of a Game", game);
	game.initScene();
	assertNotNull("Should have created an instance of a game.scene", game.scene);
	// count objects
	assertEquals("Empty scene should have 0 objects",0,game.scene.__objects.length);
	assertEquals("Empty scene should have 0 lights",0,game.scene.__lights.length);
	// add some stuff to scene
	var spotlight = A2B.getSpotLight();
	game.scene.add(spotlight);
	var dirlight = A2B.getDirectionalLight();
	game.scene.add(dirlight);
	assertEquals("Scene should have 2 lights",2,game.scene.__lights.length);
	var materials = A2B.initMaterials();
	var brick_material = materials["brick"];

	var brick = new Physijs.BoxMesh(new THREE.CubeGeometry(4.5, 4.5, 4.5), brick_material, 5000);
	game.scene.add(brick);
	assertEquals("Scene should have 3 objects",3,game.scene.__objects.length);
	
	// clear scene
	game.clearSceneObjects(game.scene);
	assertEquals("Cleared scene should have 0 objects",0,game.scene.__objects.length);
	assertEquals("Cleared scene should have 0 lights",0,game.scene.__lights.length);
	
	console.log("GameTest", "testClearSceneObject - ended");
};

GameTest.prototype.testGetLives = function() {
	console.log("GameTest", "testGetLives - started");
	// create a game
	var game = new A2B.Game(false, false);
	assertNotNull("Should have created an instance of a Game", game);
	game.initGame();
	game.startNewGame();
	var lives = game.getLives();
	assertEquals("Game should start with 3 lives", 3, lives);
	console.log("GameTest", "testGetLives - ended");
};

GameTest.prototype.testInitCamera = function() {
	console.log("GameTest", "testInitCamera - started");
	var game = new A2B.Game(false, false);
	assertNotNull("Should have created an instance of a Game", game);
	game.initCamera();
	assertNotNull("Should have created an instance of a game.camera", game.camera);

	console.log("GameTest", "testInitCamera - ended");
};

GameTest.prototype.testInitCameraControls = function() {
	console.log("GameTest", "testInitCameraControls - started");
	var game = new A2B.Game(false, false);
	assertNotNull("Should have created an instance of a Game", game);
	game.initCamera();
	assertNotNull("Should have created an instance of a game.camera", game.camera);
	game.initCameraControls();
	assertNotNull("Should have created an instance of a game.cameraControls", game.cameraControls);
	console.log("GameTest", "testInitCameraControls - ended");
};

GameTest.prototype.testInitGame = function() {
	console.log("GameTest", "testInitGameStats - started");

	var game = new A2B.Game(false, false);
	assertNotNull("Should create an instance of the Game class", game);

	//game.initGame();
	// test everything is intialised

	game.initRenderer();
	assertNotNull("Should create an instance of the game.renderer class", game.renderer);
	game.initScene();
	assertNotNull("Should create an instance of the game.scene class", game.scene);
	game.initCamera();
	assertNotNull("Should create an instance of the game.camera class", game.camera);
	game.initCameraControls();
	assertNotNull("Should create an instance of the game.cameraControls class", game.cameraControls);
	game.initProjector();
	assertNotNull("Should create an instance of the game.projector class", game.projector);

	game.initWindowResize();
	assertNotNull("Should create an instance of the Game class", game);
 
	console.log("GameTest", "testInitGameStats - ended");
};


GameTest.prototype.testInitProjector = function() {
	console.log("GameTest", "testInitProjector - started");
	var game = new A2B.Game(false, false);
	assertNotNull("Should have created an instance of a Game", game);
	game.initProjector();
	assertNotNull("Should have created an instance of a game.projector", game["projector"]);
	console.log("GameTest", "testInitProjector - ended");
};

GameTest.prototype.testInitRenderer = function() {
	console.log("GameTest", "testInitRenderer - started");
	var game = new A2B.Game(false, false);
	assertNotNull("Should have created an instance of a Game", game);
	game.initRenderer();
	assertNotNull("Should have created an instance of a game.renderer", game.renderer);
	console.log("GameTest", "testInitRenderer - ended");
};

GameTest.prototype.testInitScene = function() {
	console.log("GameTest", "testInitScene - started");
	var game = new A2B.Game(false, false);
	assertNotNull("Should have created an instance of a Game", game);
	game.initScene();
	assertNotNull("Should have created an instance of a game.scene", game.scene);
	console.log("GameTest", "testInitScene - ended");
};


GameTest.prototype.testLevelRunningBindKeys = function() {
	console.log("GameTest", "testLevelRunningBindKeys - started");
	assertFalse("test not written", true);
	console.log("GameTest", "testLevelRunningBindKeys - ended");
};

GameTest.prototype.testLevelRunningInitScene = function() {
	console.log("GameTest", "testLevelRunningInitScene - started");
	assertFalse("test not written", true);
	console.log("GameTest", "testLevelRunningInitScene - ended");
};

GameTest.prototype.testMainMenuBindKeys = function() {
	console.log("GameTest", "testMainMenuBindKeys - started");
	assertFalse("test not written", true);
	console.log("GameTest", "testMainMenuBindKeys - ended");
};

GameTest.prototype.testMainMenuInitScene = function() {
	console.log("GameTest", "testMainMenuInitScene - started");
	assertFalse("test not written", true);
	console.log("GameTest", "testMainMenuInitScene - ended");
};

GameTest.prototype.testRender = function() {
	console.log("GameTest", "testRender - started");
	assertFalse("test not written", true);
	console.log("GameTest", "testRender - ended");
};

GameTest.prototype.testSetupMode = function() {
	console.log("GameTest", "testSetupMode - started");
	assertFalse("test not written", true);
	console.log("GameTest", "testSetupMode - ended");
};

GameTest.prototype.testSetMousePosition = function() {
	console.log("GameTest", "testSetMousePosition - started");
	assertFalse("test not written", true);
	console.log("GameTest", "testSetMousePosition - ended");
};

GameTest.prototype.testTeardownMode = function() {
	console.log("GameTest", "testTeardownMode - started");
	assertFalse("test not written", true);
	console.log("GameTest", "testTeardownMode - ended");
};

