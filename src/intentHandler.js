'use strict';
var textHelper = require('./textHelper'),
    storage = require('./storage');

var registerIntentHandlers = function (intentHandlers, skillContext) {
  intentHandlers.NewGameIntent = function (intent, session, response) {
    //starting a new game
    storage.loadGame(session, function (currentGame) {
      if (currentGame.data.players.length === 0) {
        response.ask('New game started. Choose your color please.');
        return;
      }
      //Start the game with no moves
      currentGame.data = '';
    });
  };

  intentHandlers.PlayMove = function (intent, session, response) {

  };

  intentHandlers.PlayMoveSpecifyFile = function (intent, session, response) {

  };

  intentHandlers.PlayMoveSpecifySquare = function (intent, session, response) {

  };

  intentHandlers.PlayCastle = function (intent, session, response) {

  };

}
