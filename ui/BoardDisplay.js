var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/pixi/3.0.5/pixi", 'engine/Hex', 'util/Hashtable', 'engine/action/RotateAction'], function (require, exports, Pixi, Hex, Hashtable, RotateAction) {
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
            eventy.on('click', function (event) {
                var point = event.data.getLocalPosition(this);
                var hexPoint = Hex.ToHexPoint(point, this.hexSize, 0 /* FlatTop */);
                //rotate the tile clockwise
                board.ExecuteAction(new RotateAction(hexPoint, -1));
            });
        }
        BoardDisplay.prototype.adjustTiles = function () {
            var _this = this;
            var newTileDisplays = new Hashtable();
            this.board.getTiles().forEach(function (tile, i) {
                var tileDisplay = _this.tileDisplays.get(tile.hexPoint);
                if (!tileDisplay) {
                    tileDisplay = new TileDisplay(tile.tile, _this.hexSize);
                    _this.addChild(tileDisplay);
                }
                var cartPoint = Hex.ToCartesianPoint(tile.hexPoint, _this.hexSize, 0 /* FlatTop */);
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
            var _this = this;
            _super.call(this);
            var graphics = this.createHexagon(hexSize);
            this.addChild(graphics);
            //placeholder
            var sprite = new Pixi.Sprite(Pixi.Texture.fromImage('ui/assets/sprites/actors/mole.png'));
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            this.addChild(sprite);
            tile.paths.observe(function (change) {
                var toCanonical = change.newValue.turnsToCanonical();
                _this.rotation = toCanonical.turns * (Math.PI / 3);
            });
        }
        TileDisplay.prototype.createHexagon = function (hexSize) {
            var dimensions = Hex.CartesianDimensions(hexSize, 0 /* FlatTop */);
            var width = dimensions.width;
            var height = dimensions.height;
            var halfWidth = width / 2;
            var halfHeight = height / 2;
            var quarterWidth = width / 4;
            var quarterHeight = height / 4;
            var graphics = new Pixi.Graphics();
            graphics.beginFill(0xFF3300);
            graphics.lineStyle(1, 0xaaaaaa, 1);
            graphics.moveTo(-halfWidth, 0);
            graphics.lineTo(-quarterWidth, halfHeight);
            graphics.lineTo(quarterWidth, halfHeight);
            graphics.lineTo(halfWidth, 0);
            graphics.lineTo(quarterWidth, -halfHeight);
            graphics.lineTo(-quarterWidth, -halfHeight);
            graphics.endFill();
            return graphics;
        };
        return TileDisplay;
    })(Pixi.Container);
    return BoardDisplay;
});
//# sourceMappingURL=BoardDisplay.js.map