'use strict';
/** @namespace */
var A2B	= A2B 		|| {};

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

		var rock_material = materials["rock"];


		//////////////////
		// Create Boxes //
		//////////////////
		
		for ( var i = 0; i < 10; i++ ) {
			var	box = new Physijs.BoxMesh(
				new THREE.CubeGeometry( 4, 4, 4 ),
				rock_material,500
			);
			box.position.set(
				Math.random() * 50 - 25,
				10 + Math.random() * 5,
				Math.random() * 50 - 25
			);
			box.rotation.set(
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2
			);
			box.castShadow = true;
			currentScene.add( box );
			//boxes.push( box );
		}


		var wood_material = materials["wood"];

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


	// add player to scene
};
