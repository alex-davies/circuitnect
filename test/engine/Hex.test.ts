///<reference path="../../lib/qunit/qunit.d.ts"/>

import Hex = require('../../engine/Hex');
export function run(){


    QUnit.module('Hex');

    //QUnit.test( "Neighbours", function( assert ) {
    //    assert.deepEqual(Hex.Neighbours({pos_b:2, pos_a:3}),[
    //        {pos_b:2,pos_a:2},
    //        {pos_b:3,pos_a:2},
    //        {pos_b:3,pos_a:3},
    //        {pos_b:2,pos_a:4},
    //        {pos_b:1,pos_a:4},
    //        {pos_b:1,pos_a:3}
    //    ]);
    //
    //});

    QUnit.test( "Ring - when radius 0 should be start point", function( assert ) {
        var ring = Hex.Ring({a:2, b:3}, 0);
        assert.deepEqual(ring,[{a:2, b:3}]);
    });
    QUnit.test( "Ring - should be ring of points", function( assert ) {
        var ring = Hex.Ring({a:2, b:3}, 2, Hex.Direction.pos_a);
        assert.deepEqual(ring,[
            {a:4, b:3},

            {a:4, b:2},
            {a:4, b:1},

            {a:3, b:1},
            {a:2, b:1},

            {a:1,b:2},
            {a:0,b:3},

            {a:0,b:4},
            {a:0,b:5},

            {a:1,b:5},
            {a:2,b:5},

            {a:3,b:4},
        ]);
    });

    QUnit.test( "Spiral - should be increasing ring of points", function( assert ) {
        var spiral = Hex.Spiral({a:2, b:3}, 2, Hex.Direction.pos_a);
        assert.deepEqual(spiral,[
            {a:2, b:3},

            {a:3,b:3},
            {a:3,b:2},
            {a:2,b:2},
            {a:1,b:3},
            {a:1,b:4},
            {a:2,b:4},

            {a:4, b:3},
            {a:4, b:2},
            {a:4, b:1},
            {a:3, b:1},
            {a:2, b:1},
            {a:1,b:2},
            {a:0,b:3},
            {a:0,b:4},
            {a:0,b:5},
            {a:1,b:5},
            {a:2,b:5},
            {a:3,b:4},
        ]);
    });

    QUnit.test( "ToCartesianPoint - FlatTop move only in Y direction", function( assert ) {
        var cart = Hex.ToCartesianPoint({a:0, b:1}, 10, Hex.CartesianOrientation.FlatTop);
        assert.equal(cart.x, 0);
        assert.equal(cart.y, Hex.CartesianDimensions(10,Hex.CartesianOrientation.FlatTop).height);

    });
    QUnit.test( "ToCartesianPoint - FlatTop move only in X direction", function( assert ) {
        var cart = Hex.ToCartesianPoint({a:2, b:-1}, 10, Hex.CartesianOrientation.FlatTop);
        assert.equal(cart.x,  Hex.CartesianDimensions(10,Hex.CartesianOrientation.FlatTop).width + 10);
        assert.equal(cart.y, 0);

    });

    QUnit.test( "ToHexPoint - FlatTop move only in X direction", function( assert ) {
        var hex = Hex.ToHexPoint({x:0, y:10}, 10, Hex.CartesianOrientation.FlatTop);
        assert.equal(hex.b,  1);
        assert.equal(hex.a, 0);

    });

    QUnit.test( "CartesianDimensions - FlatTop single tile dimensions", function( assert ) {
        var dimensions = Hex.CartesianDimensions(10, Hex.CartesianOrientation.FlatTop);

        assert.equal(dimensions.width, 20);
        decEqual(assert, dimensions.height, 17.3, 0.1,'');
    });

    function decEqual(assert, actual, expected, tolerance, message) {
        assert.ok(Math.abs(actual - expected) <= tolerance, message);
    }
}
