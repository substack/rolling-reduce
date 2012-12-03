var EventEmitter = require('events').EventEmitter;

module.exports = function (initial) {
    return new RReduce(initial);
};

function RReduce (initial) {
    if (!(this instanceof RReduce)) return new RReduce(initial);
    this.result = initial;
}

var special = { insert : 1, update : 1, remove : 1 };

RReduce.prototype = new EventEmitter;

RReduce.prototype.on
= RReduce.prototype.addEventListener
= function (name, f) {
    var f_ = f;
    var self = this;
    
    if (special[name]) {
        f_ = function () {
            self.result = f.apply(this, arguments);
            self.emit('result', self.result);
        };
    }
    return EventEmitter.prototype.on.call(this, name, f_);
};

RReduce.prototype.insert = function (value) {
    this.emit('insert', this.result, value);
};

RReduce.prototype.update = function (prev, value) {
    this.emit('update', this.result, prev, value);
};

RReduce.prototype.remove = function (value) {
    this.emit('remove', this.result, value);
};
