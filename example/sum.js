var reduce = require('../');
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
