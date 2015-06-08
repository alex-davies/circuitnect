class Hashset<TValue> {
    public computeHashCode:(TValue)=>string
    private data = {};
    private length = 0;

    constructor(computeHashCode = (value)=>{return value.toString()}){
        this.computeHashCode = computeHashCode;
    }


    public add(...values:TValue[]){
        for(var i=0;i<values.length;i++){
            var hash = this.computeHashCode(values[i]);
            if(!this.containsHash(hash)) {
                this.data[hash] = values[i];
                this.length += 1;
            }
        }
    }

    public addRange(values:TValue[]){
        this.add.apply(this, values);
    }

    public remove(...values:TValue[]){
        for(var i=0;i<values.length;i++) {
            var hash = this.computeHashCode(values[i]);
            if (this.containsHash(hash)) {
                delete this.data[hash];
                this.length -= 1;
            }
        }
    }

    public contains(value:TValue){
        return this.containsHash(this.computeHashCode(value));
    }

    public containsHash(hash:string){
        return Object.prototype.hasOwnProperty.call(this.data, hash);
    }

    public size(){
        return this.length;
    }

    public entries():TValue[]{
        var returnResult = [];
        for (var property in this.data) {
            if (Object.prototype.hasOwnProperty.call(this.data, property)) {
                returnResult.push(this.data[property]);
            }
        }
        return returnResult;
    }

    public equals(other:Hashset<TValue>){
        if(this.size() != other.size())
            return false;

        for (var property in this.data) {
            if(this.containsHash(property) !== other.containsHash(property))
                return false;
        }

        return true;
    }


}

export = Hashset;