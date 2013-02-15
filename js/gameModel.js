/*
 * @author telecoda
 * 08/11/2012
 */

'use strict';
/** @namespace */
var A2B = A2B || {};

//game modes
var ATTRACT_MODE = 1;
var MAINMENU_MODE = 2;
var LEVEL_INTRO_MODE = 3;
var LEVEL_RUNNING_MODE = 4;
var LEVEL_COMPLETE_MODE = 5;
var GAME_OVER_MODE = 6;
var GAME_COMPLETE_MODE = 7;
var ENTER_HIGHSCORE_MODE = 8;
var DISPLAY_CREDITS_MODE = 9;
var DISPLAY_HIGHSCORES_MODE = 10;

var TOTAL_LIVES = 3;


A2B.GameModel = function() {
	this.mode=ATTRACT_MODE;
	this.lives=TOTAL_LIVES;
	this.levelNum=START_FROM_LEVEL;
	this.score=0;
	this.currentLevel=null;
	this.timeRemaining = 0;
	this.timerRunning = false;
	
	this.decreaseLives = function () {
		this.lives--;
	}
};




