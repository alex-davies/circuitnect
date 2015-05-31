define(["require", "exports", 'engine/Hex', 'util/Observable'], function (require, exports, Hex, Observable) {
    var Tile = (function () {
        function Tile() {
            this.paths = Observable(new Hex.DirectionSet([0 /* a */]));
            this.active = Observable(false);
        }
        return Tile;
    })();
    return Tile;
});
//# sourceMappingURL=Tile.js.map