/**
 * @author telecoda
 * 31/10/2012
 */

'use strict';
/** @namespace */
var A2B = A2B || {};

 
A2B.MenuController = function() {
};



A2B.MenuController.mainMenuModeInitScene = function() {

	// This method will create a new scene object from the level data and return it
	var scene = A2B.createEmptyScene();
	
    var materials = A2B.initMaterials('images');
	// add ground for scene
	var ground_material = materials["rock"];

	var floor = new Physijs.BoxMesh(new THREE.CubeGeometry(100, 1, 100), ground_material, 0 // mass
	);
	floor.receiveShadow = true;
	scene.add(floor);

	var wood_material = materials["wood"];

	var fontProps = A2B.initFontProps();
	// create A2B title mesh
	var a2bMesh = A2B.createTextMesh("A2B", wood_material, fontProps);
	// scale
	a2bMesh.scale = new THREE.Vector3(0.2, 0.2, 0.2);
	// position
	a2bMesh.position = new THREE.Vector3(-15, 5, 10);
	a2bMesh.rotation = new THREE.Vector3(A2B.degreesToRadians(-30), 0, 0);
	a2bMesh.castShadow = true;
	a2bMesh.receiveShadow = true;
	scene.add(a2bMesh);

	// create by Telecoda mesh
	var fontProps = A2B.initFontProps();
	fontProps.bend = false;
	fontProps.size = 25;
	var telecodaMesh = A2B.createTextMesh("by Telecoda", wood_material, fontProps);
	// scale
	telecodaMesh.scale = new THREE.Vector3(0.2, 0.2, 0.2);
	// position
	telecodaMesh.position = new THREE.Vector3(-15, 5, 30);
	telecodaMesh.rotation = new THREE.Vector3(A2B.degreesToRadians(-60), 0, 0);
	telecodaMesh.castShadow = true;
	telecodaMesh.receiveShadow = true;
	scene.add(telecodaMesh);

	// create by start mesh
	var start_material = materials["brick"];

	var fontProps = A2B.initFontProps();
	fontProps.bend = false;
	fontProps.size = 25;
	var startMesh = A2B.createTextMesh("Start Game!", start_material, fontProps);
	// scale
	startMesh.scale = new THREE.Vector3(0.2, 0.2, 0.2);
	// position
	startMesh.position = new THREE.Vector3(-15, 5, 50);
	startMesh.rotation = new THREE.Vector3(A2B.degreesToRadians(-90), 0, 0);
	startMesh.material.color.setHex(0x0000ff);

	startMesh.castShadow = true;
	startMesh.receiveShadow = true;
	scene.add(startMesh);

	//var mc = THREE.CollisionUtils.MeshColliderWBox(startMesh);
	//THREE.Collisions.colliders.push( mc );

	//var text = new Physijs.Mesh(text_geo
	//	,
	//	wood_material,
	//	0 // mass
	//	);

	// add directional light to scene
	var dirLight = A2B.getDirectionalLight();
	dirLight.position.set(20, 40, 25);
	dirLight.target.position.copy(scene.position);

	scene.add(dirLight);

	return scene;
};

