GameTest = TestCase("GameTest");

GameTest.prototype.testCreateGame = function() {
	var	game = new A2B.Game(false,false);  
	assertNotNull("Should create an instance of the Game class", game);
}; 
