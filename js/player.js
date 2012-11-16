'use strict';
/** @namespace */
var A2B	= A2B 		|| {};

A2B.Player	= function()
{

	this.playersMesh.collisions=0;
	this.playersMesh.addEventListener( 'collision', this.handleCollision );
	
};

A2B.Player.prototype

A2B.Player.prototype.getMesh = function() {
	return this.playersMesh;
}

/*
 * Return x position of player
 */
A2B.Player.prototype.getX = function() {
	return this.playersMesh.position.x;
};

/*
 * Return y position of player
 */
A2B.Player.prototype.getY = function() {
	return this.playersMesh.position.y;
};

/*
 * Return z position of player
 */
A2B.Player.prototype.getZ = function() {
	return this.playersMesh.position.z;
};



/*
 * collision handling callback for player
 */
A2B.Player.prototype.handleCollision = function( collided_with, linearVelocity, angularVelocity ) {
				if(collided_with.name=="startBlock")
				{
					this.material.color.setHex(0x00ff00);
				}
				if(collided_with.name=="endBlock")
				{
					this.material.color.setHex(0xff0000);
				}
				/*switch ( ++this.collisions ) {
					
					case 1:
						this.material.color.setHex(0xcc8855);
						break;
					
					case 2:
						this.material.color.setHex(0xbb9955);
						break;
					
					case 3:
						this.material.color.setHex(0xaaaa55);
						break;
					
					case 4:
						this.material.color.setHex(0x99bb55);
						break;
					
					case 5:
						this.material.color.setHex(0x88cc55);
						break;
					
					case 6:
						this.material.color.setHex(0x77dd55);
						break;
				}*/
			};

/*
 * move player backwarss when key pressed
 */
A2B.Player.prototype.moveBackwards = function(cameraPosition) {

	var angle =0;

	this.pushPlayer(cameraPosition,angle);
};


/*
 * move player forwards when key pressed
 */
A2B.Player.prototype.moveForwards = function(cameraPosition) {
	var angle =180;

	this.pushPlayer(cameraPosition,angle);


	
};

/*
 * move player left when key pressed
 */
A2B.Player.prototype.moveLeft = function(cameraPosition) {
	var angle =270;

	this.pushPlayer(cameraPosition,angle);
};

/*
 * move player right when key pressed
 */
A2B.Player.prototype.moveRight = function(cameraPosition) {
	var angle =90;

	this.pushPlayer(cameraPosition,angle);

};

/*
 * apply force to player relative to direction camera is facing
 */
A2B.Player.prototype.pushPlayer = function(cameraPosition,angle){
	var strength=1;
	
	var forceVector = cameraPosition.clone();

	// flatten y - we push on flat surface
	forceVector.y=0; 

	forceVector = this.rotateVectorAboutY(forceVector,angle);

	forceVector = forceVector.multiplyScalar(strength);
	this.playersMesh.applyCentralImpulse(forceVector);


}


A2B.Player.prototype.rotateVectorAboutY = function(vector,angle){

	var angle = A2B.degreesToRadians(angle);
	var matrix = new THREE.Matrix4();
	matrix = matrix.makeRotationY(angle);
	matrix.multiplyVector3(vector);
	return vector;
}
