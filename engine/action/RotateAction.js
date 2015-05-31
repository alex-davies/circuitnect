define(["require", "exports", 'engine/Hex'], function (require, exports, Hex) {
    var RotateAction = (function () {
        function RotateAction(hexPoint, rotateCount) {
            if (rotateCount === void 0) { rotateCount = 1; }
            this.hexPoint = hexPoint;
            this.rotateCount = rotateCount;
        }
        RotateAction.prototype.execute = function (board) {
            var tile = board.getTile(this.hexPoint);
            if (tile) {
                tile.paths = Hex.TurnDirectionSet(tile.paths, this.rotateCount);
            }
        };
        return RotateAction;
    })();
    return RotateAction;
});
//# sourceMappingURL=RotateAction.js.map