define(["require", "exports"], function (require, exports) {
    var Hex = (function () {
        function Hex() {
        }
        Hex.Turn = function (direction, turnAmount) {
            if (turnAmount === void 0) { turnAmount = 1; }
            return (direction + turnAmount) % 6;
        };
        Hex.Step = function (point, direction, stepSize) {
            if (stepSize === void 0) { stepSize = 1; }
            switch (direction) {
                case 0 /* a */:
                    return { a: point.a, b: point.b + 1 * stepSize };
                case 1 /* b */:
                    return { a: point.a + 1 * stepSize, b: point.b };
                case 2 /* c */:
                    return { a: point.a + 1 * stepSize, b: point.b - 1 * stepSize };
                case 3 /* neg_a */:
                    return { a: point.a, b: point.b - 1 * stepSize };
                case 4 /* neg_b */:
                    return { a: point.a - 1 * stepSize, b: point.b };
                case 5 /* neg_c */:
                    return { a: point.a - 1 * stepSize, b: point.b + 1 * stepSize };
                default:
                    throw new Error("Unknown direction '" + direction + "'");
            }
        };
        Hex.Ring = function (center, radius, startDirection) {
            if (startDirection === void 0) { startDirection = 0 /* a */; }
            //need special case to handle 0 otherwise nothing will return
            if (radius == 0)
                return [center];
            var result = [];
            var currentPoint = Hex.Step(center, startDirection, radius);
            var currentDirection = Hex.Turn(startDirection, 2);
            for (var sideCount = 0; sideCount < 6; sideCount++) {
                for (var i = 0; i < radius; i++) {
                    result.push(currentPoint);
                    currentPoint = Hex.Step(currentPoint, currentDirection);
                }
                currentDirection = Hex.Turn(currentDirection);
            }
            return result;
        };
        Hex.Spiral = function (center, maxRadius, startDirection) {
            if (startDirection === void 0) { startDirection = 0 /* a */; }
            var result = [];
            for (var currentRadius = 0; currentRadius <= maxRadius; currentRadius++) {
                result.push.apply(result, Hex.Ring(center, currentRadius, startDirection));
            }
            return result;
        };
        Hex.CartesianDimensions = function (hexSize, orientation) {
            switch (orientation) {
                case 1 /* PointyTop */:
                    return {
                        width: Math.sqrt(3) * hexSize,
                        height: hexSize * 2
                    };
                case 0 /* FlatTop */:
                    return {
                        width: hexSize * 2,
                        height: Math.sqrt(3) * hexSize
                    };
                default:
                    throw new Error("Unknown orientation '" + orientation + "'");
            }
        };
        Hex.ToCartesianPoint = function (point, hexSize, orientation) {
            switch (orientation) {
                case 1 /* PointyTop */:
                    return {
                        x: hexSize * Math.sqrt(3) * (point.a + point.b / 2),
                        y: hexSize * 3 / 2 * point.b,
                    };
                case 0 /* FlatTop */:
                    return {
                        x: hexSize * 3 / 2 * point.b,
                        y: hexSize * Math.sqrt(3) * (point.a + point.b / 2)
                    };
                default:
                    throw new Error("Unknown orientation '" + orientation + "'");
            }
        };
        Hex.ToHexPoint = function (point, hexSize, orientation) {
            switch (orientation) {
                case 1 /* PointyTop */:
                    return Hex.Round({
                        b: (point.x * Math.sqrt(3) / 3 - point.y / 3) / hexSize,
                        a: point.y * 2 / 3 / hexSize,
                    });
                case 0 /* FlatTop */:
                    return Hex.Round({
                        b: point.x * 2 / 3 / hexSize,
                        a: (-point.x / 3 + Math.sqrt(3) / 3 * point.y) / hexSize
                    });
                default:
                    throw new Error("Unknown orientation '" + orientation + "'");
            }
        };
        Hex.Round = function (point) {
            //return {
            //    a: Math.round(point.a),
            //    b: Math.round(point.b)
            //};
            var ra = Math.round(point.a);
            var rb = Math.round(point.b);
            var rc = Math.round(-point.a - point.b);
            var a_diff = Math.abs(ra - point.a);
            var b_diff = Math.abs(rb - point.b);
            var c_diff = Math.abs(rc - (-point.a - point.b));
            if (a_diff > b_diff && a_diff > c_diff)
                ra = -rb - rc;
            else if (b_diff > c_diff)
                rb = -ra - rc;
            return { a: ra, b: rb };
        };
        Hex.ZeroPoint = { a: 0, b: 0 };
        return Hex;
    })();
    var Hex;
    (function (Hex) {
        (function (CartesianOrientation) {
            CartesianOrientation[CartesianOrientation["FlatTop"] = 0] = "FlatTop";
            CartesianOrientation[CartesianOrientation["PointyTop"] = 1] = "PointyTop";
        })(Hex.CartesianOrientation || (Hex.CartesianOrientation = {}));
        var CartesianOrientation = Hex.CartesianOrientation;
        (function (Direction) {
            Direction[Direction["a"] = 0] = "a";
            Direction[Direction["b"] = 1] = "b";
            Direction[Direction["c"] = 2] = "c";
            Direction[Direction["neg_a"] = 3] = "neg_a";
            Direction[Direction["neg_b"] = 4] = "neg_b";
            Direction[Direction["neg_c"] = 5] = "neg_c";
        })(Hex.Direction || (Hex.Direction = {}));
        var Direction = Hex.Direction;
        var DirectionSet = (function () {
            function DirectionSet(directions) {
                this.normalizedArray = [];
                var uniqued = directions.filter(function (value, i, self) { return self.indexOf(value) === i; });
                this.normalizedArray = uniqued.sort();
            }
            DirectionSet.prototype.values = function () {
                return this.normalizedArray;
            };
            DirectionSet.prototype.turn = function (turnAmount) {
                if (turnAmount === void 0) { turnAmount = 1; }
                var result = [];
                var directionArray = this.values();
                for (var i = 0; i < directionArray.length; i++) {
                    result.push(Hex.Turn(directionArray[i], turnAmount));
                }
                return new Hex.DirectionSet(result);
            };
            DirectionSet.prototype.turnsToCanonical = function () {
                for (var i = 0; i < DirectionSet.Canonical.length; i++) {
                    var potentialCanonical = this.turn(i);
                    if (potentialCanonical.isCanonical()) {
                        return {
                            canonical: potentialCanonical,
                            turns: i
                        };
                    }
                }
                throw new Error('DirectionSet is not related to a canonical direction set');
            };
            DirectionSet.prototype.isCanonical = function () {
                for (var i = 0; i < DirectionSet.Canonical.length; i++) {
                    if (this.equals(DirectionSet.Canonical[i]))
                        return true;
                }
                return false;
            };
            DirectionSet.prototype.equals = function (other) {
                var otherValues = other.values();
                var values = this.values();
                if (otherValues.length !== values.length)
                    return false;
                for (var i = 0; i < otherValues.length; i++) {
                    if (values.indexOf(otherValues[i]) === -1)
                        return false;
                }
                return true;
            };
            DirectionSet.Canonical = [
                new DirectionSet([]),
                new DirectionSet([0 /* a */]),
                new DirectionSet([0 /* a */, 1 /* b */]),
                new DirectionSet([0 /* a */, 2 /* c */]),
                new DirectionSet([0 /* a */, 3 /* neg_a */]),
                new DirectionSet([0 /* a */, 1 /* b */, 2 /* c */]),
                new DirectionSet([0 /* a */, 1 /* b */, 4 /* neg_b */]),
                new DirectionSet([0 /* a */, 1 /* b */, 2 /* c */]),
                new DirectionSet([0 /* a */, 1 /* b */, 2 /* c */, 3 /* neg_a */]),
                new DirectionSet([0 /* a */, 1 /* b */, 2 /* c */, 4 /* neg_b */]),
                new DirectionSet([0 /* a */, 1 /* b */, 3 /* neg_a */, 4 /* neg_b */]),
                new DirectionSet([0 /* a */, 1 /* b */, 2 /* c */, 3 /* neg_a */, 4 /* neg_b */]),
                new DirectionSet([0 /* a */, 1 /* b */, 2 /* c */, 3 /* neg_a */, 4 /* neg_b */, 5 /* neg_c */]),
            ];
            return DirectionSet;
        })();
        Hex.DirectionSet = DirectionSet;
    })(Hex || (Hex = {}));
    return Hex;
});
//# sourceMappingURL=Hex.js.map