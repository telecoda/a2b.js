GraphicsTest = TestCase("GraphicsTest");


GraphicsTest.prototype.setUp = function setUp() {
  	var a = "a";
  	console.log("GraphicsTest", "Setup started");

  
	console.log("GraphicsTest", "Setup finished"); 
};



GameTest.prototype.testCreateGame = function() {
	var	game = new A2B.Game(false,false);  
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

  var textMesh = A2B.createTextMesh("test text", rockMaterial, fontProps );
  assertNotNull("Should create a graphic mesh for given text", textMesh);

  console.log("GraphicsTest", "testCreateTextMesh - ended");
};
