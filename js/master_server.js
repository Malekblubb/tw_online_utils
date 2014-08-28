var dgram = require("dgram");


function TwMasterServer() {
	var socket = dgram.createSocket("udp4");
	socket.bind(0, function() {
		console.log("Bound socket at: " + socket.address().address + ":" + socket.address().port);
	});
	socket.on("message", function(msg, rinfo){parseData(msg, rinfo);});
	socket.on("error", function(err){console.log("An error occurred: " + err);});

	var requestBuffer = new Buffer([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0, 0, 0, 0]);
	new Buffer("req2").copy(requestBuffer, requestBuffer.length - 4);
	var replyBuffer = new Buffer([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0, 0, 0, 0]);
	new Buffer("lis2").copy(replyBuffer, replyBuffer.length - 4);
	var ip4Spacer = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff]);

	var masters = new Array();
	var parsedAddresses = new Array();

	this.getParsedAddresses = function() {
		return parsedAddresses;
	}

	this.addMaster = function(address) {
		masters.push(address);
	}

	this.sendRequests = function() {
		masters.forEach(function(address) {
				socket.send(requestBuffer, 0, requestBuffer.length, address.port, address.address, function(err, bytes) {
			});
		});
	}

	function parseData(msg, rinfo) {
		if(msg.length <= 14) return;
		if(msg.slice(0, 14).toString() != replyBuffer.toString()) return;

		msg = msg.slice(14, msg.length);
		for(var i = 0; i < msg.length; i += 18) {
			if(msg.slice(i, i+12).toString() != ip4Spacer.toString())
				continue; // don't parse ip6 addresses

			// create a address string from binary address
			var binAddressBuffer = msg.slice(i + 12, i + 16);
			var asInt = binAddressBuffer.readInt32LE(0);
			var dot0 = asInt & 255;
			var dot1 = ((asInt >> 8) & 255);
			var dot2 = ((asInt >> 16) & 255);
			var dot3 = ((asInt >> 24) & 255);

			parsedAddresses.push({
				address: dot0 + "." + dot1 + "." + dot2 + "." + dot3, // address
				port: (msg[i + 16] * 0xff + msg[i + 16]) + msg[i + 17] // port
			});
		}
	}
}


TwMasterServer.createMasterListener = function() {
	return new TwMasterServer();
}


module.exports = TwMasterServer;
