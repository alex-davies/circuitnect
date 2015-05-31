import Pixi = require("lib/pixi/3.0.5/pixi");
import Board = require('engine/Board')
import Hex = require('engine/Hex')
import Tile = require('engine/Tile')
import Hashtable = require('util/Hashtable')

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
        eventy.on('click',function(){
            //alert('huh?');
            alert('hi');
        });
    }

    public init(){

    }

    private adjustTiles(){

        var newTileDisplays = new Hashtable<Hex.Point, TileDisplay>();
        this.board.getTiles().forEach((tile, i)=> {
            var tileDisplay = this.tileDisplays.get(tile.hexPoint);
            if(!tileDisplay) {
                tileDisplay = new TileDisplay(tile.tile, 60);
                this.addChild(tileDisplay);
            }

            var cartPoint = Hex.ToCartesianCoordinate(tile.hexPoint, 40, Hex.CartesianOrientation.FlatTop);
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

class TileDisplay extends Pixi.Sprite{
    constructor(tile: Tile, hexSize: number) {
        super(Pixi.Texture.fromImage('ui/assets/sprites/actors/mole.png'))
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        //this.interactive = true;
        //this.on('click',function(){
        //    //alert('huh?');
        //    this.rotation+= Math.PI / 3 ;
        //});


    }
}

export = BoardDisplay;
