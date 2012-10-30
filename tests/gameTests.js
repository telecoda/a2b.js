GameTest = TestCase("GameTest");

GameTest.prototype.setUp = function setUp() {
	var a = "a";
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

