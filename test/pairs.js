var test = require('tape');
var reduce = require('../');
var pairs = reduce([]);

function indexOf (xs, x) {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i][0] === x.id) return i;
    }
    return -1;
}

pairs.on('insert', function (xs, x) {
    xs.push([ x.id, x.value ]);
    return xs;
});

pairs.on('update', function (xs, xPrev, x) {
    var ix = indexOf(xs, xPrev);
    xs[ix][1] = x.value;
    return xs;
});

pairs.on('remove', function (xs, x) {
    var ix = indexOf(xs, x);
    if (ix >= 0) xs.splice(ix, 1);
    return xs;
});

test('rolling pairwise reduce', function (t) {
    t.plan(7);
    t.deepEqual(pairs.result, []);
    
    var abc = { id : 'abc', value : 7 };
    pairs.once('result', function (res) {
        t.deepEqual(res, [ [ 'abc', 7 ] ]);
    });
    pairs.insert(abc);
    
    var def = { id : 'def', value : 8 };
    pairs.once('result', function (res) {
        t.deepEqual(res, [ [ 'abc', 7 ], [ 'def', 8 ] ]);
    });
    pairs.insert(def);
    
    var ghi = { id : 'ghi', value : 9 };
    pairs.once('result', function (res) {
        t.deepEqual(res, [ [ 'abc', 7 ], [ 'def', 8 ], [ 'ghi', 9 ] ]);
    });
    pairs.insert(ghi);
    
    pairs.once('result', function (res) {
        t.deepEqual(res, [ [ 'def', 8 ], [ 'ghi', 9 ] ]);
    });
    pairs.remove(abc);
    
    pairs.once('result', function (res) {
        t.deepEqual(res, [ [ 'def', 555 ], [ 'ghi', 9 ] ]);
    });
    pairs.update(def, { id : 'def', value : 555 });
    
    var xyz = { id : 'xyz', value : 5 };
    pairs.once('result', function (res) {
        t.deepEqual(res, [ [ 'def', 555 ], [ 'ghi', 9 ], [ 'xyz', 5 ] ]);
    });
    pairs.insert(xyz);
});
