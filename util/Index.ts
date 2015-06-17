class Index<TKey, TValue>{
    lookup = {};
    constructor(private dataSource : TValue[], private keyFetch:(item:TValue)=>TKey, private keyIdGenerator:(TKey)=>string){
        this.reindex();
    }

    reindex(){
        this.lookup = {};
        for(var i=0;i<this.dataSource.length;i++){
            var dataItem = this.dataSource[i];
            var dataKey = this.keyFetch(dataItem);
            if(dataKey !== undefined){
                var dataKeyId = this.keyIdGenerator(dataKey);
                this.lookup[dataKeyId] = dataItem;
            }

        }
    }

    get(key:TKey):TValue{
        var keyId = this.keyIdGenerator(key);
        if(!Object.prototype.hasOwnProperty.call(this.lookup, keyId))
            return undefined;
        return this.lookup[keyId];
    }
}

export = Index;
