var Router = function (initial) {
	var self = this;
	var routes = [];
	var exceptions = {
		existingRoute: 'Route clashes with existing route'
	};
	
	self.routes = function () {
		return routes.map(function (route) {
			return route.name;
		});
	};
	
	self.add = function (route) {
		if (Array.isArray(route)) {
			route.forEach(function (r) { self.add(r); });
		} else {
			var newRoute = new Route(route);
			var clash = routes.reduce(function (previous, r) {
				return previous || r.equals(newRoute);
			}, false);
			
			if (clash)
				throw exceptions.existingRoute;
			
			routes.push(newRoute);
		}
	};
	
	self.match = function (url) {
		var route = null;
		var match = routes.filter(function (route) {
			return route.matches(url);
		})[0];
		
		if (match)
			route = {
				name: match.name,
				component: match.component,
				parameters: match.parameters(url)
			}
		
		return route;
	};
	
	self.get = function(name) {
		var route = routes.filter(function (route) {
			return route.name == name;
		})[0];
		
		return route ? route : null;
	};
	
	/* Constructor */
	if (initial)
		self.add(initial);
};