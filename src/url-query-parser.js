var urlQueryParser = function (url) {
	var data = {
		hash: null,
		query: { }
	};
	
	var hashStart = url.indexOf('#') + 1;
	var queryStart = url.indexOf('?');
	
	if (hashStart > 0) {
		if (queryStart > hashStart)
			data.hash = url.slice(hashStart, queryStart);
		else if (queryStart < 0)
			data.hash = url.slice(hashStart);
	}
	
	if (queryStart >= 0) {
		url.slice(queryStart + 1)
			.split('&')
			.forEach(function (item) {
				var assignPos = item.indexOf('=');
				var name = null, value = null;
				
				if (assignPos >= 0) {
					name = item.slice(0, assignPos);
					value = item.slice(assignPos + 1);
				} else {
					name = item;
				}
				
				if (data.query[name] && value) {
					if (Array.isArray(data.query[name]))
						data.query[name].push(value);
					else
						data.query[name] = [ data.query[name], value ];
				} else if (!data.query[name]) {
					data.query[name] = value;
				}
			});
	}
	
	return data;
};