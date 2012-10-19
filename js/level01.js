'use strict';
/** @namespace */
var A2B	= A2B 		|| {};

A2B.addPlayer = function(levelNumbercurrentScene) {
		//////////////////////
		// Add players ball //
		//////////////////////

		var playersSphere = new Physijs.SphereMesh(
				new THREE.SphereGeometry( 5, 16, 16 ),
				wood_material
			);
		playersSphere.position.set(
			35,
			10 ,
			35
		);
		playersSphere.rotation.set(0,0,0);
		playersSphere.castShadow = true;
		currentScene.add( playersSphere );

		return playersSphere;

};


A2B.initLevel = function(levelNumber, currentScene) {
		// init level
		/* for now EVERYTHING is level 1 */
	
		// add ground for scene
		///////////////////
		// Create Ground //
		///////////////////

		var ground_material = materials["rock"];

		var floor = new Physijs.BoxMesh(
			new THREE.CubeGeometry(100, 1, 100),
			ground_material,
			0 // mass
		);
		floor.receiveShadow = true;
		currentScene.add( floor );
		
		
		////////////////////////
		// Create Brick walls //
		////////////////////////

		// ground is 100 X 1000
		// build an inner wall

		var brick_material = materials["brick"];

		// front wall
		for ( var i = 0; i < 18; i++ ) {
			var brick = new Physijs.BoxMesh(
				new THREE.CubeGeometry( 4.5, 4.5, 4.5 ),
				brick_material,5000
			);
			brick.position.set(
				-45 +(i * 5) , 5+i ,45
			);
			brick.rotation.set(0,0,0);

			brick.castShadow = true;
			currentScene.add( brick );
			//bricks.push( brick );
		}

		// right wall
		for ( var i = 0; i < 18; i++ ) {
			var brick = new Physijs.BoxMesh(
				new THREE.CubeGeometry( 4.5, 4.5, 4.5 ),
				brick_material,5000
			);
			brick.position.set(
				45 , 5+i ,45 -(i * 5)
			);
			brick.rotation.set(0,0,0);

			brick.castShadow = true;
			currentScene.add( brick );
			//bricks.push( brick );
		}

		// left wall
		for ( var i = 0; i < 18; i++ ) {
			var brick = new Physijs.BoxMesh(
				new THREE.CubeGeometry( 4.5, 4.5, 4.5 ),
				brick_material,5000
			);
			brick.position.set(
				-45 , 5+i ,-45 +(i * 5)
			);
			brick.rotation.set(0,0,0);

			brick.castShadow = true;
			currentScene.add( brick );
			//bricks.push( brick );
		}



		// back wall
		for ( var i = 0; i < 18; i++ ) {
			var brick = new Physijs.BoxMesh(
				new THREE.CubeGeometry( 4.5, 4.5, 4.5 ),
				brick_material,5000
			);
			brick.position.set(
				+45 -(i * 5) , 5+i ,-45
			);
			brick.rotation.set(0,0,0);

			brick.castShadow = true;
			currentScene.add( brick );
			//bricks.push( brick );
		}


		////////////////////////
		// Create Start Block //
		////////////////////////

		var blockA_material = materials["blockA"];

		var	startBlock = new Physijs.BoxMesh(
				new THREE.CubeGeometry( 10, 0.1, 10 ),
				blockA_material,500
			);
		startBlock.position.set(
				35,
				5,
				35
			);
		startBlock.rotation.set(0,0,0);
		startBlock.castShadow = false;
		currentScene.add( startBlock );

		var blockA_material = materials["blockA"];


		////////////////////////
		// Create End Block //
		////////////////////////

		var blockB_material = materials["blockB"];

		var	endBlock = new Physijs.BoxMesh(
				new THREE.CubeGeometry( 10, 0.1, 10 ),
				blockB_material,500
			);
		endBlock.position.set(
				-35,
				5,
				-35
			);
		endBlock.rotation.set(0,0,0);
		endBlock.castShadow = false;
		currentScene.add( endBlock );


		var wood_material = materials["wood"];



/*
		////////////////////
		// Create Spheres //
		////////////////////

		for ( var i = 0; i < 10; i++ ) {
			var sphere = new Physijs.SphereMesh(
				new THREE.SphereGeometry( 2, 16, 16 ),
				wood_material
			);
			sphere.position.set(
				Math.random() * 50 - 25,
				10 + Math.random() * 5,
				Math.random() * 50 - 25
			);
			sphere.rotation.set(
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2
			);
			sphere.castShadow = true;
			currentScene.add( sphere );
			//spheres.push( sphere );
		}
*/
	// add directional light to scene
	var dirLight = A2B.getDirectionalLight();
	dirLight.position.set( 20, 40, -15 );
	dirLight.target.position.copy( currentScene.position );
		
	currentScene.add( dirLight );

	// add spotlight to scene
	var spotLight = A2B.getSpotLight();
	spotLight.position.set( 20, 40, -15 );
	spotLight.target.position.copy( currentScene.position );
		
	//currentScene.add( spotLight );


};
