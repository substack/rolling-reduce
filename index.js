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

RReduce.prototype.insert = function (key, value) {
    var self = this;
    if (typeof key === 'object') {
        Object.keys(key).forEach(function (k) {
            self.insert(k, value);
        });
        return;
    }
    
    if (arguments.length === 1) {
        // keys aren't required for insert()
        value = key;
        key = undefined;
    }
    self.emit('insert', self.result, value, key);
};

RReduce.prototype.update = function (key, value) {
    this.emit('update', this.result, value, this.result[key], key);
};

RReduce.prototype.remove = function (key) {
    this.emit('remove', this.result, this.result[key], key);
};
