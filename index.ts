import Pixi = require("lib/pixi/3.0.5/pixi");
import Board = require('engine/Board')
import BoardDisplay = require('ui/BoardDisplay')
import TWEEN = require('lib/tween/0.15.0/tween');
//var renderer = Pixi.autoDetectRenderer(800, 600,{backgroundColor : 0x1099bb});
//document.body.appendChild(renderer.view);
//
//// create the root of the scene graph
//var stage = new Pixi.Container();
//
//// create pos_b texture from an image path
//var texture = Pixi.Texture.fromImage('ui/assets/sprites/actors/mole.png');
//
//// create pos_b new Sprite using the texture
//var bunny = new Pixi.Sprite(texture);
//
//// center the sprite's anchor point
//bunny.anchor.x = 0.5;
//bunny.anchor.y = 0.5;
//
//// move the sprite to the center of the screen
//bunny.position.x = 200;
//bunny.position.y = 150;
//
//stage.addChild(bunny);
//
//// start animating
//animate();
//function animate() {
//    requestAnimationFrame(animate);
//
//    // just for fun, let's rotate mr rabbit pos_b little
//    bunny.rotation += 0.1;
//
//    // render the container
//    renderer.render(stage);
//}



var board: Board = new Board(3);
var boardDisplay: BoardDisplay;

// You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer
var renderer = Pixi.autoDetectRenderer(800, 600,{backgroundColor : 0x1099bb, antialias: true});
document.body.appendChild(renderer.view);

//
Pixi.loader.add('terrain','ui/assets/sprites/sprites.json');
Pixi.loader.once('complete',() => {

    boardDisplay = new BoardDisplay(board,40);
    boardDisplay.position.x = 400;
    boardDisplay.position.y = 300;

    Pixi.ticker.shared.add(function (time) {
        TWEEN.update();
        renderer.render(boardDisplay);
    });
});
Pixi.loader.load();



//function animate() {
//
//    var now = +Date.now();
//    lastAnimateTime = lastAnimateTime || now;
//
//    world.tick(now - lastAnimateTime);
//    renderer.render(stage);
//
//    lastAnimateTime = now;
//
//    requestAnimationFrame(animate);
//}

