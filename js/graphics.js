'use strict';
/** @namespace */
var A2B	= A2B 		|| {};

A2B.createEmptyScene = function() {

	var scene = new Physijs.Scene;
	scene.setGravity({
		x : 0,
		y : -20,
		z : 0
	});

	return scene;
}


A2B.createMaterials = function(materialsToCreate, textures) {

	// materialsToCreate is a list of objects in the following format
	/*
	  
	  	[
	  		{ 
	  			"name" 			: "material1",
	  			"texture" 		: "wood",
				"repeatX"		: 0.25,
				"repeatY"		: 0.25,
				"friction" 		: 0.8,
				"restitution"	: 0.4
	  		},
	  		{ 
	  			"name" 			: "material2",
	  			"texture" 		: "rock",
				"repeatX"		: 0.25,
				"repeatY"		: 0.25,
				"friction" 		: 0.6,
				"restitution"	: 0.6
	  		}
	  	]
	  
	  		
	  	
	  }
	 */

	var materials={};

	// iterate through a list of materials to create
	var len=materialsToCreate.length;

	for(var i=0; i<len; i++) {
		var materialToCreate = materialsToCreate[i];
		
		var texture = textures[materialToCreate.texture];
			if(texture==undefined){
				alert("Texture:" + materialToCreate.texture + " is not found.");
			}
			
		var createdMaterial = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: texture }),
			materialToCreate.friction, 
			materialToCreate.restitution
		);
		createdMaterial.map.wrapS = THREE.RepeatWrapping;
		createdMaterial.map.wrapT = THREE.RepeatWrapping;
		createdMaterial.map.repeat.set( materialToCreate.repeatX, materialToCreate.repeatY );

		// add to array
		materials[materialToCreate['name']]=createdMaterial;
	}

	return materials;

		

}


/*
 * Create a text mesh for rendering.  fontProps is an object from initFontProps()
 */
A2B.createTextMesh = function(text, faceMaterial, fontProps) {





	var textGeo = new THREE.TextGeometry( text, fontProps);

	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();

	// "fix" side normals by removing z-component of normals for side faces
	// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

	if ( ! fontProps.bevelEnabled ) {

		var triangleAreaHeuristics = 0.1 * ( fontProps.height * fontProps.size );

		for ( var i = 0; i < textGeo.faces.length; i ++ ) {

			var face = textGeo.faces[ i ];

			if ( face.materials[ 0 ].id == textMaterialSide.id ) {

				for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

					face.vertexNormals[ j ].z = 0;
					face.vertexNormals[ j ].normalize();

				}

				var va = textGeo.vertices[ face.a ].position;
				var vb = textGeo.vertices[ face.b ].position;
				var vc = textGeo.vertices[ face.c ].position;

				var s = THREE.GeometryUtils.triangleArea( va, vb, vc );

				if ( s > triangleAreaHeuristics ) {

					for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

						face.vertexNormals[ j ].copy( face.normal );

					}

				}

			}

		}

	}

	//var centerOffset = -0.5 * ( textGeo.boundingBox.x[ 1 ] - textGeo.boundingBox.x[ 0 ] );
	var centerOffset = -0.5 * ( textGeo.boundingBox.min.x - textGeo.boundingBox.max.x );

	//return textGeo;

	/*var textMesh1 = new Physijs.Mesh(
			textGeo,
			faceMaterial,
			1000 // mass
			);
*/
	var textMesh1 = new THREE.Mesh( textGeo, faceMaterial );
	
	//	parent.addChild( textMesh1 );

	//textMesh1.setAngularVelocity(new THREE.Vector3(0,10,0));

	return textMesh1;

	/*
	if ( mirror ) {

		textMesh2 = new THREE.Mesh( textGeo, faceMaterial );

		textMesh2.position.x = centerOffset;
		textMesh2.position.y = -hover;
		textMesh2.position.z = height;

		textMesh2.rotation.x = Math.PI;
		textMesh2.rotation.y = Math.PI * 2;

		parent.addChild( textMesh2 );

	}*/


};

/*
 * Convert degrees to radians
 */
A2B.degreesToRadians = function(degrees) {

	return degrees * (Math.PI / 180);
}

/*
 * Create a directional light
 */
A2B.getDirectionalLight = function() {
	
		// Light
		var light = new THREE.DirectionalLight( 0xFFFFFF );
		light.castShadow = true;
		light.shadowCameraLeft = -60;
		light.shadowCameraTop = -60;
		light.shadowCameraRight = 60;
		light.shadowCameraBottom = 60;
		light.shadowCameraNear = 0;
		light.shadowCameraFar = 300;
		light.shadowBias = -.0001
		light.shadowMapWidth = light.shadowMapHeight = 2048;
		light.shadowDarkness = .7;
		
		return light;
		};

/*
 * Create a spotlight light
 */
A2B.getSpotLight = function() {
	
		// Light
		var light = new THREE.SpotLight( 0xFF0000 );
		light.castShadow = true;
		light.shadowCameraLeft = -60;
		light.shadowCameraTop = -60;
		light.shadowCameraRight = 60;
		light.shadowCameraBottom = 60;
		light.shadowCameraNear = 20;
		light.shadowCameraFar = 200;
		light.shadowBias = -.0001
		light.shadowMapWidth = light.shadowMapHeight = 2048;
		light.shadowDarkness = .7;
		
		return light;
		};


/*
 * returns fontProps object for use with createTextMesh
 */
A2B.initFontProps = function() {

		var	textMaterialFront = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );
		var	textMaterialSide = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } );

		return  {
								size: 70,
								height: 20,
								curveSegments: 4,
								font: "helvetiker",	// helvetiker, optimer, gentilis, droid sans, droid serif
								weight: "bold",	    // normal bold
								style: "normal",    // italic

								bevelThickness: 2,
								bevelSize: 1.5,
								bevelEnabled: true,

								bend: true,

								material: textMaterialFront,
								extrudeMaterial: textMaterialSide

				};


};

/*
 * Initialise all materials for the game
 * (may be initialised at start of level in future)
 */
A2B.initMaterials = function(path) {

		var materials = {};
		// Materials
		var ground_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( path +'/grass.png' ) }),
			.8, // high friction
			.4 // low restitution
		);
		ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
		ground_material.map.repeat.set( 3, 3 );
		
		materials["ground"]=ground_material;

		var rock_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( path +'/rocks.jpg' ) }),
			.8, // low friction
			.6 // high restitution
		);
		rock_material.map.wrapS = rock_material.map.wrapT = THREE.RepeatWrapping;
		rock_material.map.repeat.set( .25, .25 );

		materials["rock"]=rock_material;

		var brick_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( path +'/plywood.jpg' ) }),
			.8, // low friction
			.6 // high restitution
		);
		brick_material.map.wrapS = brick_material.map.wrapT = THREE.RepeatWrapping;
		brick_material.map.repeat.set( .25, .25 );

		materials["brick"]=brick_material;


		var wood_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( path +'/wood.jpg' ) }),
			.8, // low friction
			.6 // high restitution
		);

		wood_material.map.wrapS = wood_material.map.wrapT = THREE.RepeatWrapping;
		wood_material.map.repeat.set( .25, .25 );

		materials["wood"]=wood_material;

		var blockA_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( path +'/a_block.png' ) }),
			.1, // low friction
			.6 // high restitution
		);

		blockA_material.map.wrapS = blockA_material.map.wrapT = THREE.RepeatWrapping;
		blockA_material.map.repeat.set( 1, 1 );

		materials["blockA"]=blockA_material;

		var blockB_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( path +'/b_block.png' ) }),
			.8, // low friction
			.6 // high restitution
		);

		blockB_material.map.wrapS = blockB_material.map.wrapT = THREE.RepeatWrapping;
		blockB_material.map.repeat.set( 1, 1 );

		materials["blockB"]=blockB_material;


		return materials;
	
	};






var onLoad = function(event) {
    console.log("Loaded texture worked.");
	
}

var onError = function(event) {
	alert(event);
    console.log("Loaded texture failed.");
 
}

A2B.loadTexture = function(path, filename) {

	var fullPath = path+filename;


	var loadStatus = "not loaded";
	console.log("Starting loading texture.");
	
	var texture = THREE.ImageUtils.loadTexture(fullPath,null, onLoad, onError);
	
	 
	return texture;		

}




A2B.loadTextures = function(path, texturesToLoad, onTexturesLoaded) {
	
	// texturesToLoad is a list of objects in the following format
	/*
	  
	  	[
	  		{ 
	  			"name" : "texture1",
	  	  		"file" : "textures1.png"
	  		},
	  		{ 
	  			"name" : "texture2",
	  	  		"file" : "textures2.png"
	  		}
	  	]
	  
	  		
	  	
	  }
	 */

	var textures={};

	// iterate through a list of textures
	var len=texturesToLoad.length;

	for(var i=0; i<len; i++) {
		var textureToLoad = texturesToLoad[i];
		textures[textureToLoad['name']]=A2B.loadTexture(path,textureToLoad['file']);
	}

	onTexturesLoaded(textures);

}


A2B.loadMaterial = function(friction, restitution, texture) {

		var material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( path +'/grass.png' ) }),
			.8, // high friction
			.4 // low restitution
		);
		ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
		ground_material.map.repeat.set( 3, 3 );
		

}
