GraphicsTest = TestCase("GraphicsTest");

GraphicsTest.prototype.setUp = function setUp() {
	console.log("GraphicsTest", "Setup started");

	console.log("GraphicsTest", "Setup finished");
};

GraphicsTest.prototype.testCreateGame = function() {
	var game = new A2B.Game(false, false);
	assertNotNull("Should create an instance of the Game class", game);
};

GraphicsTest.prototype.testCreateTextMesh = function() {
	//
	console.log("GraphicsTest", "testCreateTextMesh - started");
	var materials = A2B.initMaterials();
	//log.info("Starting createTextMesh test");
	assertNotNull("Should initialise an array of materials for the game", materials);
	var rockMaterial = materials["rock"];

	var fontProps = A2B.initFontProps();

	var textMesh = A2B.createTextMesh("test text", rockMaterial, fontProps);
	assertNotNull("Should create a graphic mesh for given text", textMesh);

	console.log("GraphicsTest", "testCreateTextMesh - ended");
};

GraphicsTest.prototype.testDegreesToRadians = function() {
	console.log("GraphicsTest", "testDegreesToRadians - started");

	assertEquals("Should 0 degrees to radians", 0, A2B.degreesToRadians(0));
	assertEquals("Should 90 degrees to radians", 1.5707963267948966, A2B.degreesToRadians(90));

	console.log("GraphicsTest", "testDegreesToRadians - ended");
}

GraphicsTest.prototype.testGetDirectionalLight = function() {
	console.log("GraphicsTest", "testGetDirectionalLight - started");

	// pointless methods at the moment as there are no config parms..
	var light = A2B.getDirectionalLight();
	assertNotNull("Should create a directional light", light);
	// check light properties here..
	assertTrue(light.castShadow);

	console.log("GraphicsTest", "testGetDirectionalLight - ended");
}

GraphicsTest.prototype.testGetSpotLight = function() {
	console.log("GraphicsTest", "testGetSpotLight - started");
	
	// pointless methods at the moment as there are no config parms..
	var light = A2B.getSpotLight();
	assertNotNull("Should create a spot light", light);
	// check light properties here..
	assertTrue(light.castShadow);

	console.log("GraphicsTest", "testGetSpotLight - ended");
}

GraphicsTest.prototype.testInitFontProps = function() {
	console.log("GraphicsTest", "testInitFontProps - started");
	//
	var fontProps = A2B.initFontProps();
	assertNotNull("Should initialise properties for fonts", fontProps);
	// check font properties here..
	assertEquals(70, fontProps.size);

	console.log("GraphicsTest", "testInitFontProps - ended");
}

GraphicsTest.prototype.testInitMaterials = function() {
	console.log("GraphicsTest", "testInitMaterials - started");

	var materials = A2B.initMaterials();
	assertNotNull("Should initialise an array of materials for the game", materials);
	var rockMaterial = materials["rock"];
	// check materials properties here..
	assertNotNull(materials["rock"]);

	console.log("GraphicsTest", "testInitMaterials - ended");
}

GraphicsTest.prototype.testLoadImage = function() {
	console.log("GraphicsTest", "testLoadImage - started");

	var path = "../images/";
	var filename = "rocks.jpg";
	var image = A2B.loadImage(path, filename);
	assertNotNull("Should load an image from path", image);

	console.log("GraphicsTest", "testLoadImage - ended");
}

GraphicsTest.prototype.testLoadImages = function() {
	console.log("GraphicsTest", "testLoadImages - started");
	//
	var path = "../images/";
	var filenames = ["rocks.jpg", "wood.jpg"];
	var images = A2B.loadImages(path, filenames);
	assertNotNull("Should load an array of images from path", images);

	console.log("GraphicsTest", "testLoadImages - ended");
}

GraphicsTest.prototype.testLoadMissingImage = function() {

	console.log("GraphicsTest", "testLoadMissingImage - started");
	//
	var path = "../images/";
	var filename = "missing.jpg";
	var image = A2B.loadImage(path, filename);
	assertNull("Should fail to load an image from path", image);

	console.log("GraphicsTest", "testLoadMissingImage - ended");
}