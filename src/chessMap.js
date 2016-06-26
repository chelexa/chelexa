var chessMap = chessMap || {};

chessMap.pieceMap = {
  "rook" : "R",
  "bishop" : "B",
  "knight" : "N",
  "queen" : "Q",
  "king" : "K",
  "pawn" : "",
  "" : ""
};


chessMap.actionsMap = {
  "to" : "",
  "takes" : "x",
  "captures" : "x",
  "takes on" : "x",
  "captures on" : "x",
  //Null takes care of value null :)
  "" : "",
  "null" : ""
};

module.exports = chessMap;
