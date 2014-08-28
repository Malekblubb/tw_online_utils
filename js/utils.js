var utils = {
	addressToString : function(address) {
		return address.address + ":" + address.port;
	},
	
	timeMs : function() {
		if(Date.now) return Date.now();
		return new Date().getTime();
	}
}

module.exports = utils;
