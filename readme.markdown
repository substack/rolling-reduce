# rolling-reduce

Reduce over collections without recomputing everything when new items arrive or
when items in the source change.

[![browser support](http://ci.testling.com/substack/rolling-reduce.png)](http://ci.testling.com/substack/rolling-reduce)

[![build status](https://secure.travis-ci.org/substack/rolling-reduce.png)](http://travis-ci.org/substack/rolling-reduce)

# example

## sum

``` js
var reduce = require('rolling-reduce');
var summer = reduce(0);

summer.on('insert', function (sum, x) {
    return sum + x;
});

summer.on('update', function (sum, xPrev, x) {
    return sum - xPrev + x;
});

summer.on('remove', function (sum, x) {
    return sum - x;
});

summer.on('result', function (sum) {
    console.log('sum=' + sum);
});

[ 7, 8, 9 ].forEach(function (x) {
    summer.insert(x);
}); // 7 + 8 + 9 = 24

summer.remove(7); // 24 - 7 = 17

summer.update(9, 10); // 17 - 9 + 10 = 18

summer.insert(11); // 18 + 11 = 29
```

```
$ node example/sum.js
sum=7
sum=15
sum=24
sum=17
sum=18
sum=29
```

## pairs

``` js
var reduce = require('rolling-reduce');
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
```

```
$ node example/pairs.js
pairs=[["abc",7]]
pairs=[["abc",7],["def",8]]
pairs=[["abc",7],["def",8],["ghi",9]]
pairs=[["def",8],["ghi",9]]
pairs=[["def",555],["ghi",9]]
pairs=[["def",555],["ghi",9],["xyz",5]]
```

# methods

``` js
var reduce = require('rolling-reduce')
```

## var r = reduce(init)

Create a reduce object `r` from an initial accumulator value `init`.

The event handlers `'insert'`, `'update'`, and `'remove'` are responible for
computing the reduction on the accumulator.

## r.insert(x)

Insert a new object `x` into the source.

## r.update(xPrev, x)

Update over the previous item `xPrev` with a new source item `x`.

## r.remove(x)

Remove the item `x` from the source.

# events

## r.on('insert', cb)

The callback `cb(acc,x)` fires when `r.insert(x)` is called.

`cb(acc,x)` should return the new value for the accumulator `acc`.

## r.on('update', cb)

The callback `cb(acc,xPrev,x)` fires when `r.update(xPrev,x)` is called.

Note that `xPrev` and `x` are merely a convention and the values from
`r.update()` are passed directly through.

`cb(acc,xPrev,x)` should return the new value for the accumulator `acc`.

## r.on('remove', cb)

The callback `cb(acc,x)` fires when `r.remove(x)` is called.

Note that `x` is merely a convention and you can choose to signify elements in
any scheme that you like.

`cb(acc,x)` should return the new value for the accumulator `acc`.

# install

With [npm](https://npmjs.org) do:

```
npm install rolling-reduce
```

# license

MIT
