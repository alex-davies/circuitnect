import Pixi = require("lib/pixi/3.0.5/pixi");
import Board = require('engine/Board');
import Hex = require('engine/Hex');
import Tile = require('engine/Tile');
import Hashtable = require('util/Hashtable');
import Index = require('util/Index');
import RotateAction = require('engine/action/RotateAction');
import TWEEN = require('lib/tween/0.15.0/tween');

class BoardDisplay extends Pixi.Container {

    constructor(private board: Board, private hexSize: number) {
        super();
        var factory = new TileArtist();
        this.board.getTiles().forEach((tile, i)=> {
            var tileDisplay = factory.drawTile(board, tile, this.hexSize);
            var cartPoint = Hex.ToCartesianPoint(tile.position, hexSize, Hex.CartesianOrientation.FlatTop);
            tileDisplay.position.x = cartPoint.x;
            tileDisplay.position.y = cartPoint.y;
            this.addChild(tileDisplay);
        });

        this.hitArea = new Pixi.Rectangle(-400, -300, 800, 600);
        var eventy:any = this;
        eventy.interactive = true;
        eventy.on('click',function(event){
            var point = event.data.getLocalPosition(this);
            var hexPoint = Hex.ToHexPoint(point, this.hexSize, Hex.CartesianOrientation.FlatTop);

            //rotate the tile clockwise
            board.ExecuteAction(new RotateAction(hexPoint, 1));
        });
    }



}

interface MyTileDisplay extends Pixi.DisplayObject{
    adjustToPaths(paths:Hex.DirectionSet)
    adjustToActive(paths:Hex.DirectionSet)
}

class TileArtist{
    static center = {x:0,y:0};
    static outerCorners = new Hashtable<Hex.Direction, {x:number;y:number}>();
    static outerSides = new Hashtable<Hex.Direction, {x:number;y:number}>();
    static innerCorners = new Hashtable<Hex.Direction, {x:number;y:number}>();
    static innerSides = new Hashtable<Hex.Direction, {x:number;y:number}>();

    static ctor = (()=>{
        var dimensions = Hex.CartesianDimensions(40,  Hex.CartesianOrientation.FlatTop);
        var width = dimensions.width;
        var height = dimensions.height;
        var halfWidth = width/2;
        var halfHeight = height/2;
        var quarterWidth = width/4;
        var quarterHeight = height/4;

        var midPoint = (p1:{x:number;y:number}, p2:{x:number;y:number})=>{
            return {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2,
            }
        };
        var scale = (p1:{x:number;y:number}, factor)=>{
            return {
                x: p1.x * factor,
                y: p1.y * factor,
            }
        };

        var outerCorners = TileArtist.outerCorners;
        outerCorners.put(Hex.Direction.pos_a, {x:quarterWidth,y:halfHeight} );
        outerCorners.put(Hex.Direction.pos_b, {x:-quarterWidth,y:halfHeight} );
        outerCorners.put(Hex.Direction.neg_a_pos_b, {x:-halfWidth,y:0} )
        outerCorners.put(Hex.Direction.neg_a, {x:-quarterWidth,y:-halfHeight} );
        outerCorners.put(Hex.Direction.neg_b, {x:quarterWidth,y:-halfHeight} );
        outerCorners.put(Hex.Direction.pos_a_neg_b, {x:halfWidth,y:0} );

        var outerSides = TileArtist.outerSides
        outerSides.put(Hex.Direction.pos_b, midPoint(
            outerCorners.get(Hex.Direction.pos_b),
            outerCorners.get(Hex.Direction.pos_a)));

        outerSides.put(Hex.Direction.pos_a, midPoint(
            outerCorners.get(Hex.Direction.pos_a),
            outerCorners.get(Hex.Direction.pos_a_neg_b)));

        outerSides.put(Hex.Direction.pos_a_neg_b, midPoint(
            outerCorners.get(Hex.Direction.pos_a_neg_b),
            outerCorners.get(Hex.Direction.neg_b)));

        outerSides.put(Hex.Direction.neg_b, midPoint(
            outerCorners.get(Hex.Direction.neg_b),
            outerCorners.get(Hex.Direction.neg_a)));

        outerSides.put(Hex.Direction.neg_a, midPoint(
            outerCorners.get(Hex.Direction.neg_a),
            outerCorners.get(Hex.Direction.neg_a_pos_b)));

        outerSides.put(Hex.Direction.neg_a_pos_b, midPoint(
            outerCorners.get(Hex.Direction.neg_a_pos_b),
            outerCorners.get(Hex.Direction.pos_b)));



        var innerScaleFactor = 0.5;

        var innerCorners = TileArtist.innerCorners;
        outerCorners.entries().forEach((e)=>{
            innerCorners.put(e.key, scale(e.value, innerScaleFactor))
        });

        var innerSides = TileArtist.innerSides;
        outerSides.entries().forEach((e)=>{
            innerSides.put(e.key, scale(e.value, innerScaleFactor))
        });

    })();


    drawTile(board:Board, tile:Tile, hexSize:number):Pixi.DisplayObject{

        var initialPaths = tile.paths();

        var graphics = this.drawDirections(new Pixi.Graphics(), initialPaths.values(), hexSize, 0x00FF00);

        tile.paths.observe((change)=>{

            var currentTurns = (Math.round(graphics.rotation / (Math.PI / 3)) % 6);
            //check how many turns we need to make on top of our current turns so
            //we have the same paths as the new direction set
            for(var i=0;i<6;i++){
                var targetTurns = (currentTurns + i) % 6;
                if(initialPaths.turn(targetTurns).equals(change.newValue)) {
                    console.log(currentTurns+"->"+targetTurns);
                    var targetRotation = targetTurns * (Math.PI / 3);

                    //ensure we keep turning clockwise
                    if(targetRotation < graphics.rotation)
                        targetRotation += Math.PI * 2;

                    var tween = new TWEEN.Tween( { rt: graphics.rotation } )
                        .to( { rt: targetRotation }, 300 )
                        .easing( TWEEN.Easing.Elastic.Out )
                        .onUpdate( function () {
                            graphics.rotation = this.rt;
                        })
                        .start();
                    break;
                }
            }
        });

        return graphics;

    }



    private drawDirections(graphics:Pixi.Graphics, directions:Hex.Direction[], hexSize:number, color:number):Pixi.Graphics{
        graphics.lineStyle(14, color, 1);

        for(var i=0;i<directions.length;i++){
            var side = TileArtist.outerSides.get(directions[i]);
            side = {
                x:side.x,
                y:side.y
            }

            graphics.moveTo(TileArtist.center.x,TileArtist.center.y);
            graphics.lineTo(side.x, side.y);

        }

        //add a circle on the joint to hide the line joins
        if(directions.length > 0) {
            graphics.lineStyle(0, color, 1);
            graphics.beginFill(color)
            graphics.drawCircle(TileArtist.center.x, TileArtist.center.y, 7)
            graphics.endFill()
        }

        return graphics;
    }
}

class TileDisplay extends Pixi.Container{



    constructor(private tile: Tile, private hexSize: number) {
        super();

        var hexagon = this.createHexagon(hexSize, 0xaaaaaa);
        //this.addChild(hexagon);

        this.alignTexture();

        var cartPoint = Hex.ToCartesianPoint(this.tile.position, this.hexSize, Hex.CartesianOrientation.FlatTop);
        this.position.x = cartPoint.x;
        this.position.y = cartPoint.y;

        tile.paths.observe((change)=>{
            this.alignTexture()
        });
    }

    sprite:Pixi.DisplayObject;
    spriteTextureName:string;
    mask:Pixi.Graphics;

    private alignTexture(){
        var toCanonical = this.tile.paths().turnsToCanonical();
        var spriteName = this.getSpriteName(toCanonical.canonical);

        //the sprite we created before is different the one we are now
        //we will remove our old sprite and add pos_b new one
        if(spriteName !== this.spriteTextureName){


            this.removeChild(this.sprite);
            this.removeChild(this.mask);

            this.spriteTextureName = spriteName;
            //this.sprite = new Pixi.Sprite(Pixi.Texture.fromImage(spriteName));
            //this.sprite = new TileArtist().drawTile(this.tile, this.hexSize)
            this.addChild(this.sprite);

            var dimensions = Hex.CartesianDimensions(this.hexSize, Hex.CartesianOrientation.FlatTop);
            //this.sprite.width = dimensions.width;
            //this.sprite.height = dimensions.width;
            //this.sprite.anchor.x = 0.5;
            //this.sprite.anchor.y = 0.5;
            //this.sprite.tint = 0x00FF00;

            this.mask = this.sprite.mask = this.createHexagon(this.hexSize, 0x000000,0x000000);
            this.addChild(this.mask);
            this.sprite.mask = this.mask;
        }

        //this.sprite.rotation = toCanonical.turns * (Math.PI / 3);
        //var fromRotation = this.normalizeRadians(this.sprite.rotation);
        //var toRotation = this.normalizeRadians(-toCanonical.turns * (Math.PI / 3));
        //console.log(toCanonical.turns);
        //while(toRotation < fromRotation){
        //    toRotation += Math.PI * 2
        //}
        //
        //var self=this;
        //console.log(fromRotation, toRotation);
        //var tween = new TWEEN.Tween( { rt: fromRotation } )
        //    .to( { rt: toRotation }, 100 )
        //    .easing( TWEEN.Easing.Quadratic.Out )
        //    .onUpdate( function () {
        //        self.sprite.rotation = this.rt;
        //    })
        //    .start();

    }

    private normalizeRadians(rads)
    {
        while(rads < 0)
            rads+=Math.PI*2;
        while(rads > Math.PI * 2)
            rads -= Math.PI*2
        return rads;
    }
    private getSpriteName(directionSet:Hex.DirectionSet){
        var name = ''
        name += directionSet.contains(Hex.Direction.pos_b) ? '1' : '0';
        name += directionSet.contains(Hex.Direction.pos_a) ? '1' : '0';
        name += directionSet.contains(Hex.Direction.pos_a_neg_b) ? '1' : '0';
        name += directionSet.contains(Hex.Direction.neg_b) ? '1' : '0';
        name += directionSet.contains(Hex.Direction.neg_a) ? '1' : '0';
        name += directionSet.contains(Hex.Direction.neg_a_pos_b) ? '1' : '0';

        return name+'.png'
    }

    private createHexagon(hexSize:number, lineColor:number, fillColor?:number):Pixi.Graphics {
        var dimensions = Hex.CartesianDimensions(hexSize,  Hex.CartesianOrientation.FlatTop);
        var width = dimensions.width;
        var height = dimensions.height;
        var halfWidth = width/2;
        var halfHeight = height/2;
        var quarterWidth = width/4;
        var quarterHeight = height/4;

        var hasFill = typeof fillColor !== "undefined";

        var graphics = new Pixi.Graphics();
        if(hasFill) { graphics.beginFill(fillColor);}
        graphics.lineStyle(2, 0xaaaaaa, 1);
        graphics.moveTo(-halfWidth,0);
        graphics.lineTo(-quarterWidth, halfHeight);
        graphics.lineTo(quarterWidth, halfHeight);
        graphics.lineTo(halfWidth, 0);
        graphics.lineTo(quarterWidth, -halfHeight);
        graphics.lineTo(-quarterWidth, -halfHeight);
        if(hasFill) { graphics.endFill();}
        else{graphics.lineTo(-halfWidth,0);}

        return graphics;
    }

}

export = BoardDisplay;
