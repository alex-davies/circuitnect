define(["require", "exports"], function (require, exports) {
    var Hashset = (function () {
        function Hashset(computeHashCode) {
            if (computeHashCode === void 0) { computeHashCode = function (value) {
                return value.toString();
            }; }
            this.data = {};
            this.length = 0;
            this.computeHashCode = computeHashCode;
        }
        Hashset.prototype.add = function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i - 0] = arguments[_i];
            }
            for (var i = 0; i < values.length; i++) {
                var hash = this.computeHashCode(values[i]);
                if (!this.containsHash(hash)) {
                    this.data[hash] = values[i];
                    this.length += 1;
                }
            }
        };
        Hashset.prototype.addRange = function (values) {
            this.add.apply(this, values);
        };
        Hashset.prototype.remove = function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i - 0] = arguments[_i];
            }
            for (var i = 0; i < values.length; i++) {
                var hash = this.computeHashCode(values[i]);
                if (this.containsHash(hash)) {
                    delete this.data[hash];
                    this.length -= 1;
                }
            }
        };
        Hashset.prototype.contains = function (value) {
            return this.containsHash(this.computeHashCode(value));
        };
        Hashset.prototype.containsHash = function (hash) {
            return Object.prototype.hasOwnProperty.call(this.data, hash);
        };
        Hashset.prototype.size = function () {
            return this.length;
        };
        Hashset.prototype.entries = function () {
            var returnResult = [];
            for (var property in this.data) {
                if (Object.prototype.hasOwnProperty.call(this.data, property)) {
                    returnResult.push(this.data[property]);
                }
            }
            return returnResult;
        };
        Hashset.prototype.equals = function (other) {
            if (this.size() != other.size())
                return false;
            for (var property in this.data) {
                if (this.containsHash(property) !== other.containsHash(property))
                    return false;
            }
            return true;
        };
        return Hashset;
    })();
    return Hashset;
});
//# sourceMappingURL=Hashset.js.map