/**
 * @author telecoda
 * 31/10/2012
 */

'use strict';
/** @namespace */
var A2B = A2B || {};

 
A2B.MenuController = function() {
};

A2B.MenuController.createMenuScene = function(menuData,materials) {
	// This method will create a new scene object from the menu data and return it
	var scene = A2B.Graphics.createEmptyScene();
	
	// parse the data in the menuData an add the appropriate objects to the scene
	
	var blocks = A2B.Graphics.createBlocks(menuData.blocks,materials);

	A2B.Graphics.addObjectsToScene(scene,blocks);
	
	var lights = A2B.Graphics.createLights(menuData.lights);
	
	A2B.Graphics.addObjectsToScene(scene,lights);
	
	return scene; 
};


A2B.MenuController.initMenu = function(menuName, onMenuInitialised) {
	// this method initialises a menu from the json file describing the menu.
	// it goes through the following steps:-
	// i.) read menu definition from json file and parse into "menuData" object.
	// ii.) load textures required for menu in menuData.textures held in textures dir
	// iii.) create materials required for menu in menuData.materials
	// iv.) create scene objects for menu in menuData.sceneObjects
	
	// at the end of all this it will call your onMenuInitialised callback ;)
	
	var scope = this;
	
	var menuData = null;
	
	var onMenuLoaded = function(menuJSONData) {
		
		// parse JSON data to an object
		try {
			console.log("MenuController", "Parsing menu JSON - started");
			menuData = JSON.parse(menuJSONData );
			console.log("MenuController", "Parsing menu JSON - ended");

			// JSON is well formed

			console.log("MenuController", "Validating menu data - started");
			var errors = A2B.MenuController.validateMenu(menuData );
			console.log("MenuController", "Validating menu data - ended");
			
			if(errors.length>0) {
				// report errors
				console.log("MenuController", "Validate Menu failed, data has errors");
				console.log("MenuController", errors);
				alert(errors);
			}
			else {
				// continue with menu init
				var textures = A2B.Graphics.loadTextures("textures/",menuData.textures, onTexturesLoaded);
			}		
		} catch ( error ) {

			console.error( error );
			alert(error);

		}
	}

	var onTexturesLoaded = function(textures) {
		// create materials
		var materials = A2B.Graphics.createMaterials(menuData.materials, textures);
		var menuScene = A2B.MenuController.createMenuScene(menuData,materials);
		onMenuInitialised(menuScene);	
	}

	var onMenuError = function(errorDesc) {
		alert(errorDesc);
		console.error(errorDesc);
	}

	
	var url = MENU_PATH+menuName+".json";

	A2B.Utils.asyncFileLoad(url, onMenuLoaded, onMenuError);
	
	
}

/*
A2B.MenuController.mainMenuModeInitScene = function() {

	// This method will create a new scene object from the menu data and return it
	var scene = A2B.Graphics.createEmptyScene();
	
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
*/

A2B.MenuController.validateMenu = function(menuData) {
	/* this method is to validate that the menuData has all the mandatory attributes */
	var errors = [];
	var i=0;
	// name check
	if(menuData.name==undefined) {
		// menu must have a name
		errors[i++]="Menu does not have a name";
	}
	// lights
	if(menuData.lights==undefined) {
		// menu must have at least one light
		errors[i++]="Menu does not have any lights";
	}

	// blocks
	if(menuData.blocks==undefined) {
		// menu must have some blocks to display
		errors[i++]="Menu does not have any blocks";
	}
	
	return errors;
}