var stockfish = require("stockfish");
var Chess = require("chess.js").Chess;
var engine = stockfish();
var position = "startpos";
var got_uci;
var started_thinking;
var best_move;
var callback;


function send(str)
{
    //console.log("Sending: " + str)
    engine.postMessage(str);
    if (str === "stop"){
    	console.log("Best move: " + best_move);
    }
}

engine.onmessage = function (line)
{
    var match;
    //console.log("Line: " + line)
    
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
        }, 1000 * 1);
    } else if (line.indexOf("bestmove") > -1) {
        match = line.match(/bestmove\s+(\S+)/);
        if (match) {
            //console.log("Best move: " + match[1]);
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
            var pos = new Chess(req.query.fen);
            //var pos = new FEN.parse(req.query.fen);
            pos.move(req.query.move);
	    	position = "fen " + pos.fen();

	    	send("uci");
	    	callback = function(move){
                var status = pos.move(move, {sloppy: true});
	    		res.send({"status": status !== null ? "success" : "error", "fen": pos.fen(), "move": move});
                got_uci = false;
                started_thinking = false;
	    	}
	    }
	});
}
 
module.exports = appRouter;