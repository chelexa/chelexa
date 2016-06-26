'use strict';
var textHelper = require('./textHelper'),
    storage = require('./storage'),
    map = require('./chessMap');

var versusAI = true;

var registerIntentHandlers = function (intentHandlers, skillContext) {
  intentHandlers.NewGameIntent = function (intent, session, response) {
    //starting a new game
    storage.loadGame(session, function (currentGame) {
      if (currentGame.data.players.length === 0) {
        response.ask('New game started. You are the white player.');
        return;
      }
      //Start the game with no moves saved
      currentGame.data = '';
    });
  };

  intentHandlers.PlayMove = function (intent, session, response) {
    intent.slots.SourceFile = '';
    intent.slots.SourceRank = '';
    this.PlayMoveSquare(intent, session, response);
  };

  intentHandlers.PlayMoveSpecifyFile = function (intent, session, response) {
    intent.slots.SourceRank = '';
    this.PlayMoveSpecifySquare(intent, session, response);
  };

  intentHandlers.PlayMoveSpecifySquare = function (intent, session, response) {
    intent.slots.SourceFile = '';
    this.PlayMoveSquare(intent, session, response);
  };

  intentHandlers.PlayCastle = function (intent, session, response) {

  };

  intentHandlers.PlayMoveSquare = function (intent, session, response) {
    //give a player points, ask additional question if slot values are missing.
    var piece = intent.slots.Piece.value,
        file = intent.slots.File.value,
        rank = intent.slots.Rank.value,
        sourceFile = intent.slots.SourceFile.value,
        sourceRank = intent.slots.SourceRank.value,
        action = intent.slots.Action.value,
        move,
        response,
        responseMessage;

    if (map.pieceMap[piece] !== null) {
        piece = map.pieceMap[piece];
    }

    action = map.actionsMap[action];

    // formatting our response
    move = piece + sourceFile + sourceRank + action + file + rank

    if ( versusAI ) {
      //TODO: fill this shit out
      response = // TODO - Call Tyler here
      responseMessage = // TODO - AI Move
    } else {
      response = // TODO - Call Tyler here
      responseMessage = 'next move';
    }

    if (response /* ERROR */ ) {
      response.ask('sorry, not a valid move, please choose again');
    } else {
      currentGame.data.fen = //TODO: Response fen
      storage.save( function () {
        //TODO: maybe indicate color of next move here
        response.ask(responseMessage);
      });
    }
  }

}
