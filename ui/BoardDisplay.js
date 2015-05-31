var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/pixi/3.0.5/pixi", 'engine/Hex', 'util/Hashtable'], function (require, exports, Pixi, Hex, Hashtable) {
    var BoardDisplay = (function (_super) {
        __extends(BoardDisplay, _super);
        function BoardDisplay(board, hexSize) {
            _super.call(this);
            this.tileDisplays = new Hashtable();
            this.hexSize = hexSize;
            this.board = board;
            this.adjustTiles();
            this.hitArea = new Pixi.Rectangle(-400, -300, 800, 600);
            var eventy = this;
            eventy.interactive = true;
            eventy.on('click', function () {
                //alert('huh?');
                alert('hi');
            });
        }
        BoardDisplay.prototype.init = function () {
        };
        BoardDisplay.prototype.adjustTiles = function () {
            var _this = this;
            var newTileDisplays = new Hashtable();
            this.board.getTiles().forEach(function (tile, i) {
                var tileDisplay = _this.tileDisplays.get(tile.hexPoint);
                if (!tileDisplay) {
                    tileDisplay = new TileDisplay(tile.tile, 60);
                    _this.addChild(tileDisplay);
                }
                var cartPoint = Hex.ToCartesianCoordinate(tile.hexPoint, 40, 0 /* FlatTop */);
                tileDisplay.x = cartPoint.x;
                tileDisplay.y = cartPoint.y;
                newTileDisplays.put(tile.hexPoint, tileDisplay);
            });
            //remove items we had before but are no longer in our list
            this.tileDisplays.entries().forEach(function (kvp, i) {
                var newItem = newTileDisplays.get(kvp.key);
                if (!newItem || newItem != kvp.value) {
                    _this.removeChild(kvp.value);
                }
            });
            //set our new tile displays
            this.tileDisplays = newTileDisplays;
        };
        return BoardDisplay;
    })(Pixi.Container);
    var TileDisplay = (function (_super) {
        __extends(TileDisplay, _super);
        function TileDisplay(tile, hexSize) {
            _super.call(this, Pixi.Texture.fromImage('ui/assets/sprites/actors/mole.png'));
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            //this.interactive = true;
            //this.on('click',function(){
            //    //alert('huh?');
            //    this.rotation+= Math.PI / 3 ;
            //});
        }
        return TileDisplay;
    })(Pixi.Sprite);
    return BoardDisplay;
});
//# sourceMappingURL=BoardDisplay.js.map