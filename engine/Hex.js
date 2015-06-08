define(["require", "exports", 'util/Hashset'], function (require, exports, Hashset) {
    var Hex = (function () {
        function Hex() {
        }
        Hex.Turn = function (direction, turnAmount) {
            if (turnAmount === void 0) { turnAmount = 1; }
            var newDirection = (direction + turnAmount) % 6;
            if (newDirection < 0)
                newDirection += 6;
            return newDirection;
        };
        Hex.Step = function (point, direction, stepSize) {
            if (stepSize === void 0) { stepSize = 1; }
            switch (direction) {
                case 0 /* pos_a */:
                    return { a: point.a + 1 * stepSize, b: point.b };
                case 5 /* pos_b */:
                    return { a: point.a, b: point.b + 1 * stepSize };
                case 1 /* pos_a_neg_b */:
                    return { a: point.a + 1 * stepSize, b: point.b - 1 * stepSize };
                case 3 /* neg_a */:
                    return { a: point.a - 1 * stepSize, b: point.b };
                case 2 /* neg_b */:
                    return { a: point.a, b: point.b - 1 * stepSize };
                case 4 /* neg_a_pos_b */:
                    return { a: point.a - 1 * stepSize, b: point.b + 1 * stepSize };
                default:
                    throw new Error("Unknown direction '" + direction + "'");
            }
        };
        Hex.Ring = function (center, radius, startDirection) {
            if (startDirection === void 0) { startDirection = 0 /* pos_a */; }
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
            if (startDirection === void 0) { startDirection = 0 /* pos_a */; }
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
                        x: hexSize * Math.sqrt(3) * (point.b + point.a / 2),
                        y: hexSize * 3 / 2 * point.a,
                    };
                case 0 /* FlatTop */:
                    return {
                        x: hexSize * 3 / 2 * point.a,
                        y: hexSize * Math.sqrt(3) * (point.b + point.a / 2)
                    };
                default:
                    throw new Error("Unknown orientation '" + orientation + "'");
            }
        };
        Hex.ToHexPoint = function (point, hexSize, orientation) {
            switch (orientation) {
                case 1 /* PointyTop */:
                    return Hex.Round({
                        a: (point.x * Math.sqrt(3) / 3 - point.y / 3) / hexSize,
                        b: point.y * 2 / 3 / hexSize,
                    });
                case 0 /* FlatTop */:
                    return Hex.Round({
                        a: point.x * 2 / 3 / hexSize,
                        b: (-point.x / 3 + Math.sqrt(3) / 3 * point.y) / hexSize
                    });
                default:
                    throw new Error("Unknown orientation '" + orientation + "'");
            }
        };
        Hex.Round = function (point) {
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
            //we will order them so they rotate in anti-clockwise direction
            Direction[Direction["pos_a"] = 0] = "pos_a";
            Direction[Direction["pos_a_neg_b"] = 1] = "pos_a_neg_b";
            Direction[Direction["neg_b"] = 2] = "neg_b";
            Direction[Direction["neg_a"] = 3] = "neg_a";
            Direction[Direction["neg_a_pos_b"] = 4] = "neg_a_pos_b";
            Direction[Direction["pos_b"] = 5] = "pos_b";
        })(Hex.Direction || (Hex.Direction = {}));
        var Direction = Hex.Direction;
        var Direction;
        (function (Direction) {
            Direction.all = [5 /* pos_b */, 0 /* pos_a */, 1 /* pos_a_neg_b */, 2 /* neg_b */, 2 /* neg_b */, 4 /* neg_a_pos_b */];
        })(Direction = Hex.Direction || (Hex.Direction = {}));
        var DirectionSet = (function () {
            function DirectionSet(directions) {
                this.directionSet = new Hashset();
                this.directionSet.addRange(directions);
            }
            DirectionSet.prototype.values = function () {
                return this.directionSet.entries();
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
            DirectionSet.prototype.with = function (direction) {
                var newDirections = this.directionSet.entries();
                newDirections.push(direction);
                return new DirectionSet(newDirections);
            };
            DirectionSet.prototype.contains = function (direction) {
                return this.directionSet.contains(direction);
            };
            DirectionSet.prototype.turnsToCanonical = function () {
                for (var i = 0; i < 6; i++) {
                    var potentialCanonical = this.turn(-i);
                    if (potentialCanonical.isCanonical()) {
                        return {
                            canonical: potentialCanonical,
                            turns: i
                        };
                    }
                }
                throw new Error('DirectionSet is not related to pos_b canonical direction set');
            };
            DirectionSet.prototype.isCanonical = function () {
                for (var i = 0; i < DirectionSet.Canonical.length; i++) {
                    if (this.equals(DirectionSet.Canonical[i]))
                        return true;
                }
                return false;
            };
            DirectionSet.prototype.equals = function (other) {
                return this.directionSet.equals(other.directionSet);
            };
            DirectionSet.Canonical = [
                new DirectionSet([]),
                new DirectionSet([5 /* pos_b */]),
                new DirectionSet([5 /* pos_b */, 0 /* pos_a */]),
                new DirectionSet([5 /* pos_b */, 1 /* pos_a_neg_b */]),
                new DirectionSet([5 /* pos_b */, 2 /* neg_b */]),
                new DirectionSet([5 /* pos_b */, 0 /* pos_a */, 1 /* pos_a_neg_b */]),
                new DirectionSet([5 /* pos_b */, 0 /* pos_a */, 2 /* neg_b */]),
                new DirectionSet([5 /* pos_b */, 0 /* pos_a */, 3 /* neg_a */]),
                new DirectionSet([5 /* pos_b */, 1 /* pos_a_neg_b */, 3 /* neg_a */]),
                new DirectionSet([5 /* pos_b */, 0 /* pos_a */, 1 /* pos_a_neg_b */, 2 /* neg_b */]),
                new DirectionSet([5 /* pos_b */, 0 /* pos_a */, 1 /* pos_a_neg_b */, 3 /* neg_a */]),
                new DirectionSet([5 /* pos_b */, 0 /* pos_a */, 2 /* neg_b */, 3 /* neg_a */]),
                new DirectionSet([5 /* pos_b */, 0 /* pos_a */, 1 /* pos_a_neg_b */, 2 /* neg_b */, 3 /* neg_a */]),
                new DirectionSet([5 /* pos_b */, 0 /* pos_a */, 1 /* pos_a_neg_b */, 2 /* neg_b */, 3 /* neg_a */, 4 /* neg_a_pos_b */]),
            ];
            return DirectionSet;
        })();
        Hex.DirectionSet = DirectionSet;
    })(Hex || (Hex = {}));
    return Hex;
});
//# sourceMappingURL=Hex.js.map