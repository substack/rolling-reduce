var test = require('tape');
var reduce = require('../');

test('rolling sum', function (t) {
    t.plan(8);
    
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
    
    t.equal(summer.result, 0);
    
    summer.once('result', function (sum) {
        t.equal(sum, 7);
    });
    summer.insert(7);
    
    summer.once('result', function (sum) {
        t.equal(sum, 7 + 8);
    });
    summer.insert(8);
    
    summer.once('result', function (sum) {
        t.equal(sum, 7 + 8 + 9);
    });
    summer.insert(9);
    
    t.equal(summer.result, 24);
    
    summer.once('result', function (sum) {
        t.equal(sum, 17);
    });
    summer.remove(7); // 24 - 7 = 17
    
    summer.once('result', function (sum) {
        t.equal(sum, 18);
    });
    summer.update(9, 10); // 17 - 9 + 10 = 18
    
    summer.once('result', function (sum) {
        t.equal(sum, 29);
    });
    summer.insert(11); // 18 + 11 = 29
});
