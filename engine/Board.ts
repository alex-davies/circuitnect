import Hex = require('./Hex');
import Tile = require('./Tile');
import Hashtable = require('util/Hashtable')
import Hashset = require('util/Hashset')
import Index = require('util/Index')

interface Action{
    execute(board:Board);
}

class Board{
    private tiles:Tile[] = [];
    private pointIndex = new Index<Hex.Point, Tile>(this.tiles, (tile)=>tile.position, Hex.stringifyPoint);


    constructor(private radius:number){

        var points = Hex.Spiral(Hex.ZeroPoint,radius);

        for(var i=0;i<points.length;i++){
            var point = points[i];
            var tile = new Tile(point);
            this.tiles.push(tile);
        }
        this.pointIndex.reindex();

        //this.pointIndex.get({a:0,b:0}).paths(new Hex.DirectionSet([Hex.Direction.pos_b, Hex.Direction.pos_a_neg_b]))
        //
        //var base = new Hex.DirectionSet([Hex.Direction.neg_a]);
        //this.pointIndex.get({a:1,b:0}).paths(base.turn(0))
        //this.pointIndex.get({a:0,b:1}).paths(base.turn(-1))
        //this.pointIndex.get({a:-1,b:1}).paths(base.turn(-2))
        //this.pointIndex.get({a:-1,b:0}).paths(base.turn(-3))
        //this.pointIndex.get({a:0,b:-1}).paths(base.turn(-4))
        //this.pointIndex.get({a:1,b:-1}).paths(base.turn(-5))

        this.populateBoard([Hex.ZeroPoint], this);
        //
        //for(var i=0;i<this.tiles.length;i++){
        //    var turns = Math.floor(Math.random() * 6)
        //    this.tiles[i].paths(this.tiles[i].paths().turn(turns));
        //}

    }


    public populateBoard(startPoints:Hex.Point[], board:Board){
        var rand = Math.random; //TODO: get a seedable random number generator
        var processedPoints = new Hashset<Hex.Point>(Hex.stringifyPoint);
        var toProcessPoints = new Hashset<Hex.Point>(Hex.stringifyPoint);

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


    public getTiles():Tile[]{
        return this.tiles;
    }

    public getTile(point:Hex.Point):Tile{
        return this.pointIndex.get(point);
    }

    public ExecuteAction(action: Action){
        console.debug('executing action', action);
        action.execute(this);
        console.debug('execution complete');
    }
}
export = Board;