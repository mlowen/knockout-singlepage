var Route = function (data) {
	var self = this;
	var exceptions = {
		data: 'Invalid route',
		name: 'Route has an invalid name',
		url: 'Route has an invalid URL'
	};
	
	var regex = {
		whitespace: /^\s+$/,
		url: /^(\s+)?((\/)|((\/((:[a-z](\w+))|(\w|-)+))+))(\s+)?$/i,
		parameters: /:([a-z][a-z0-9]+)/ig
	};
	
	// Util methods
	
	var url2Regex = function (url) {
		return new RegExp((
			'^' + url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\/?(#.*)?(\\?.*)?$'
		).replace(regex.parameters, '([a-z0-9]+)'), 'i');
	};
	
	/* Constructor */
	
	// Name
	
	if (!data || typeof data !== 'object')
		throw exceptions.data;
	
	if (!data.name || regex.whitespace.test(data.name))
		throw exceptions.name;
		
	self.name = data.name.trim();
	
	// URL
	
	if (!data.url || !regex.url.test(data.url))
		throw exceptions.url;
	
	self.url = data.url.trim();
	
	var urlRegex = url2Regex(self.url);
	var parameters = self.url.match(regex.parameters);
	
	parameters = parameters ? parameters.map(function (param) {
		return param.slice(1);
	}) : []
	
	// Component
	
	if (!data.component || regex.whitespace.test(data.component)) {
		self.component = self.name;
	} else if (typeof data.component === 'object') {
		ko.components.register(self.name, data.component);
		self.component = self.name;
	} else {
		self.component = data.component.trim();
	}
	
	/* Methods */
	
	self.equals = function (route) {
		return self.name == route.name
			|| self.url == route.url
			|| urlRegex.toString() == url2Regex(route.url).toString();
	};
	
	self.matches = function (url) { return urlRegex.test(url); };
	
	self.parameters = function (url) {
		var params = {};
		
		if (parameters.length) {
			url.match(urlRegex)
				.slice(1)
				.forEach(function (value, index) {
					var key = parameters[index];
					
					if (key)
						params[key] = value;
				});
		}
		
		return params;
	};
	
	self.format = function (params) {
		if (parameters.length > 0 && (!params || params.length == 0))
			return null;
		
		var url = self.url;
		
		parameters.forEach(function (param) {
			if (url == null)
				return;
			
			var value = ko.unwrap(params[param]); 
			
			url = value ? url.replace(':' + param, value) : null;
		});
		
		return url;
	};
};