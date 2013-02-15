/*
 * @author telecoda
 * 08/11/2012
 */

'use strict';
/** @namespace */
var A2B = A2B || {};

//game modes
var ATTRACT_MODE = 1;
var MAIN_MENU_MODE = 2;
var LEVEL_INTRO_MODE = 3;
var LEVEL_RUNNING_MODE = 4;
var LEVEL_COMPLETED_MODE = 5;
var PLAYER_TIMEUP_MODE = 6;
var PLAYER_DIED_MODE = 7;
var GAME_OVER_MODE = 8;
var GAME_COMPLETE_MODE = 9;
var ENTER_HIGHSCORE_MODE = 10;
var DISPLAY_CREDITS_MODE = 11;
var DISPLAY_HIGHSCORES_MODE = 12;

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




