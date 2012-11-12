/*
 * @author telecoda
 * 12/11/2012
 */

'use strict';
/** @namespace */
var A2B = A2B || {};

 
A2B.LevelModel = function(levelNum) {

	// this is the data loaded from the JSON file
	this.levelData=null;
	// these are the textures created from the current level file
	this.textures=null;
	// these are the materials created from the current level file
	this.materials=null;
	// this is the ThreeJS scene data for rendering the level
	this.scene=null;
	// this is the current active sphere being used by the player
	this.activeSphere=null;
	

};


A2B.Player.prototype.getMesh = function() {
	return this.playersMesh;
}
