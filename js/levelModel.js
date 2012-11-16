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

A2B.LevelModel.prototype.getMainSphere = function() {
	// This method returns the mainSphere object in the current level ThreeJS scene
	
	var len = this.scene.children.length;
	
	for(var i=0; i<len; i++) {
			var sceneObject = this.scene.children[i];
			// check for mainSphere
			if(sceneObject.name==MAIN_SPHERE) {
				return sceneObject;
			}
		}
	
	return null;
}


A2B.LevelModel.prototype.setActiveSphere = function(sphere) {
	this.activeSphere = sphere;
	// set up collision handling
	this.activeSphere.collisions=0;
	this.activeSphere.addEventListener( 'collision', A2B.LevelController.handleActiveSphereCollision );
	// TODO remove any collision handlers for other spheres

}



/*
 * move active sphere backwards when key pressed
 */
A2B.LevelModel.prototype.moveBackwards = function(cameraPosition) {

	var angle =0;

	this.pushActiveSphere(cameraPosition,angle);
};


/*
 * move active sphere forwards when key pressed
 */
A2B.LevelModel.prototype.moveForwards = function(cameraPosition) {
	var angle =180;

	this.pushActiveSphere(cameraPosition,angle);


	
};

/*
 * move active sphere left when key pressed
 */
A2B.LevelModel.prototype.moveLeft = function(cameraPosition) {
	var angle =270;

	this.pushActiveSphere(cameraPosition,angle);
};

/*
 * move active sphere right when key pressed
 */
A2B.LevelModel.prototype.moveRight = function(cameraPosition) {
	var angle =90;

	this.pushActiveSphere(cameraPosition,angle);

};

/*
 * apply force to active sphere relative to direction camera is facing
 */
A2B.LevelModel.prototype.pushActiveSphere = function(cameraPosition,angle){
	var strength=1;
	
	var forceVector = cameraPosition.clone();

	// flatten y - we push on flat surface
	forceVector.y=0; 

	forceVector = this.rotateVectorAboutY(forceVector,angle);

	forceVector = forceVector.multiplyScalar(strength);
	this.activeSphere.applyCentralImpulse(forceVector);


}


A2B.LevelModel.prototype.rotateVectorAboutY = function(vector,angle){

	var angle = A2B.Graphics.degreesToRadians(angle);
	var matrix = new THREE.Matrix4();
	matrix = matrix.makeRotationY(angle);
	matrix.multiplyVector3(vector);
	return vector;
}
