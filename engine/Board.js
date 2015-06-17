define(["require", "exports", './Hex', './Tile', 'util/Hashset', 'util/Index'], function (require, exports, Hex, Tile, Hashset, Index) {
    var Board = (function () {
        function Board(radius) {
            this.radius = radius;
            this.tiles = [];
            this.pointIndex = new Index(this.tiles, function (tile) { return tile.position; }, Hex.stringifyPoint);
            var points = Hex.Spiral(Hex.ZeroPoint, radius);
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                var tile = new Tile(point);
                this.tiles.push(tile);
            }
            this.pointIndex.reindex();
            //this.pointIndex.get({a:0,b:0}).paths(new Hex.DirectionSet([Hex.Direction.pos_b, Hex.Direction.pos_a_neg_b]))
            //
            //var base = new Hex.DirectionSet([Hex.Direction.neg_a]);
            //this.pointIndex.get({a:1,b:0}).paths(base.turn(0))
            //this.pointIndex.get({a:0,b:1}).paths(base.turn(-1))
            //this.pointIndex.get({a:-1,b:1}).paths(base.turn(-2))
            //this.pointIndex.get({a:-1,b:0}).paths(base.turn(-3))
            //this.pointIndex.get({a:0,b:-1}).paths(base.turn(-4))
            //this.pointIndex.get({a:1,b:-1}).paths(base.turn(-5))
            this.populateBoard([Hex.ZeroPoint], this);
            //
            //for(var i=0;i<this.tiles.length;i++){
            //    var turns = Math.floor(Math.random() * 6)
            //    this.tiles[i].paths(this.tiles[i].paths().turn(turns));
            //}
        }
        Board.prototype.populateBoard = function (startPoints, board) {
            var rand = Math.random; //TODO: get a seedable random number generator
            var processedPoints = new Hashset(Hex.stringifyPoint);
            var toProcessPoints = new Hashset(Hex.stringifyPoint);
            for (var i = 0; i < startPoints.length; i++) {
                var tile = board.getTile(startPoints[i]);
                if (tile) {
                    toProcessPoints.add(startPoints[i]);
                    tile.powered(true);
                }
            }
            while (toProcessPoints.size() > 0) {
                var toProcessPointsThisRun = toProcessPoints.entries();
                for (var i = 0; i < toProcessPointsThisRun.length; i++) {
                    var point = toProcessPointsThisRun[i];
                    var tile = board.getTile(point);
                    toProcessPoints.remove(point);
                    processedPoints.add(point);
                    if (!tile) {
                        continue;
                    }
                    for (var di = 0; di < Hex.Direction.all.length; di++) {
                        var direction = Hex.Direction.all[di];
                        var otherPoint = Hex.Step(point, direction);
                        var otherTile = board.getTile(otherPoint);
                        if (otherTile && rand() > 0.7) {
                            //connect the two tiles
                            tile.paths(tile.paths().with(direction));
                            otherTile.paths(otherTile.paths().with(Hex.Turn(direction, 3)));
                            if (!processedPoints.contains(otherPoint))
                                toProcessPoints.add(otherPoint);
                        }
                    }
                }
            }
        };
        Board.prototype.getTiles = function () {
            return this.tiles;
        };
        Board.prototype.getTile = function (point) {
            return this.pointIndex.get(point);
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