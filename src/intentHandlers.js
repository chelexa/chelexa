'use strict';
var storage = require('./storage'),
    map = require('./chessMap'),
    jquery = require('./jQuery');

var chessServer = "54.152.13.83",
    chessPort = 8000;

var versusAI = true;

var registerIntentHandlers = function (intentHandlers, skillContext) {
  intentHandlers.PlayMove = function (intent, session, response) {
    intent.slots.SourceFile = '';
    intent.slots.SourceRank = '';
    PlayMoveSquare(intent, session, response);
  };

  intentHandlers.PlayMoveSpecifyFile = function (intent, session, response) {
    intent.slots.SourceRank = '';
    PlayMoveSpecifySquare(intent, session, response);
  };

  intentHandlers.PlayMoveSpecifySquare = function (intent, session, response) {
    intent.slots.SourceFile = '';
    PlayMoveSquare(intent, session, response);
  };

  intentHandlers.PlayCastle = function (intent, session, response) {

  };

  function PlayMoveSquare (intent, session, response) {
    //give a player points, ask additional question if slot values are missing.
    var piece = intent.slots.Piece.value,
        file = intent.slots.File.value,
        rank = intent.slots.Rank.value,
        sourceFile = intent.slots.SourceFile.value,
        sourceRank = intent.slots.SourceRank.value,
        action = intent.slots.Action.value,
        move;

        console.log(map.pieceMap);

    if (map.pieceMap[piece] !== null) {
        piece = map.pieceMap[piece];
    }

    action = map.actionsMap[action];

    // formatting our response
    move = piece + sourceFile + sourceRank + action + file + rank

    storage.loadGame(session, function (currentGame) {
      if ( versusAI ) {
        //TODO: fill this shit out
        jquery.get( chessServer + ":" + chessPort + "/move?", { fen: currentGame.data.fen, move: move}, function( data ) {
          console.log( data );
          if (data.status !== "error"){
              currentGame.data.fen = data.fen;
              currentGame.data.lastMove = data.move;
              storage.save( function () {
                //TODO: maybe indicate color of next move here
                response.ask('computer move ' + data.move);
              });
          } else {
            //handle error
            response.ask('sorry, not a valid move, please choose again');
            return;
          }
        });
      } else {
        //response = // TODO - Call Tyler here
      }
    });
  };
};
exports.register = registerIntentHandlers;
