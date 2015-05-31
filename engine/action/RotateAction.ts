import Hex = require('engine/Hex');
import Board = require('engine/Board');
class RotateAction{
    constructor(private hexPoint:Hex.Point, private rotateCount:number = 1){

    }

    execute(board:Board){
        var tile = board.getTile(this.hexPoint);
        if(tile){
            tile.paths = Hex.TurnDirectionSet(tile.paths, this.rotateCount);
        }

    }
}
export = RotateAction;