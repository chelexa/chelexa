'use strict';
var AlexaSkill = require('./AlexaSkill'),
    eventHandlers = require('./eventHandlers'),
    intentHandlers = require('./intentHandlers');

var APP_ID ="amzn1.echo-sdk-ams.app.c26442ad-8950-4ad3-8587-7d91bc2330a4";
var skillContext = {};

var Chelexa = function() {
    AlexaSkill.call(this, APP_ID);
    skillContext.needMoreHelp = true;
};

Chelexa.prototype = Object.create(AlexaSkill.prototype);
Chelexa.prototype.constructor = Chelexa;

eventHandlers.register(Chelexa.prototype.eventHandlers, skillContext);
intentHandlers.register(Chelexa.prototype.intentHandlers, skillContext);

module.exports = Chelexa;
