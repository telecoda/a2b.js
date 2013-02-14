'use strict';
/** @namespace */
var A2B	= A2B 		|| {};

A2B.Graphics = function() {
};

A2B.Graphics.addObjectsToScene = function(scene, objects) {

	// iterate through a list of objects to add
	var len=objects.length;

	for(var i=0; i<len; i++) {
		scene.add(objects[i]);
	};
};

/*
 * clear all objects from a scene, iterate through child objects
 */
A2B.Graphics.clearSceneObjects = function(sceneObject) {
	var children = sceneObject.children;
	for (var i = children.length - 1; i >= 0; i--) {
		var child = children[i];
		A2B.Graphics.clearSceneObjects(child);
		sceneObject.remove(child);
	};
}


A2B.Graphics.createBlocks = function(blocksToCreate,materials) {

	// blocksToCreate is a list of objects in the following format
	/*
	  
"blocks" :
				  	[
				  		{ 
				  			"name" 			: "main_floor",
				  			"material" 		: "ground_material",
				  			"dimensions"		: {"x":20,"y":1,"z":20},
				  			"position"		: {"x":0,"y":0,"z":0},
							"rotation"		: {"x":0,"y":45,"z":0},
							"mass" 		: 0
				  		},
		  		
	  etc..	
	  
	 */

	var blocks=[];
	var b=0;
	
	// iterate through a list of blocks to create
	var len=blocksToCreate.length;

	for(var i=0; i<len; i++) {
		var blockToCreate = blocksToCreate[i];
		
		var material = materials[blockToCreate.material];
			if(material==undefined){
				alert("Block:" + blockToCreate.name + " Material:" + blockToCreate.material + " is not found.");
			}
		
		var block = new Physijs.BoxMesh(new THREE.CubeGeometry(blockToCreate.dimensions.x,blockToCreate.dimensions.y,blockToCreate.dimensions.z), material, blockToCreate.mass);
		var positionVector = new THREE.Vector3(blockToCreate.position.x,blockToCreate.position.y,blockToCreate.position.z);
		var rotationVector = new THREE.Vector3(blockToCreate.rotation.x,blockToCreate.rotation.y,blockToCreate.rotation.z);
		block.position = positionVector;
		block.rotation = rotationVector;
		var props = blockToCreate.props;
		for ( var key in props ) {

			var newValue = props[ key ];

			if ( newValue === undefined ) {
	
				console.warn( 'createBlock: \'' + key + '\' parameter is undefined.' );
				continue;
	
			}
			else {
				block[ key ] = newValue;
			}
		}
		//block.receiveShadow = true;
		//block.castShadow = true;
		block.name = blockToCreate.name;
		// add to list
		
		blocks[b++]=block;
			
	}

	return blocks;

}


A2B.Graphics.createEmptyScene = function() {

	var scene = new Physijs.Scene;
	scene.setGravity({
		x : 0,
		y : -20,
		z : 0
	});

	return scene;
}


A2B.Graphics.createLight = function(name, colour, type, position, targetPosition, props) {
		var light;
		// Light
		switch(type) {
			case "spot":
				light = new THREE.SpotLight(colour );
				break;
			case "directional":
				light = new THREE.DirectionalLight(colour );
				break;
			case "ambient":
				light = new THREE.AmbientLight(colour );
				break;
			case "point":
				light = new THREE.PointLight(colour );
				break;
			default:
				alert("Cannot create a light of type:"+type);
				return;
		}
	
		light.position = position;
		light.target.position.copy(targetPosition);
		light.name = name;
		
		for ( var key in props ) {

			var newValue = props[ key ];

			if ( newValue === undefined ) {
	
				console.warn( 'createLight: \'' + key + '\' parameter is undefined.' );
				continue;
	
			}
			else {
				light[ key ] = newValue;
			}
		}
		
		return light;
		};


A2B.Graphics.createLights = function(lightsToCreate) {

	var lights =[];
	var l=0;
	// iterate through a list of lights to create
	var len=lightsToCreate.length;

	for(var i=0; i<len; i++) {
		var lightToCreate = lightsToCreate[i];

		var positionVector = new THREE.Vector3(lightToCreate.position.x,lightToCreate.position.y,lightToCreate.position.z);
		var targetVector = new THREE.Vector3(lightToCreate.targetPosition.x,lightToCreate.targetPosition.y,lightToCreate.targetPosition.z);
		
		var light = A2B.Graphics.createLight(lightToCreate.name,lightToCreate.colour,lightToCreate.type, positionVector, targetVector,lightToCreate.props);
		
		// add to light to list
		lights[l++]=light;
	}

	return lights;

}



A2B.Graphics.createMaterials = function(materialsToCreate, textures) {

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


A2B.Graphics.createSpheres = function(spheresToCreate,materials) {

	// sphereToCreate is a list of objects in the following format
	/*
	  
	"spheres" :
				  	[
				  		{ 
				  			"name" 			: "mainBall",
				  			"material" 		: "player_material",
				  			"dimensions"	: {"radius":5,"segmentsWidth":16,"segmentsHeight":16},
				  			"position"		: {"x":0,"y":10,"z":},
							"rotation"		: {"x":0,"y":0,"z":0},
							"props" :  {"castShadow" : true ,
										"receiveShadow" : true
										},
							"mass" 		: 50
				  		}

		  		
	  etc..	
	  
	 */

	var spheres=[];
	var s=0;
	
	// iterate through a list of spheres to create
	var len=spheresToCreate.length;

	for(var i=0; i<len; i++) {
		var sphereToCreate = spheresToCreate[i];
		
		var material = materials[sphereToCreate.material];
			if(material==undefined){
				alert("Sphere:" + sphereToCreate.name + " Material:" + sphereToCreate.material + " is not found.");
			}
		

		var sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(sphereToCreate.dimensions.radius,sphereToCreate.dimensions.segmentsWidth,sphereToCreate.dimensions.segmentsHeight), material, sphereToCreate.mass);
		var positionVector = new THREE.Vector3(sphereToCreate.position.x,sphereToCreate.position.y,sphereToCreate.position.z);
		var rotationVector = new THREE.Vector3(sphereToCreate.rotation.x,sphereToCreate.rotation.y,sphereToCreate.rotation.z);
		sphere.position = positionVector;
		sphere.rotation = rotationVector;
		var props = sphereToCreate.props;
		for ( var key in props ) {

			var newValue = props[ key ];

			if ( newValue === undefined ) {
	
				console.warn( 'createSphere: \'' + key + '\' parameter is undefined.' );
				continue;
	
			}
			else {
				sphere[ key ] = newValue;
			}
		}
		//sphere.receiveShadow = true;
		//sphere.castShadow = true;
		sphere.name = sphereToCreate.name;
		// add to list
		
		spheres[s++]=sphere;
			
	}

	return spheres;

}


/*
 * Create a text mesh for rendering.  fontProps is an object from initFontProps()
 */
A2B.Graphics.createTextMesh = function(text, faceMaterial, fontProps) {





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
A2B.Graphics.degreesToRadians = function(degrees) {

	return degrees * (Math.PI / 180);
}



/*
 * returns fontProps object for use with createTextMesh
 */
A2B.Graphics.initFontProps = function() {

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


var onLoad = function(event) {
    console.log("Loaded texture worked.");
	
}

var onError = function(event) {
	alert(event);
    console.log("Loaded texture failed.");
 
}

A2B.Graphics.loadTexture = function(path, filename) {

	var fullPath = path+filename;


	var loadStatus = "not loaded";
	console.log("Starting loading texture.");
	console.log("path:"+path+" filename:"+filename);
	
	var texture = THREE.ImageUtils.loadTexture(fullPath,null, onLoad, onError);
	
	 
	return texture;		

}





A2B.Graphics.loadTextures = function(path, texturesToLoad, onTexturesLoaded) {
	
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
		textures[textureToLoad['name']]=A2B.Graphics.loadTexture(path,textureToLoad['file']);
	}

	onTexturesLoaded(textures);

}

