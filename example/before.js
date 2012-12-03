var doc = new(require('crdt').Doc)

var output = doc.createSet('type', 'output');
var test = doc.createSet('type', 'test');

var output = doc.createSet('type', 'output');
var test = doc.createSet('type', 'test');

doc.add({
    type : 'output',
    test : 'abc123',
    value : 'beep '
});

doc.add({
    type : 'output',
    test : 'abc123',
    value : 'boop\n'
});

doc.add({
    type : 'test',
    id : 'abc123',
    commit : 'd8180b0778dd7a145b46f92b9a2d77db916debc5',
});

var result = Object.keys(doc.rows).reduce(function (acc, key) {
    var row = doc.rows[key].state;
    if (row.type === 'output') {
        var test = acc[row.test];
        if (!test) test = acc[row.test] = {};
        if (!test.output) test.output = [];
        test.output.push(row.value);
    }
    else if (row.type === 'test') {
        var test = acc[row.id];
        if (!test) test = acc[row.id] = {};
        if (!test.output) test.output = [];
        test.commit = row.commit;
    }
    return acc;
}, {});

console.dir(result);
