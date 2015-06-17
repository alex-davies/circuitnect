define(["require", "exports", 'engine/Hex', 'util/Observable'], function (require, exports, Hex, Observable) {
    var Tile = (function () {
        function Tile(position) {
            this.paths = Observable(new Hex.DirectionSet([]));
            this.active = Observable(false);
            this.powered = Observable(false);
            this.position = position;
        }
        return Tile;
    })();
    return Tile;
});
//# sourceMappingURL=Tile.js.map