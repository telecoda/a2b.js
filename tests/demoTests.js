ConsoleTest = TestCase("ConsoleTest");

ConsoleTest.prototype.testGreet = function() {
  jstestdriver.console.log("JsTestDriver", "Hello World!");
  console.log("Browser", "Hello World!");
}; 

ConsoleTest2 = TestCase("ConsoleTest2");

ConsoleTest2.prototype.testGreet2 = function() {
  jstestdriver.console.log("JsTestDriver", "Hello World!");
  console.log("Browser", "Hello World!");
}; 
