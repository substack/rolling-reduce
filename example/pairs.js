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

pairs.on('result', function (res) {
    console.log('pairs=' + JSON.stringify(res));
});

var abc = { id : 'abc', value : 7 };
pairs.insert(abc);

var def = { id : 'def', value : 8 };
pairs.insert(def);

var ghi = { id : 'ghi', value : 9 };
pairs.insert(ghi);

pairs.remove(abc);

pairs.update(def, { id : 'def', value : 555 });

var xyz = { id : 'xyz', value : 5 };
pairs.insert(xyz);
