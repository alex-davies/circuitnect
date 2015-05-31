

class Hex{
    public static ZeroPoint = {a:0,b:0};

    public static Turn(direction:Hex.Direction, turnAmount:number = 1):Hex.Direction {
        return (direction + turnAmount) % 6;
    }

    public static Step(point:Hex.Point, direction:Hex.Direction, stepSize:number = 1):Hex.Point{
        switch(direction){
            case Hex.Direction.a:
                return {a:point.a, b:point.b+1*stepSize}
            case Hex.Direction.b:
                return {a:point.a+1*stepSize, b:point.b}
            case Hex.Direction.c:
                return {a:point.a+1*stepSize, b:point.b-1*stepSize}
            case Hex.Direction.neg_a:
                return  {a:point.a, b:point.b-1*stepSize}
            case Hex.Direction.neg_b:
                return {a:point.a-1*stepSize, b:point.b}
            case Hex.Direction.neg_c:
                return {a:point.a-1*stepSize, b:point.b+1*stepSize}
            default:
                throw new Error("Unknown direction '"+direction+"'");
        }
    }

    public static Ring(center:Hex.Point, radius:number, startDirection:Hex.Direction = Hex.Direction.a):Hex.Point[]{

        //need special case to handle 0 otherwise nothing will return
        if(radius == 0)
            return [center];

        var result = [];
        var currentPoint = Hex.Step(center, startDirection, radius);
        var currentDirection = Hex.Turn(startDirection, 2);

        //for every direction we will take [radius] steps around our center point
        for(var sideCount = 0; sideCount < 6 ; sideCount++){
            for(var i =0;i<radius;i++){
                result.push(currentPoint);
                currentPoint = Hex.Step(currentPoint, currentDirection);
            }
            currentDirection = Hex.Turn(currentDirection);
        }
        return result;
    }

    public static Spiral(center:Hex.Point, maxRadius:number, startDirection:Hex.Direction = Hex.Direction.a):Hex.Point[]{
        var result = [];
        for(var currentRadius=0;currentRadius<=maxRadius;currentRadius++){
            result.push.apply(result, Hex.Ring(center, currentRadius, startDirection));
        }
        return result;
    }


    public static CartesianWidth(hexSize:number, orientation:Hex.CartesianOrientation):number{
        switch(orientation){
            case Hex.CartesianOrientation.FlatTop:
                return hexSize * 2;
            case Hex.CartesianOrientation.PointyTop:
                return Math.sqrt(3) * hexSize;
            default:
                throw new Error("Unknown orientation '"+orientation+"'");
        }
    }
    public static CartesianHeight(hexSize:number, orientation:Hex.CartesianOrientation):number{
        switch(orientation){
            case Hex.CartesianOrientation.PointyTop:
                return hexSize * 2;
            case Hex.CartesianOrientation.FlatTop:
                return Math.sqrt(3) * hexSize;
            default:
                throw new Error("Unknown orientation '"+orientation+"'");
        }
    }

    public static ToCartesianCoordinate(point:Hex.Point, hexSize:number, orientation:Hex.CartesianOrientation):{x:number;y:number}{
        switch(orientation){
            case Hex.CartesianOrientation.PointyTop:
                return {
                    x:hexSize * Math.sqrt(3) * (point.a + point.b/2),
                    y:hexSize * 3/2 * point.b,
                };
            case Hex.CartesianOrientation.FlatTop:
                return {
                    x:hexSize * 3/2 * point.b,
                    y:hexSize * Math.sqrt(3) * (point.a + point.b/2)
                };
            default:
                throw new Error("Unknown orientation '"+orientation+"'");
        }
    }


}
module Hex {
    export enum CartesianOrientation{
        FlatTop, PointyTop
    }
    export enum Direction{
        a =0,
        b = 1,
        c =2,
        neg_a =3,
        neg_b=4,
        neg_c=5
    }
    export interface Point {
        a:number;
        b:number;
    }

    export class DirectionSet{
        public static Canonical = [
            new DirectionSet([Hex.Direction.a]),

            new DirectionSet([Hex.Direction.a, Hex.Direction.b]),
            new DirectionSet([Hex.Direction.a, Hex.Direction.c]),
            new DirectionSet([Hex.Direction.a, Hex.Direction.neg_a]),

            new DirectionSet([Hex.Direction.a, Hex.Direction.b, Hex.Direction.c]),
            new DirectionSet([Hex.Direction.a, Hex.Direction.b, Hex.Direction.neg_b]),
            new DirectionSet([Hex.Direction.a, Hex.Direction.b, Hex.Direction.c]),

            new DirectionSet([Hex.Direction.a, Hex.Direction.b, Hex.Direction.c, Hex.Direction.neg_a]),
            new DirectionSet([Hex.Direction.a, Hex.Direction.b, Hex.Direction.c, Hex.Direction.neg_b]),
            new DirectionSet([Hex.Direction.a, Hex.Direction.b, Hex.Direction.neg_a, Hex.Direction.neg_b]),

            new DirectionSet([Hex.Direction.a, Hex.Direction.b, Hex.Direction.c, Hex.Direction.neg_a, Hex.Direction.neg_b]),

            new DirectionSet([Hex.Direction.a, Hex.Direction.b, Hex.Direction.c, Hex.Direction.neg_a, Hex.Direction.neg_b, Hex.Direction.neg_c]),

        ]

        private normalizedArray:Hex.Direction[] = [];

        constructor(directions: Hex.Direction[]){
            var uniqued = directions.filter((value, i, self)=>self.indexOf(value) === i);
            this.normalizedArray = uniqued.sort()
        }

        public values():Hex.Direction[]{
            return this.normalizedArray;
        }

        public turn(turnAmount:number = 1):Hex.DirectionSet {
            var result;
            var directionArray = this.values();
            for(var i=0;i<directionArray.length;i++){
                result.push(Hex.Turn(directionArray[i], turnAmount))
            }
            return new Hex.DirectionSet(result);
        }

        public turnsToCanonical():{canonical:Hex.DirectionSet; turns:number}{
            for(var i=0;i<DirectionSet.Canonical.length;i++) {
                var potentialCanonical = this.turn(i);
                if(potentialCanonical.isCanonical()){
                    return {
                        canonical: potentialCanonical,
                        turns: i
                    }
                }
            }

            //if we get here then we have a directionset that is not related
            //to any of our canonical direction sets
            throw new Error('DirectionSet is not related to a canonical direction set');
        }

        public isCanonical():boolean{
            for(var i=0;i<DirectionSet.Canonical.length;i++){
                if(this.equals(DirectionSet.Canonical[i]))
                    return true;
            }
            return false;
        }

        public equals(other:Hex.DirectionSet){
            var otherValues = other.values();
            var values = this.values();

            if(otherValues.length !== values.length)
                return false;

            for(var i=0;i<otherValues.length;i++){
                if (values.indexOf(otherValues[i]) === -1)
                    return false;
            }
            return true;
        }
    }

}

export = Hex;
