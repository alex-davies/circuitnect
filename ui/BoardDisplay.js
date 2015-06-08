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
            this.tile = tile;
            this.hexSize = hexSize;
            var hexagon = this.createHexagon(hexSize, 0xaaaaaa);
            this.addChild(hexagon);
            this.alignTexture();
            tile.paths.observe(function (change) {
                _this.alignTexture();
            });
        }
        TileDisplay.prototype.alignTexture = function () {
            var toCanonical = this.tile.paths().turnsToCanonical();
            var spriteName = this.getSpriteName(toCanonical.canonical);
            //the sprite we created before is different the one we are now
            //we will remove our old sprite and add pos_b new one
            if (spriteName !== this.spriteTextureName) {
                this.removeChild(this.sprite);
                this.removeChild(this.mask);
                this.sprite = new Pixi.Sprite(Pixi.Texture.fromImage(spriteName));
                this.addChild(this.sprite);
                var dimensions = Hex.CartesianDimensions(this.hexSize, 0 /* FlatTop */);
                this.sprite.width = dimensions.width;
                this.sprite.height = dimensions.width;
                this.sprite.anchor.x = 0.5;
                this.sprite.anchor.y = 0.5;
                this.sprite.tint = 0x00FF00;
                this.mask = this.sprite.mask = this.createHexagon(this.hexSize, 0x000000, 0x000000);
                this.addChild(this.mask);
                this.sprite.mask = this.mask;
            }
            //this.sprite.rotation = toCanonical.turns * (Math.PI / 3);
            this.sprite.rotation = -toCanonical.turns * (Math.PI / 3);
        };
        TileDisplay.prototype.getSpriteName = function (directionSet) {
            var name = '';
            name += directionSet.contains(5 /* pos_b */) ? '1' : '0';
            name += directionSet.contains(0 /* pos_a */) ? '1' : '0';
            name += directionSet.contains(1 /* pos_a_neg_b */) ? '1' : '0';
            name += directionSet.contains(2 /* neg_b */) ? '1' : '0';
            name += directionSet.contains(3 /* neg_a */) ? '1' : '0';
            name += directionSet.contains(4 /* neg_a_pos_b */) ? '1' : '0';
            return name + '.png';
        };
        TileDisplay.prototype.createHexagon = function (hexSize, lineColor, fillColor) {
            var dimensions = Hex.CartesianDimensions(hexSize, 0 /* FlatTop */);
            var width = dimensions.width;
            var height = dimensions.height;
            var halfWidth = width / 2;
            var halfHeight = height / 2;
            var quarterWidth = width / 4;
            var quarterHeight = height / 4;
            var hasFill = typeof fillColor !== "undefined";
            var graphics = new Pixi.Graphics();
            if (hasFill) {
                graphics.beginFill(fillColor);
            }
            graphics.lineStyle(2, 0xaaaaaa, 1);
            graphics.moveTo(-halfWidth, 0);
            graphics.lineTo(-quarterWidth, halfHeight);
            graphics.lineTo(quarterWidth, halfHeight);
            graphics.lineTo(halfWidth, 0);
            graphics.lineTo(quarterWidth, -halfHeight);
            graphics.lineTo(-quarterWidth, -halfHeight);
            if (hasFill) {
                graphics.endFill();
            }
            else {
                graphics.lineTo(-halfWidth, 0);
            }
            return graphics;
        };
        return TileDisplay;
    })(Pixi.Container);
    return BoardDisplay;
});
//# sourceMappingURL=BoardDisplay.js.map