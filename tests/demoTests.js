ConsoleTest = TestCase("ConsoleTest");

ConsoleTest.prototype.testGreet = function() {
  jstestdriver.console.log("JsTestDriver", "Hello World!");
  console.log("Browser", "Hello World!");
}; 

