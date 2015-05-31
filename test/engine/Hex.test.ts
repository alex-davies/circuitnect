///<reference path="../../lib/qunit/qunit.d.ts"/>

import Hex = require('../../engine/Hex');
export function run(){


    QUnit.module('Hex');

    //QUnit.test( "Neighbours", function( assert ) {
    //    assert.deepEqual(Hex.Neighbours({a:2, b:3}),[
    //        {a:2,b:2},
    //        {a:3,b:2},
    //        {a:3,b:3},
    //        {a:2,b:4},
    //        {a:1,b:4},
    //        {a:1,b:3}
    //    ]);
    //
    //});

    QUnit.test( "Ring - when radius 0 should be start point", function( assert ) {
        var ring = Hex.Ring({a:2, b:3}, 0);
        assert.deepEqual(ring,[{a:2, b:3}]);
    });
    QUnit.test( "Ring - should be ring of points", function( assert ) {
        var ring = Hex.Ring({a:2, b:3}, 2, Hex.Direction.b);
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
        var spiral = Hex.Spiral({a:2, b:3}, 2, Hex.Direction.b);
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

    QUnit.test( "CartesianCoordinate - FlatTop move only in Y direction", function( assert ) {
        var cart = Hex.ToCartesianCoordinate({a:1, b:0}, 10, Hex.CartesianOrientation.FlatTop);
        assert.equal(cart.x, 0);
        assert.equal(cart.y, Hex.CartesianHeight(10,Hex.CartesianOrientation.FlatTop));

    });
    QUnit.test( "CartesianCoordinate - FlatTop move only in X direction", function( assert ) {
        var cart = Hex.ToCartesianCoordinate({a:-1, b:2}, 10, Hex.CartesianOrientation.FlatTop);
        assert.equal(cart.x,  Hex.CartesianWidth(10,Hex.CartesianOrientation.FlatTop) + 10);
        assert.equal(cart.y, 0);

    });
}
