/*
 * @author telecoda
 * 08/11/2012
 */

'use strict';
/** @namespace */
var A2B = A2B || {};

 
A2B.GameModel = function() {
};

A2B.GameModel.createGameModel = function() {
	
	var gameModel = {};
	
	gameModel.lives=3;
	gameModel.levelNum=1;
	gameModel.score=0;
	gameModel.currentLevel=null;
	
	return gameModel;
};