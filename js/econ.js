var net = require("net");
var events = require("events");

function EconClient() {
	var tcp = new net.Socket();
	tcp.on("data", function(data){ parseData(data); })

	var pass;
	var eventEmitter = new events.EventEmitter();

	this.on = function(str, callback) {
		eventEmitter.on(str, callback);
	}

	this.connect = function(port, host, password) {
		tcp.connect(port, host, function(){
			console.log("Successfully connected to host");
		});
		pass = password;
	}


	function parseData(data) {
		eventEmitter.emit("data");
		console.log("Data arrived: " + data);
		if(data == "Enter password:\012\0\0")
			writeAsTelnet(pass);

	}

	function writeAsTelnet(data) {
		tcp.write(data + "\012\0\0", function() { console.log("Written"); });
	}
}


EconClient.createClient = function() {
	return new EconClient();
}


module.exports = EconClient;
