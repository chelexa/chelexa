'use strict';

var Chelexa = require('./chelexa');

exports.handler = function(event, context) {
    var chelexa = new Chelexa();
    chelexa.execute(event, context);
};