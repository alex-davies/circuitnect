import Hex = require('engine/Hex');
import Observable = require('util/Observable');

class Tile{
    paths = Observable<Hex.DirectionSet>(new Hex.DirectionSet([Hex.Direction.a]))
    active = Observable<boolean>(false);
}
export = Tile;