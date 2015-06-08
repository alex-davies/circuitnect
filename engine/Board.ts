import Hex = require('./Hex');
import Tile = require('./Tile');
import Hashtable = require('util/Hashtable')
import Hashset = require('util/Hashset')

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
            var tile = new Tile();
            //tile.paths(new Hex.DirectionSet([Hex.Direction.pos_b]))
            //var canonicals = Hex.DirectionSet.Canonical;
            //var random = canonicals[Math.floor(Math.random() * canonicals.length)];
            //tile.paths(random);
            this.hexStore.put(point, tile);
        }

        //var tile = this.getTile(Hex.ZeroPoint);
        //tile.paths(new Hex.DirectionSet([Hex.Direction.neg_a, Hex.Direction.neg_a, Hex.Direction.neg_a_pos_b,Hex.Direction.pos_b]));

        this.populateBoard([Hex.ZeroPoint], this);
    }


    public populateBoard(startPoints:Hex.Point[], board:Board){
        var rand = Math.random; //TODO: get a seedable random number generator
        var hash = (point:Hex.Point)=>point.a + ','+point.b;
        var processedPoints = new Hashset<Hex.Point>(hash);
        var toProcessPoints = new Hashset<Hex.Point>(hash);

        for(var i=0;i<startPoints.length;i++){
            var tile = board.getTile(startPoints[i]);
            if(tile){
                toProcessPoints.add(startPoints[i]);
                tile.powered(true);
            }
        }

        while(toProcessPoints.size() > 0){
            var toProcessPointsThisRun = toProcessPoints.entries();
            for(var i=0;i<toProcessPointsThisRun.length;i++){
                var point = toProcessPointsThisRun[i];
                var tile = board.getTile(point);

                toProcessPoints.remove(point);
                processedPoints.add(point);

                if(!tile) { continue; }

                for(var di = 0; di < Hex.Direction.all.length ; di++){
                    var direction = Hex.Direction.all[di];
                    var otherPoint = Hex.Step(point, direction);
                    var otherTile = board.getTile(otherPoint);

                    if(otherTile && rand() > 0.7){
                        //connect the two tiles
                        tile.paths (tile.paths().with(direction));
                        otherTile.paths(otherTile.paths().with(Hex.Turn(direction, 3)));

                        if(!processedPoints.contains(otherPoint))
                            toProcessPoints.add(otherPoint);
                    }
                }

            }
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