import Hex = require('engine/Hex');
import Observable = require('util/Observable');

class Tile{
    position : Hex.Point;

    paths = Observable<Hex.DirectionSet>(new Hex.DirectionSet([]))
    active = Observable<boolean>(false);
    powered = Observable<boolean>(false);

    constructor(position : Hex.Point){
        this.position = position;
    }
}
export = Tile;