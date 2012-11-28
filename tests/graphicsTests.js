GraphicsTest = TestCase("GraphicsTest");

GraphicsTest.prototype.setUp = function setUp() {
	console.log("GraphicsTest", "Setup started");

	console.log("GraphicsTest", "Setup finished");
};


GraphicsTest.prototype.testCreateTextMesh = function() {
	//
	console.log("GraphicsTest", "testCreateTextMesh - started");
	//var materials = A2B.initMaterials();
	//log.info("Starting createTextMesh test");
	//assertNotUndefined("Should initialise an array of materials for the game", materials);
	//var rockMaterial = materials["rock"];

	var material = null;
	var fontProps = A2B.Graphics.initFontProps();

	var textMesh = A2B.Graphics.createTextMesh("test text", material, fontProps);
	assertNotUndefined("Should create a graphic mesh for given text", textMesh);

	console.log("GraphicsTest", "testCreateTextMesh - ended");
};

GraphicsTest.prototype.testDegreesToRadians = function() {
	console.log("GraphicsTest", "testDegreesToRadians - started");

	assertEquals("Should 0 degrees to radians", 0, A2B.Graphics.degreesToRadians(0));
	assertEquals("Should 90 degrees to radians", 1.5707963267948966, A2B.Graphics.degreesToRadians(90));

	console.log("GraphicsTest", "testDegreesToRadians - ended");
}

GraphicsTest.prototype.testCreateDirectionalLight = function() {
	console.log("GraphicsTest", "testCreateDirectionalLight - started");

	// pointless methods at the moment as there are no config parms..
	var position = new THREE.Vector3(0,0,0);
	var targetPosition = new THREE.Vector3(10,10,10);
	var light = A2B.Graphics.createLight("lightname", "FFFFFF","directional", position,targetPosition)
	assertNotUndefined("Should create a directional light", light);
	
	console.log("GraphicsTest", "testCreateDirectionalLight - ended");
}

GraphicsTest.prototype.testGetSpotLight = function() {
	console.log("GraphicsTest", "testGetSpotLight - started");
	
	// pointless methods at the moment as there are no config parms..
	var position = new THREE.Vector3(0,0,0);
	var targetPosition = new THREE.Vector3(10,10,10);
	var light = A2B.Graphics.createLight("lightname", "FFFFFF","spot", position,targetPosition)
	assertNotUndefined("Should create a spot light", light);

	console.log("GraphicsTest", "testGetSpotLight - ended");
}

GraphicsTest.prototype.testInitFontProps = function() {
	console.log("GraphicsTest", "testInitFontProps - started");
	//
	var fontProps = A2B.Graphics.initFontProps();
	assertNotUndefined("Should initialise properties for fonts", fontProps);
	// check font properties here..
	assertEquals(70, fontProps.size);

	console.log("GraphicsTest", "testInitFontProps - ended");
}

/*
GraphicsTest.prototype.testInitMaterials = function() {
	console.log("GraphicsTest", "testInitMaterials - started");

	var materials = A2B.initMaterials();
	assertNotUndefined("Should initialise an array of materials for the game", materials);
	var rockMaterial = materials["rock"];
	// check materials properties here..
	assertNotUndefined(materials["rock"]);

	console.log("GraphicsTest", "testInitMaterials - ended");
}
*/

/* Texture loading test removed due to bug in jstestloader not serving images correctly
 * http://code.google.com/p/js-test-driver/issues/detail?id=321
 */

/*
GraphicsTest.prototype.testLoadTexture = function() {
	console.log("GraphicsTest", "testLoadTexture - started");

	var path = "textures/";
	var filename = "tex_a_block.png";
	var texture = A2B.Graphics.loadTexture(path, filename);
	assertNotUndefined("Should load a texture from path", texture);

	console.log("GraphicsTest", "testLoadTexture - ended");
}
*/
/*
GraphicsTest.prototype.testLoadTextures = function() {
	console.log("GraphicsTest", "testLoadTextures - started");
	//
	var path = "textures";
	var texturesToLoad = '[
	  		{ 
	  			"name" : "texture1",
	  	  		"file" : "textures1.png"
	  		},
	  		{ 
	  			"name" : "texture2",
	  	  		"file" : "textures2.png"
	  		}
	  	]';

	var images = A2B.loadTextures(path, filenames);
	assertNotUndefined("Should load an array of Textures from path", images);

	console.log("GraphicsTest", "testLoadTextures - ended");
}
*/
/*
GraphicsTest.prototype.testLoadMissingTexture = function() {

	console.log("GraphicsTest", "testLoadMissingTexture - started");
	//
	var path = "test/images/";
	var filename = "missing.jpg";
	var image = A2B.loadTexture(path, filename);
	assertNull("Should fail to load a texture from path", image);

	console.log("GraphicsTest", "testLoadMissingTexture - ended");
}

*/