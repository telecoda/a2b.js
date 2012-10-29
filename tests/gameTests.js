GameTest = TestCase("GameTest");


GameTest.prototype.setUp = function setUp() {
  	var a = "a";
  	console.log("GameTest", "Setup started");

   // add viewpoint div to doc first
  //var newdiv = document.createElement('div');
  //newdiv.setAttribute("id","viewport");
  //document.getElementById('placeholder' ).appendChild(newdiv);

  Physijs.scripts.worker = '../vendor/physi.js/physijs_worker.js';
  Physijs.scripts.ammo = 'ammo.js';

  //A2B.initMaterials('../images');
  
 console.log("GameTest", "Setup finished"); 
};



GameTest.prototype.testCreateGame = function() {
	var	game = new A2B.Game(false,false);  
	assertNotNull("Should create an instance of the Game class", game);
}; 

GameTest.prototype.testAddGameToPage = function() {
	// add viewpoint div to doc first
  	var newdiv = document.createElement('div');
  	newdiv.setAttribute("id","viewport");
  	document.getElementById('placeholder' ).appendChild(newdiv);
	var	game = new A2B.Game(false,false);  
	assertNotNull("Should add an instance of Game to current page", game);
}; 

