import Pixi = require("lib/pixi/3.0.5/pixi");
import Board = require('engine/Board')
import Hex = require('engine/Hex')
import Tile = require('engine/Tile')
import Hashtable = require('util/Hashtable')
import RotateAction = require('engine/action/RotateAction')

class BoardDisplay extends Pixi.Container {
    board:Board;
    hexSize:number;
    tileDisplays:Hashtable<Hex.Point, TileDisplay> = new Hashtable<Hex.Point, TileDisplay>();


    constructor(board: Board, hexSize: number) {
        super();
        this.hexSize = hexSize;
        this.board = board;

        this.adjustTiles();

        this.hitArea = new Pixi.Rectangle(-400, -300, 800, 600);
        var eventy:any = this;
        eventy.interactive = true;
        eventy.on('click',function(event){
            var point = event.data.getLocalPosition(this);
            var hexPoint = Hex.ToHexPoint(point, this.hexSize, Hex.CartesianOrientation.FlatTop);

            //rotate the tile clockwise
            board.ExecuteAction(new RotateAction(hexPoint, -1));
        });
    }

    private adjustTiles(){

        var newTileDisplays = new Hashtable<Hex.Point, TileDisplay>();
        this.board.getTiles().forEach((tile, i)=> {
            var tileDisplay = this.tileDisplays.get(tile.hexPoint);
            if(!tileDisplay) {
                tileDisplay = new TileDisplay(tile.tile, this.hexSize);
                this.addChild(tileDisplay);
            }

            var cartPoint = Hex.ToCartesianPoint(tile.hexPoint, this.hexSize, Hex.CartesianOrientation.FlatTop);
            tileDisplay.x = cartPoint.x;
            tileDisplay.y = cartPoint.y;
            newTileDisplays.put(tile.hexPoint, tileDisplay);
        });

        //remove items we had before but are no longer in our list
        this.tileDisplays.entries().forEach((kvp, i)=>{
            var newItem = newTileDisplays.get(kvp.key);
            if(!newItem || newItem != kvp.value){
                this.removeChild(kvp.value);
            }
        });

        //set our new tile displays
        this.tileDisplays = newTileDisplays;

    }


}

class TileDisplay extends Pixi.Container{



    constructor(private tile: Tile, private hexSize: number) {
        super();

        var hexagon = this.createHexagon(hexSize, 0xaaaaaa);
        this.addChild(hexagon);

        this.alignTexture();

        tile.paths.observe((change)=>{
            this.alignTexture()
        });
    }

    sprite:Pixi.Sprite;
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

            this.sprite = new Pixi.Sprite(Pixi.Texture.fromImage(spriteName));
            this.addChild(this.sprite);
            var dimensions = Hex.CartesianDimensions(this.hexSize, Hex.CartesianOrientation.FlatTop);
            this.sprite.width = dimensions.width;
            this.sprite.height = dimensions.width;
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
            this.sprite.tint = 0x00FF00;

            this.mask = this.sprite.mask = this.createHexagon(this.hexSize, 0x000000,0x000000);
            this.addChild(this.mask);
            this.sprite.mask = this.mask;
        }

        //this.sprite.rotation = toCanonical.turns * (Math.PI / 3);
        this.sprite.rotation = -toCanonical.turns * (Math.PI / 3);
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
