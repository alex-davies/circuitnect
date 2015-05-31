define(["require", "exports"], function (require, exports) {
    var RotateAction = (function () {
        function RotateAction(hexPoint, rotateCount) {
            if (rotateCount === void 0) { rotateCount = 1; }
            this.hexPoint = hexPoint;
            this.rotateCount = rotateCount;
        }
        RotateAction.prototype.execute = function (board) {
            var tile = board.getTile(this.hexPoint);
            if (tile) {
                tile.paths(tile.paths().turn(this.rotateCount));
            }
            else {
                console.debug('No tile found at point', this.hexPoint);
            }
        };
        return RotateAction;
    })();
    return RotateAction;
});
//# sourceMappingURL=RotateAction.js.map