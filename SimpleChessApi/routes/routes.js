var stockfish = require("stockfish");
var chess = require("chesslib");
var FEN = chess.FEN;
var engine = stockfish();
var position = "startpos";
var got_uci;
var started_thinking;
var best_move;
var callback;


function send(str)
{
    console.log("Sending: " + str)
    engine.postMessage(str);
    if (str === "stop"){
    	console.log(best_move);
    }
}

engine.onmessage = function (line)
{
    var match;
    console.log("Line: " + line)
    
    if (typeof line !== "string") {
        console.log("Got line:");
        console.log(typeof line);
        console.log(line);
        return;
    }
    
    if (!got_uci && line === "uciok") {
        got_uci = true;
        if (position) {
            send("position " + position);
            send("eval");
            send("d");
        }
        
        send("go ponder");
    } else if (!started_thinking && line.indexOf("info depth") > -1) {
        console.log("Thinking...");
        started_thinking = true;
        setTimeout(function ()
        {
            send("stop");
        }, 1000 * 5);
    } else if (line.indexOf("bestmove") > -1) {
        match = line.match(/bestmove\s+(\S+)/);
        if (match) {
            console.log("Best move: " + match[1]);
            best_move = match[1];
            callback(best_move);
            //process.exit();
        }
    }
};

var appRouter = function(app) {
	app.get("/", function(req, res) {
		res.send("Hello World");
	});

	app.get("/account", function(req, res) {
	    var accountMock = {
	        "username": "tyler",
	        "password": "1234",
	        "twitter": "@nraboy"
	    }
	    if(!req.query.username) {
	        return res.send({"status": "error", "message": "missing username"});
	    } else if(req.query.username != accountMock.username) {
	        return res.send({"status": "error", "message": "wrong username"});
	    } else {
	        return res.send(accountMock);
	    }

	});

    app.get("/move", function(req, res) {
	    if(!req.query.fen || !req.query.move) {
	        return res.send({"status": "error", "message": "missing fen or move"});
	    } else {
            var pos = new FEN.parse(req.query.fen);
            pos = pos.move(req.query.move);
	    	position = "fen " + FEN.stringify(pos);

	    	send("uci");
	    	callback = function(move){
	    		res.send(move);
	    	}
	    }
	});
}
 
module.exports = appRouter;