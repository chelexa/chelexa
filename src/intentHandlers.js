'use strict';
var storage = require('./storage'),
    map = require('./chessMap'),
    http = require('http');

var chessServer = "54.152.13.83",
    chessPort = 8000;

var versusAI = true;


var registerIntentHandlers = function (intentHandlers, skillContext) {
  intentHandlers.PlayMove = function (intent, session, response) {
    intent.slots.SourceFile = '';
    intent.slots.SourceRank = '';
    PlayMoveSquare(intent, session, response);
  };

  //on launch
  intentHandlers.StartChess = function (intent, session, response ) {
    storage.loadGame(session, function(currentGame) {
      response.ask('Welcome to chess, your move', 'please choose your move');
    });
  };

  intentHandlers.PlayMoveSpecifyFile = function (intent, session, response) {
    intent.slots.SourceRank = '';
    PlayMoveSpecifySquare(intent, session, response);
  };

  intentHandlers.PlayMoveSpecifyRank = function (intent, session, response) {
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
        http.get( "http://" + chessServer + ":" + chessPort + "/move?fen=" + currentGame.data.fen + "&move=" + move,
        ( response ) => {
          //console.log( response );
          var str = '';
          var data = '';
          //another chunk of data has been recieved, so append it to `str`
          response.on('data', function (chunk) {
            str += chunk;
          });

          //the whole response has been recieved, so we just print it out here
          response.on('end', function () {
            //console.log(str);
            // Data reception is done, do whatever with it!
            data = JSON.parse(str);

            if (data.status !== "error"){
              currentGame.data.fen = data.fen;
              currentGame.data.lastMove = data.move;
              storage.save( function () {
                //TODO: maybe indicate color of next move here
                response.ask('computer move ' + data.move, "next move please");
              });
            } else {
              //handle error
              response.ask('sorry, not a valid move, please choose again', 'sorry, not a valid move, please choose again');
              return;
            }
          });

          response.resume();
        });
      } else {
        //response = // TODO - Call Tyler here
      }
    });
  };
};
exports.register = registerIntentHandlers;
