 // gamestats.js  based upon stats by Mr doob - http://github.com/mrdoob/stats.js
var GameStats = function() {
    var mainDiv, background = [[16, 16, 48], [0, 255, 255]];
    mainDiv = document.createElement("div");
    mainDiv.style.cursor = "pointer";
    mainDiv.style.width = "100px";
    mainDiv.style.opacity = "0.9";
    mainDiv.style.zIndex = "10001";
    
    innerDiv = document.createElement("div");
    innerDiv.style.textAlign = 
    "left";
    innerDiv.style.lineHeight = "1.2em";
    innerDiv.style.backgroundColor = "rgb(" + Math.floor(background[0][0] / 2) + "," + Math.floor(background[0][1] / 2) + "," + Math.floor(background[0][2] / 2) + ")";
    innerDiv.style.padding = "0 0 3px 3px";
    mainDiv.appendChild(innerDiv);

    scoreDiv = document.createElement("div");
    scoreDiv.style.fontFamily = "Helvetica, Arial, sans-serif";
    scoreDiv.style.fontSize = "9px";
    scoreDiv.style.color = "rgb(" + background[1][0] + "," + background[1][1] + "," + background[1][2] + ")";
    scoreDiv.style.fontWeight = "bold";
    scoreDiv.innerHTML = "Score:";
    innerDiv.appendChild(scoreDiv);
    
    cameraDiv = document.createElement("div");
    cameraDiv.style.fontFamily = "Helvetica, Arial, sans-serif";
    cameraDiv.style.fontSize = "9px";
    cameraDiv.style.color = "rgb(" + background[1][0] + "," + background[1][1] + "," + background[1][2] + ")";
    cameraDiv.style.fontWeight = "bold";
    cameraDiv.innerHTML = "Camera:";
    innerDiv.appendChild(cameraDiv);

    playerDiv = document.createElement("div");
    playerDiv.style.fontFamily = "Helvetica, Arial, sans-serif";
    playerDiv.style.fontSize = "9px";
    playerDiv.style.color = "rgb(" + background[1][0] + "," + background[1][1] + "," + background[1][2] + ")";
    playerDiv.style.fontWeight = "bold";
    playerDiv.innerHTML = "Player:";
    innerDiv.appendChild(playerDiv);

    mouseDiv = document.createElement("div");
    mouseDiv.style.fontFamily = "Helvetica, Arial, sans-serif";
    mouseDiv.style.fontSize = "9px";
    mouseDiv.style.color = "rgb(" + background[1][0] + "," + background[1][1] + "," + background[1][2] + ")";
    mouseDiv.style.fontWeight = "bold";
    mouseDiv.innerHTML = "Mouse:";
    innerDiv.appendChild(mouseDiv);

    return {domElement: mainDiv,update: function() {
            scoreDiv.textContent = "Score:"+game.getScore()+"\n"+"Lives:"+game.getLives();
            cameraDiv.textContent = "Camera x:"+game.camera.position.x+" y:"+game.camera.position.y+" z:"+game.camera.position.z;
            if(game.player!=undefined) {
            	playerDiv.textContent = "Player x:"+game.player.getX()+" y:"+game.player.getY()+" z:"+game.player.getZ();
            };
            mouseDiv.textContent = "Mouse x:"+game.getMousePosition().x+" y:"+game.getMousePosition().y;
        }}
};

