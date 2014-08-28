var express = require("express");
var router = express.Router();
var dgram = require("dgram");
var twServer = require("../js/tw_server");
var twMaster = require("../js/master_server");
var econ = require("../js/econ");
var utils = require("../js/utils");
var twMap = require("../js/tw_map");


/* GET home page. */
router.get("/", function(req, res) {

	// var address = {port : req.query.port, address : req.query.address};
	// var local = {port : 8303, address : "localhost"};

	// var srv = twServer.createServerListener();
	// srv.addServer(address);
	// srv.addServer(local);
	// srv.sendRequests();

	// srv.on("gotInfo", function(serverInfos) {
	// 	console.log(serverInfos);

	// 	res.render("index", { serverinf: JSON.stringify(serverInfos) });
	// });

	// var map = twMap.createMapReader();
	// map.open("/home/hax/.teeworlds/maps/testnode.map");

	var master = twMaster.createMasterListener();
	master.addMaster({address: "master1.teeworlds.com", port: 8300});
	master.addMaster({address: "master2.teeworlds.com", port: 8300});
	master.addMaster({address: "master3.teeworlds.com", port: 8300});
	master.addMaster({address: "master4.teeworlds.com", port: 8300});
	master.sendRequests();

	var srv = twServer.createServerListener();
	master.getParsedAddresses().forEach(function(address) {
		srv.addServer(address);		
	});

	console.log(master.getParsedAddresses().length);

	srv.on("gotInfo", function() {
		console.log("some info");
	});
	srv.sendRequests();


	res.render("index");
});



router.get("/econ", function(req, res) {
	res.render("econ");
});


router.post("/econ_login_action", function(req, res) {
	var econClient = econ.createClient();
	econClient.connect(req.body.econPort, req.body.econHost, req.body.econPassword);

	econClient.on("data", function() {  });

	res.redirect("back");
});

module.exports = router;
