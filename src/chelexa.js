'use strict';
var AlexaSkill = require('./AlexaSkill'),
    eventHandlers = require('./eventHandlers'),
    intentHandlers = require('./intentHandlers');
    
var skillContext = {};

var Chelexa = function() {
    AlexaSkill.call(this);
    skillContext.needMoreHelp = true;
};

Chelexa.prototype = Object.create(AlexaSkill.prototype);
Chelexa.prototype.constructor = Chelexa;

eventHandlers.register(Chelexa.prototype.eventHandlers, skillContext);
intentHandlers.register(Chelexa.prototype.intentHandlers, skillContext);

module.exports = Chelexa;