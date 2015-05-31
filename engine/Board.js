define(["require", "exports", './Hex', './Tile', 'util/Hashtable'], function (require, exports, Hex, Tile, Hashtable) {
    var Board = (function () {
        function Board(radius) {
            this.hexStore = new Hashtable(function (p) { return p.a + ',' + p.b; });
            this.radius = radius;
            var points = Hex.Spiral(Hex.ZeroPoint, radius);
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                this.hexStore.put(point, new Tile());
            }
        }
        Board.prototype.getTiles = function () {
            var result = [];
            var points = Hex.Spiral(Hex.ZeroPoint, this.radius);
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                var tile = this.getTile(point);
                if (tile) {
                    result.push({
                        hexPoint: point,
                        tile: tile
                    });
                }
            }
            return result;
        };
        Board.prototype.getTile = function (point) {
            return this.hexStore.get(point);
        };
        Board.prototype.ExecuteAction = function (action) {
            console.debug('executing action', action);
            action.execute(this);
            console.debug('execution complete');
        };
        return Board;
    })();
    return Board;
});
//# sourceMappingURL=Board.js.map