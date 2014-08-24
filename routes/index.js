var express = require("express");
var router = express.Router();
var dgram = require("dgram");
var twServer = require("../js/tw_server");
var utils = require("../js/utils");


/* GET home page. */
router.get('/', function(req, res) {
	var address = {port : req.query.port, address : req.query.address};
	var local = {port : 8303, address : "localhost"};

	var srv = twServer.createServerListener();
	srv.addServer(address);
	// srv.addServer(local);
	srv.sendRequests();

	srv.on("gotInfo", function(serverInfo) {
		res.render('index', { serverinf: JSON.stringify(serverInfo), playerinf : JSON.stringify(serverInfo.players) });
	});
});

module.exports = router;
