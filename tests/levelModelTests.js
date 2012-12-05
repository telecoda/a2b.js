LevelModelTest = TestCase("LevelModelTest");

LevelModelTest.prototype.setUp = function setUp() {
	console.log("LevelModelTest", "Setup started");

	console.log("LevelModelTest", "Setup finished");
};

LevelModelTest.prototype.testCreateLevelModel = function() {
	console.log("LevelModelTest", "testCreateLevelModel - started");
	var levelModel = new A2B.LevelModel();
	assertNotUndefined("Should have created an instance of a level model", levelModel);
	console.log("LevelModelTest", "testCreateLevelModel - ended");
};
/*
LevelModelTest.prototype.testGetMesh = function() {
	console.log("LevelModelTest", "testGetMesh - started");
	var player = new A2B.Player();
	assertNotUndefined("Should have created an instance of a player", player);
	var mesh = player.getMesh();
	assertNotUndefined("Should have created an instance of a mesh", mesh);
	console.log("LevelModelTest", "testGetMesh - ended");
};

LevelModelTest.prototype.testGetX = function() {
	console.log("LevelModelTest", "testGetX - started");
	var player = new A2B.Player();
	assertNotUndefined("Should have created an instance of a player", player);
	var x = player.getX();
	assertEquals("Should have an x position of 0",0, x);
	console.log("LevelModelTest", "testGetX - ended");
};

LevelModelTest.prototype.testGetY = function() {
	console.log("LevelModelTest", "testGetY - started");
	var player = new A2B.Player();
	assertNotUndefined("Should have created an instance of a player", player);
	var y = player.getY();
	assertEquals("Should have an y position of 10",10, y);
	console.log("LevelModelTest", "testGetY - ended");
};

LevelModelTest.prototype.testGetZ = function() {
	console.log("LevelModelTest", "testGetZ - started");
	var player = new A2B.Player();
	assertNotUndefined("Should have created an instance of a player", player);
	var z = player.getZ();
	assertEquals("Should have an z position of 0",0, z);
	console.log("LevelModelTest", "testGetZ - ended");
};

/*
LevelModelTest.prototype.testHandleCollision = function() {
	console.log("LevelModelTest", "testHandleCollision - started");
	assertFalse("test not written", true);
	console.log("LevelModelTest", "testHandleCollision - ended");
};
*/

/*
LevelModelTest.prototype.testMoveBackwards = function() {
	console.log("LevelModelTest", "testMoveBackwards - started");
	assertFalse("test not written", true);
	console.log("LevelModelTest", "testMoveBackwards - ended");
};
*/

/*
LevelModelTest.prototype.testMoveForwards = function() {
	console.log("LevelModelTest", "testMoveForwards - started");
	assertFalse("test not written", true);
	console.log("LevelModelTest", "testMoveForwards - ended");
};
*/

/*
LevelModelTest.prototype.testMoveLeft = function() {
	console.log("LevelModelTest", "testMoveLeft - started");
	assertFalse("test not written", true);
	console.log("LevelModelTest", "testMoveLeft - ended");
};
*/

/*
LevelModelTest.prototype.testMoveRight = function() {
	console.log("LevelModelTest", "testMoveRight - started");
	assertFalse("test not written", true);
	console.log("LevelModelTest", "testMoveRight - ended");
};
*/

/*
LevelModelTest.prototype.testPushPlayer = function() {
	console.log("LevelModelTest", "testPushPlayer - started");
	assertFalse("test not written", true);
	console.log("LevelModelTest", "testPushPlayer - ended");
};
*/

/*
LevelModelTest.prototype.testRotateVectorAboutY = function() {
	console.log("LevelModelTest", "testRotateVectorAboutY - started");
	assertFalse("test not written", true);
	console.log("LevelModelTest", "testRotateVectorAboutY - ended");
};
*/ 