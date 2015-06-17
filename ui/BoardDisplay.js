var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/pixi/3.0.5/pixi", 'engine/Hex', 'util/Hashtable', 'engine/action/RotateAction', 'lib/tween/0.15.0/tween'], function (require, exports, Pixi, Hex, Hashtable, RotateAction, TWEEN) {
    var BoardDisplay = (function (_super) {
        __extends(BoardDisplay, _super);
        function BoardDisplay(board, hexSize) {
            var _this = this;
            _super.call(this);
            this.board = board;
            this.hexSize = hexSize;
            var factory = new TileArtist();
            this.board.getTiles().forEach(function (tile, i) {
                var tileDisplay = factory.drawTile(board, tile, _this.hexSize);
                var cartPoint = Hex.ToCartesianPoint(tile.position, hexSize, 0 /* FlatTop */);
                tileDisplay.position.x = cartPoint.x;
                tileDisplay.position.y = cartPoint.y;
                _this.addChild(tileDisplay);
            });
            this.hitArea = new Pixi.Rectangle(-400, -300, 800, 600);
            var eventy = this;
            eventy.interactive = true;
            eventy.on('click', function (event) {
                var point = event.data.getLocalPosition(this);
                var hexPoint = Hex.ToHexPoint(point, this.hexSize, 0 /* FlatTop */);
                //rotate the tile clockwise
                board.ExecuteAction(new RotateAction(hexPoint, 1));
            });
        }
        return BoardDisplay;
    })(Pixi.Container);
    var TileArtist = (function () {
        function TileArtist() {
        }
        TileArtist.prototype.drawTile = function (board, tile, hexSize) {
            var initialPaths = tile.paths();
            var graphics = this.drawDirections(new Pixi.Graphics(), initialPaths.values(), hexSize, 0x00FF00);
            tile.paths.observe(function (change) {
                var currentTurns = (Math.round(graphics.rotation / (Math.PI / 3)) % 6);
                for (var i = 0; i < 6; i++) {
                    var targetTurns = (currentTurns + i) % 6;
                    if (initialPaths.turn(targetTurns).equals(change.newValue)) {
                        console.log(currentTurns + "->" + targetTurns);
                        var targetRotation = targetTurns * (Math.PI / 3);
                        //ensure we keep turning clockwise
                        if (targetRotation < graphics.rotation)
                            targetRotation += Math.PI * 2;
                        var tween = new TWEEN.Tween({ rt: graphics.rotation }).to({ rt: targetRotation }, 300).easing(TWEEN.Easing.Elastic.Out).onUpdate(function () {
                            graphics.rotation = this.rt;
                        }).start();
                        break;
                    }
                }
            });
            return graphics;
        };
        TileArtist.prototype.drawDirections = function (graphics, directions, hexSize, color) {
            graphics.lineStyle(14, color, 1);
            for (var i = 0; i < directions.length; i++) {
                var side = TileArtist.outerSides.get(directions[i]);
                side = {
                    x: side.x,
                    y: side.y
                };
                graphics.moveTo(TileArtist.center.x, TileArtist.center.y);
                graphics.lineTo(side.x, side.y);
            }
            //add a circle on the joint to hide the line joins
            if (directions.length > 0) {
                graphics.lineStyle(0, color, 1);
                graphics.beginFill(color);
                graphics.drawCircle(TileArtist.center.x, TileArtist.center.y, 7);
                graphics.endFill();
            }
            return graphics;
        };
        TileArtist.center = { x: 0, y: 0 };
        TileArtist.outerCorners = new Hashtable();
        TileArtist.outerSides = new Hashtable();
        TileArtist.innerCorners = new Hashtable();
        TileArtist.innerSides = new Hashtable();
        TileArtist.ctor = (function () {
            var dimensions = Hex.CartesianDimensions(40, 0 /* FlatTop */);
            var width = dimensions.width;
            var height = dimensions.height;
            var halfWidth = width / 2;
            var halfHeight = height / 2;
            var quarterWidth = width / 4;
            var quarterHeight = height / 4;
            var midPoint = function (p1, p2) {
                return {
                    x: (p1.x + p2.x) / 2,
                    y: (p1.y + p2.y) / 2,
                };
            };
            var scale = function (p1, factor) {
                return {
                    x: p1.x * factor,
                    y: p1.y * factor,
                };
            };
            var outerCorners = TileArtist.outerCorners;
            outerCorners.put(0 /* pos_a */, { x: quarterWidth, y: halfHeight });
            outerCorners.put(1 /* pos_b */, { x: -quarterWidth, y: halfHeight });
            outerCorners.put(2 /* neg_a_pos_b */, { x: -halfWidth, y: 0 });
            outerCorners.put(3 /* neg_a */, { x: -quarterWidth, y: -halfHeight });
            outerCorners.put(4 /* neg_b */, { x: quarterWidth, y: -halfHeight });
            outerCorners.put(5 /* pos_a_neg_b */, { x: halfWidth, y: 0 });
            var outerSides = TileArtist.outerSides;
            outerSides.put(1 /* pos_b */, midPoint(outerCorners.get(1 /* pos_b */), outerCorners.get(0 /* pos_a */)));
            outerSides.put(0 /* pos_a */, midPoint(outerCorners.get(0 /* pos_a */), outerCorners.get(5 /* pos_a_neg_b */)));
            outerSides.put(5 /* pos_a_neg_b */, midPoint(outerCorners.get(5 /* pos_a_neg_b */), outerCorners.get(4 /* neg_b */)));
            outerSides.put(4 /* neg_b */, midPoint(outerCorners.get(4 /* neg_b */), outerCorners.get(3 /* neg_a */)));
            outerSides.put(3 /* neg_a */, midPoint(outerCorners.get(3 /* neg_a */), outerCorners.get(2 /* neg_a_pos_b */)));
            outerSides.put(2 /* neg_a_pos_b */, midPoint(outerCorners.get(2 /* neg_a_pos_b */), outerCorners.get(1 /* pos_b */)));
            var innerScaleFactor = 0.5;
            var innerCorners = TileArtist.innerCorners;
            outerCorners.entries().forEach(function (e) {
                innerCorners.put(e.key, scale(e.value, innerScaleFactor));
            });
            var innerSides = TileArtist.innerSides;
            outerSides.entries().forEach(function (e) {
                innerSides.put(e.key, scale(e.value, innerScaleFactor));
            });
        })();
        return TileArtist;
    })();
    var TileDisplay = (function (_super) {
        __extends(TileDisplay, _super);
        function TileDisplay(tile, hexSize) {
            var _this = this;
            _super.call(this);
            this.tile = tile;
            this.hexSize = hexSize;
            var hexagon = this.createHexagon(hexSize, 0xaaaaaa);
            //this.addChild(hexagon);
            this.alignTexture();
            var cartPoint = Hex.ToCartesianPoint(this.tile.position, this.hexSize, 0 /* FlatTop */);
            this.position.x = cartPoint.x;
            this.position.y = cartPoint.y;
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
                this.spriteTextureName = spriteName;
                //this.sprite = new Pixi.Sprite(Pixi.Texture.fromImage(spriteName));
                //this.sprite = new TileArtist().drawTile(this.tile, this.hexSize)
                this.addChild(this.sprite);
                var dimensions = Hex.CartesianDimensions(this.hexSize, 0 /* FlatTop */);
                //this.sprite.width = dimensions.width;
                //this.sprite.height = dimensions.width;
                //this.sprite.anchor.x = 0.5;
                //this.sprite.anchor.y = 0.5;
                //this.sprite.tint = 0x00FF00;
                this.mask = this.sprite.mask = this.createHexagon(this.hexSize, 0x000000, 0x000000);
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
        };
        TileDisplay.prototype.normalizeRadians = function (rads) {
            while (rads < 0)
                rads += Math.PI * 2;
            while (rads > Math.PI * 2)
                rads -= Math.PI * 2;
            return rads;
        };
        TileDisplay.prototype.getSpriteName = function (directionSet) {
            var name = '';
            name += directionSet.contains(1 /* pos_b */) ? '1' : '0';
            name += directionSet.contains(0 /* pos_a */) ? '1' : '0';
            name += directionSet.contains(5 /* pos_a_neg_b */) ? '1' : '0';
            name += directionSet.contains(4 /* neg_b */) ? '1' : '0';
            name += directionSet.contains(3 /* neg_a */) ? '1' : '0';
            name += directionSet.contains(2 /* neg_a_pos_b */) ? '1' : '0';
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