LevelControllerTest = TestCase("LevelControllerTest");

LevelControllerTest.prototype.setUp = function setUp() {
	console.log("LevelController", "Setup started");

	console.log("LevelController", "Setup finished");
};

LevelControllerTest.prototype.testCreateLevelController = function() {
	console.log("LevelController", "testCreateLevelController - started");

	var controller = new A2B.LevelController();
	
	assertNotUndefined("Should create an instance of the LevelController class", controller);

	console.log("LevelController", "testCreateLevelController - ended");
};
 
/*  ASYNC test removed because jstestdriver does not return actual file during XMLHTTPRequest another bug...
LevelControllerAsyncTest = AsyncTestCase('LevelControllerAsyncTest');

LevelControllerTest.prototype.setUp = function setUp() {
	console.log("LevelControllerTest", "Setup started");

	jstestdriver.plugins.async.CallbackPool.TIMEOUT = 2000;
	console.log("LevelControllerTest", "Setup finished");
};


LevelControllerAsyncTest.prototype.testLevelLoad = function(queue) {
  var loaded = false;

  queue.call('Step 1: load JSON level file.', function(callbacks) {
    var loadedCallback = callbacks.add(function() {
      loaded = true;
    });
    var controller = new A2B.LevelController();
    controller.loadLevel("levels/level01.json", loadedCallback);
  });

  queue.call('Step 2: check the file was successfully loaded', function() {
    assertTrue(loaded);
  });
};

*/