var bufferUtils = {
	bufferSearch : function(search, buffer, start) {
		for(var i = start; i < buffer.length; ++i) {
			if(buffer[i] == search)
				return i;
		}
		return -1;
	}
}

module.exports = bufferUtils;
