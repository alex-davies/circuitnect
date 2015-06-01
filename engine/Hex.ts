

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


    public static CartesianDimensions(hexSize:number, orientation:Hex.CartesianOrientation) : {width:number; height:number}{
        switch(orientation){
            case Hex.CartesianOrientation.PointyTop:
                return {
                    width: Math.sqrt(3) * hexSize,
                    height: hexSize * 2
                };
            case Hex.CartesianOrientation.FlatTop:
                return {
                    width: hexSize * 2,
                    height:Math.sqrt(3) * hexSize
                };
            default:
                throw new Error("Unknown orientation '"+orientation+"'");
        }
    }

    public static ToCartesianPoint(point:Hex.Point, hexSize:number, orientation:Hex.CartesianOrientation):{x:number;y:number}{
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

    public static ToHexPoint(point:{x:number; y:number}, hexSize:number, orientation:Hex.CartesianOrientation){
        switch(orientation){
            case Hex.CartesianOrientation.PointyTop:
                return Hex.Round({
                    b:(point.x * Math.sqrt(3)/3 - point.y / 3) / hexSize,
                    a:point.y * 2/3 / hexSize,
                });
            case Hex.CartesianOrientation.FlatTop:
                return Hex.Round({
                    b:point.x * 2/3 / hexSize,
                    a:(-point.x / 3 + Math.sqrt(3)/3 * point.y) / hexSize
                });
            default:
                throw new Error("Unknown orientation '"+orientation+"'");
        }
    }

    private static Round(point:Hex.Point) : Hex.Point{
        //return {
        //    a: Math.round(point.a),
        //    b: Math.round(point.b)
        //};

        var ra = Math.round(point.a)
        var rb = Math.round(point.b)
        var rc = Math.round(-point.a-point.b)

        var a_diff = Math.abs(ra - point.a)
        var b_diff = Math.abs(rb - point.b)
        var c_diff = Math.abs(rc - (-point.a-point.b))

        if (a_diff > b_diff && a_diff > c_diff)
            ra = -rb-rc
        else if (b_diff > c_diff)
            rb = -ra-rc

        return {a:ra, b:rb}
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
            new DirectionSet([]),

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
            var result = [];
            var directionArray = this.values();
            for(var i=0;i<directionArray.length;i++){
                result.push(Hex.Turn(directionArray[i], turnAmount))
            }
            return new Hex.DirectionSet(result);
        }

        public contains(direction:Hex.Direction){
            return this.values().indexOf(direction) !== -1;
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
