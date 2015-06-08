import Hex = require('engine/Hex');
import Observable = require('util/Observable');

class Tile{
    paths = Observable<Hex.DirectionSet>(new Hex.DirectionSet([]))
    active = Observable<boolean>(false);
    powered = Observable<boolean>(false);
}
export = Tile;