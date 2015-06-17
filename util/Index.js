define(["require", "exports"], function (require, exports) {
    var Index = (function () {
        function Index(dataSource, keyFetch, keyIdGenerator) {
            this.dataSource = dataSource;
            this.keyFetch = keyFetch;
            this.keyIdGenerator = keyIdGenerator;
            this.lookup = {};
            this.reindex();
        }
        Index.prototype.reindex = function () {
            this.lookup = {};
            for (var i = 0; i < this.dataSource.length; i++) {
                var dataItem = this.dataSource[i];
                var dataKey = this.keyFetch(dataItem);
                if (dataKey !== undefined) {
                    var dataKeyId = this.keyIdGenerator(dataKey);
                    this.lookup[dataKeyId] = dataItem;
                }
            }
        };
        Index.prototype.get = function (key) {
            var keyId = this.keyIdGenerator(key);
            if (!Object.prototype.hasOwnProperty.call(this.lookup, keyId))
                return undefined;
            return this.lookup[keyId];
        };
        return Index;
    })();
    return Index;
});
//# sourceMappingURL=Index.js.map