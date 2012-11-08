PlayerTest = TestCase("PlayerTest");

PlayerTest.prototype.setUp = function setUp() {
	console.log("PlayerTest", "Setup started");

	console.log("PlayerTest", "Setup finished");
};

PlayerTest.prototype.testCreatePlayer = function() {
	console.log("PlayerTest", "testCreatePlayer - started");
	var player = new A2B.Player();
	assertNotUndefined("Should have created an instance of a player", player);
	console.log("PlayerTest", "testCreatePlayer - ended");
};

PlayerTest.prototype.testGetMesh = function() {
	console.log("PlayerTest", "testGetMesh - started");
	var player = new A2B.Player();
	assertNotUndefined("Should have created an instance of a player", player);
	var mesh = player.getMesh();
	assertNotUndefined("Should have created an instance of a mesh", mesh);
	console.log("PlayerTest", "testGetMesh - ended");
};

PlayerTest.prototype.testGetX = function() {
	console.log("PlayerTest", "testGetX - started");
	var player = new A2B.Player();
	assertNotUndefined("Should have created an instance of a player", player);
	var x = player.getX();
	assertEquals("Should have an x position of 0",0, x);
	console.log("PlayerTest", "testGetX - ended");
};

PlayerTest.prototype.testGetY = function() {
	console.log("PlayerTest", "testGetY - started");
	var player = new A2B.Player();
	assertNotUndefined("Should have created an instance of a player", player);
	var y = player.getY();
	assertEquals("Should have an y position of 10",10, y);
	console.log("PlayerTest", "testGetY - ended");
};

PlayerTest.prototype.testGetZ = function() {
	console.log("PlayerTest", "testGetZ - started");
	var player = new A2B.Player();
	assertNotUndefined("Should have created an instance of a player", player);
	var z = player.getZ();
	assertEquals("Should have an z position of 0",0, z);
	console.log("PlayerTest", "testGetZ - ended");
};

/*
PlayerTest.prototype.testHandleCollision = function() {
	console.log("PlayerTest", "testHandleCollision - started");
	assertFalse("test not written", true);
	console.log("PlayerTest", "testHandleCollision - ended");
};
*/

/*
PlayerTest.prototype.testMoveBackwards = function() {
	console.log("PlayerTest", "testMoveBackwards - started");
	assertFalse("test not written", true);
	console.log("PlayerTest", "testMoveBackwards - ended");
};
*/

/*
PlayerTest.prototype.testMoveForwards = function() {
	console.log("PlayerTest", "testMoveForwards - started");
	assertFalse("test not written", true);
	console.log("PlayerTest", "testMoveForwards - ended");
};
*/

/*
PlayerTest.prototype.testMoveLeft = function() {
	console.log("PlayerTest", "testMoveLeft - started");
	assertFalse("test not written", true);
	console.log("PlayerTest", "testMoveLeft - ended");
};
*/

/*
PlayerTest.prototype.testMoveRight = function() {
	console.log("PlayerTest", "testMoveRight - started");
	assertFalse("test not written", true);
	console.log("PlayerTest", "testMoveRight - ended");
};
*/

/*
PlayerTest.prototype.testPushPlayer = function() {
	console.log("PlayerTest", "testPushPlayer - started");
	assertFalse("test not written", true);
	console.log("PlayerTest", "testPushPlayer - ended");
};
*/

/*
PlayerTest.prototype.testRotateVectorAboutY = function() {
	console.log("PlayerTest", "testRotateVectorAboutY - started");
	assertFalse("test not written", true);
	console.log("PlayerTest", "testRotateVectorAboutY - ended");
};
*/ 