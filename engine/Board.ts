import Hex = require('./Hex');
import Tile = require('./Tile');
import Hashtable = require('util/Hashtable')

interface Action{
    execute(board:Board);
}

class Board{
    hexStore = new Hashtable<Hex.Point, Tile>(p => p.a+','+p.b);
    radius:number;
    constructor(radius:number){
        this.radius = radius;
        var points = Hex.Spiral(Hex.ZeroPoint,radius);
        for(var i=0;i<points.length;i++){
            var point = points[i];
            this.hexStore.put(point, new Tile());
        }
    }

    public getTiles():{hexPoint:Hex.Point; tile:Tile}[]{
        var result = [];
        var points = Hex.Spiral(Hex.ZeroPoint,this.radius);
        for(var i=0;i<points.length;i++){
            var point = points[i];
            var tile = this.getTile(point);
            if(tile){
                result.push({
                    hexPoint:point,
                    tile:tile
                })
            }
        }
        return result;
    }

    public getTile(point:Hex.Point):Tile{
        return this.hexStore.get(point);
    }

    public ExecuteAction(action: Action){
        console.debug('executing action', action);
        action.execute(this);
        console.debug('execution complete');
    }
}
export = Board;