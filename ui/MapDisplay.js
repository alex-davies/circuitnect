var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Circuitnect;
(function (Circuitnect) {
    var UI;
    (function (UI) {
        var MapDisplay = (function (_super) {
            __extends(MapDisplay, _super);
            function MapDisplay(map, tileSize) {
                var _this = this;
                _super.call(this);
                this.tileSize = tileSize;
                this._map = map;
                this._spriteMap = new Circuitnect.Engine.Map2D(map.bounds, undefined);
                //when sprites get added to our sprite map we will assign them appropriate values
                //and clean up our old sprits
                this._spriteMap.eventSet.addListener(function (setDatas) {
                    for (var i = 0; i < setDatas.length; i++) {
                        var setData = setDatas[i];
                        if (setData.oldItem != undefined) {
                            _this.removeChild(setData.oldItem);
                        }
                        if (setData.item != undefined) {
                            setData.item.pivot.x = 8;
                            setData.item.pivot.y = 8;
                            setData.item.x = setData.pos.x * tileSize + tileSize / 2;
                            setData.item.y = setData.pos.y * tileSize + tileSize / 2;
                            setData.item.width = tileSize;
                            setData.item.height = tileSize;
                            _this.addChild(setData.item);
                        }
                    }
                });
                map.forEach(function (item, pos) {
                    _this.refreshSprites([pos]);
                    //this._spriteMap.set(pos, this.generateSprite(pos, item));
                });
                //every time our base map gets updated we will updated our sprite map accordinglys
                map.eventSet.addListener(function (setDatas) {
                    for (var i = 0; i < setDatas.length; i++) {
                        var setData = setDatas[i];
                        var centerPoint = setData.pos;
                        var compasPoints = _this.getCompassPoints(centerPoint);
                        compasPoints.unshift(centerPoint);
                        _this.refreshSprites(compasPoints);
                    }
                });
            }
            MapDisplay.prototype.getCompassPoints = function (pos) {
                var top = { x: pos.x, y: pos.y - 1 };
                var right = { x: pos.x + 1, y: pos.y };
                var bottom = { x: pos.x, y: pos.y + 1 };
                var left = { x: pos.x - 1, y: pos.y };
                return [top, right, bottom, left];
            };
            MapDisplay.prototype.refreshSprites = function (positions) {
                for (var i = 0; i < positions.length; i++) {
                    var pos = positions[i];
                    var tile = this._map.get(pos);
                    if (tile == Circuitnect.Engine.EnvironmentMapTile.Hole) {
                        var sprite = PIXI.Sprite.fromFrame("hole.png");
                        this._spriteMap.set(pos, sprite);
                    }
                    else {
                        var top = this._map.get({ x: pos.x, y: pos.y - 1 });
                        var topNumber = top == Circuitnect.Engine.EnvironmentMapTile.Dirt ? 1 : 0;
                        var right = this._map.get({ x: pos.x + 1, y: pos.y });
                        var rightNumber = right == Circuitnect.Engine.EnvironmentMapTile.Dirt ? 1 : 0;
                        var bottom = this._map.get({ x: pos.x, y: pos.y + 1 });
                        var bottomNumber = bottom == Circuitnect.Engine.EnvironmentMapTile.Dirt ? 1 : 0;
                        var left = this._map.get({ x: pos.x - 1, y: pos.y });
                        var leftNumber = left == Circuitnect.Engine.EnvironmentMapTile.Dirt ? 1 : 0;
                        var sprite = PIXI.Sprite.fromFrame("dirt-" + topNumber + rightNumber + bottomNumber + leftNumber + ".png");
                        this._spriteMap.set(pos, sprite);
                    }
                }
            };
            return MapDisplay;
        })(PIXI.DisplayObjectContainer);
        UI.MapDisplay = MapDisplay;
    })(UI = Circuitnect.UI || (Circuitnect.UI = {}));
})(Circuitnect || (Circuitnect = {}));
//# sourceMappingURL=MapDisplay.js.map