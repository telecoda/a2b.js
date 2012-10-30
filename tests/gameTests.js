GameTest = TestCase("GameTest");

GameTest.prototype.setUp = function setUp() {
	console.log("GameTest", "Setup started");

	/*:DOC += <div id="viewport"></div> */

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
	console.log("GameTest", "viewportBefore:"+viewportBefore);

	game.initRenderer();
	var viewportAfter = document.getElementById('viewport').innerHTML;
	console.log("GameTest", "viewportAfter:"+viewportAfter);
	assertNotNull(document.getElementById('viewport'));
	assertNotEquals("viewport div should look different after call",viewportBefore, viewportAfter);
};

GameTest.prototype.testAddPlayerToScene = function() {
  console.log("GameTest","testAddPlayerToScene - started");
  // create a game 
  var game = new A2B.Game(false,false);
  assertNotNull("Should have created an instance of a Game", game);
  // create a scene
  var scene = game.initScene();
  assertNotNull("Should have created an instance of a Scene", scene);
  // create a player
  var player = new A2B.Player();
  assertNotNull("Should have created an instance of a Player", player);
  assertNotNull("A player should have a mesh", player.getMesh());

  game.addPlayerToScene(player,1);
  console.log("GameTest","testAddPlayerToScene - ended");
};

GameTest.prototype.testChangeMode = function() {
  console.log("GameTest","testChangeMode - started");
  assertFalse("test not written", true);
  console.log("GameTest","testChangeMode - ended");
};

GameTest.prototype.testClearSceneObject = function() {
  console.log("GameTest","testClearSceneObject - started");
  assertFalse("test not written", true);
  console.log("GameTest","testClearSceneObject - ended");
};

GameTest.prototype.testGetCamera = function() {
  console.log("GameTest","testGetCamera - started");
  var game = new A2B.Game(false,false);
  var camera = game.initCamera();
  assertNotNull("Should create an instance of a camera", camera);
  console.log("GameTest","testGetCamera - ended");
};

GameTest.prototype.testGetCameraControls = function() {
  console.log("GameTest","testGetCameraControls - started");
  assertFalse("test not written", true);
  console.log("GameTest","testGetCameraControls - ended");
};

GameTest.prototype.testGetLives =  function() {
  console.log("GameTest","testGetLives - started");
  assertFalse("test not written", true);
  console.log("GameTest","testGetLives - ended");
};

GameTest.prototype.testGetMousePosition = function() {
  console.log("GameTest","testGetMousePosition - started");
  assertFalse("test not written", true);
  console.log("GameTest","testGetMousePosition - ended");
};

GameTest.prototype.testGetPlayer = function() {
  console.log("GameTest","testGetPlayer - started");
  assertFalse("test not written", true);
  console.log("GameTest","testGetPlayer - ended");
};

GameTest.prototype.testGetProjector = function() {
  console.log("GameTest","testGetProjector - started");
  assertFalse("test not written", true);
  console.log("GameTest","testGetProjector - ended");
};

GameTest.prototype.testGetRenderer = function() {
  console.log("GameTest","testGetProjector - started");
  assertFalse("test not written", true);
  console.log("GameTest","testGetRenderer - ended");
};

GameTest.prototype.testGetScene = function() {
  console.log("GameTest","testGetScene - started");
  assertFalse("test not written", true);
  console.log("GameTest","testGetScene - ended");
};

GameTest.prototype.testGetScore =function() {
  console.log("GameTest","testGetScore - started");
  assertFalse("test not written", true);
  console.log("GameTest","testGetScore - ended");
};

GameTest.prototype.testInitCamera = function() {
  console.log("GameTest","testInitCamera - started");
  assertFalse("test not written", true);
  console.log("GameTest","testInitCamera - ended");
};

GameTest.prototype.testInitCameraControls = function() {
  console.log("GameTest","testInitCameraControls - started");
  assertFalse("test not written", true);
  console.log("GameTest","testInitCameraControls - ended");
};

GameTest.prototype.testInitFullscreenCapability = function() {
  console.log("GameTest","testInitFullscreenCapability - started");
  assertFalse("test not written", true);
  console.log("GameTest","testInitFullscreenCapability - ended");
};

GameTest.prototype.testInitGameStats = function() {
  console.log("GameTest","testInitGameStats - started");
  assertFalse("test not written", true);
  console.log("GameTest","testInitGameStats - ended");
};

GameTest.prototype.testInitGraphicStats = function() {
  console.log("GameTest","testInitGraphicStats - started");
  assertFalse("test not written", true);
  console.log("GameTest","testInitGraphicStats - ended");
};

GameTest.prototype.testInitMouseMoveListener = function() {
  console.log("GameTest","testInitMouseMoveListener - started");
  assertFalse("test not written", true);
  console.log("GameTest","testInitMouseMoveListener - ended");
};

GameTest.prototype.testInitProjector = function() {
  console.log("GameTest","testInitProjector - started");
  assertFalse("test not written", true);
  console.log("GameTest","testInitProjector - ended");
};

GameTest.prototype.testInitRenderer = function() {
  console.log("GameTest","testInitRenderer - started");
  assertFalse("test not written", true);
  console.log("GameTest","testInitRenderer - ended");
};

GameTest.prototype.testInitScene = function() {
  console.log("GameTest","testInitScene - started");
  assertFalse("test not written", true);
  console.log("GameTest","testInitScene - ended");
};

GameTest.prototype.testInitScreenshotCapability = function() {
  console.log("GameTest","testInitScreenshotCapability - started");
  assertFalse("test not written", true);
  console.log("GameTest","testInitScreenshotCapability - ended");
};

GameTest.prototype.testInitWindowResize = function() {
  console.log("GameTest","testInitWindowResize - started");
  assertFalse("test not written", true);
  console.log("GameTest","testInitWindowResize - ended");
};

GameTest.prototype.testLevelRunningBindKeys = function() {
  console.log("GameTest","testLevelRunningBindKeys - started");
  assertFalse("test not written", true);
  console.log("GameTest","testLevelRunningBindKeys - ended");
};

GameTest.prototype.testLevelRunningInitScene = function() {
  console.log("GameTest","testLevelRunningInitScene - started");
  assertFalse("test not written", true);
  console.log("GameTest","testLevelRunningInitScene - ended");
};

GameTest.prototype.testMainMenuBindKeys = function() {
  console.log("GameTest","testMainMenuBindKeys - started");
  assertFalse("test not written", true);
  console.log("GameTest","testMainMenuBindKeys - ended");
};

GameTest.prototype.testMainMenuInitScene = function() {
  console.log("GameTest","testMainMenuInitScene - started");
  assertFalse("test not written", true);
  console.log("GameTest","testMainMenuInitScene - ended");
};

GameTest.prototype.testRender = function() {
  console.log("GameTest","testRender - started");
  assertFalse("test not written", true);
  console.log("GameTest","testRender - ended");
};

GameTest.prototype.testSetupMode = function() {
  console.log("GameTest","testSetupMode - started");
  assertFalse("test not written", true);
  console.log("GameTest","testSetupMode - ended");
};

GameTest.prototype.testSetMousePosition = function() {
  console.log("GameTest","testSetMousePosition - started");
  assertFalse("test not written", true);
  console.log("GameTest","testSetMousePosition - ended");
};

GameTest.prototype.testStartRenderCallback = function() {
  console.log("GameTest","testStartRenderCallback - started");
  assertFalse("test not written", true);
  console.log("GameTest","testStartRenderCallback - ended");
};

GameTest.prototype.testTeardownMode = function() {
  console.log("GameTest","testTeardownMode - started");
  assertFalse("test not written", true);
  console.log("GameTest","testTeardownMode - ended");
};

