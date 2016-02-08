describe('Route', function () {
	var exceptions = {
		data: 'Invalid route',
		name: 'Route has an invalid name',
		url: 'Route has an invalid URL'
	}
	
	/* Constructor tests */
	
	it('throws an exception when no object is passed to the constructor.', function () {
		expect(function () {
			new Route();
		}).toThrow(exceptions.data);
	});
	
	it('throws an exception when null is passed to the constructor.', function () {
		expect(function () {
			new Route(null);
		}).toThrow(exceptions.data);
	});
	
	it('throws an exception when what is passed to the constructor is not an object.', function () {
		expect(function () {
			new Route(1234);
		}).toThrow(exceptions.data);
	});
	
	// Name
	
	it('throws an exception when no name is supplied.', function () {
		expect(function () {
			new Route({ url: '/test/url' });
		}).toThrow(exceptions.name);
	});
	
	it('throws an exception when the name is null.', function () {
		expect(function () {
			new Route({ name: null, url: '/test/url' });
		}).toThrow(exceptions.name);
	});
	
	it('throws an exception when the name is an empty string.', function () {
		expect(function () {
			new Route({ name: '', url: '/test/url' });
		}).toThrow(exceptions.name);
	});
	
	it('throws an exception when the name is whitespace.', function () {
		expect(function () {
			new Route({ name: '   ', url: '/test/url' });
		}).toThrow(exceptions.name);
	});
	
	it('stores the name passed to the constructor in the name property.', function () {
		var r = new Route({ name: 'route-name', url: '/test/url' });
		
		expect(r.name).toBe('route-name');
	});
	
	it('trims the whitespace of the name passed to the constructor.', function () {
		var r = new Route({ name: '  route-name  ', url: '/test/url' });
		
		expect(r.name).toBe('route-name');
	});
	
	// URL
	
	it('throws an exception when no url is supplied.', function () {
		expect(function () {
			new Route({ name: 'route-name' });
		}).toThrow(exceptions.url);
	});
	
	it('throws an exception when the url is null.', function () {
		expect(function () {
			new Route({ name: 'route-name', url: null });
		}).toThrow(exceptions.url);
	});
	
	it('throws an exception when the url is an empty string.', function () {
		expect(function () {
			new Route({ name: 'route-name', url: '' });
		}).toThrow(exceptions.url);
	});
	
	it('throws an exception when the url is whitespace.', function () {
		expect(function () {
			new Route({ name: 'route-name', url: '   ' });
		}).toThrow(exceptions.url);
	});
	
	it('stores the url passed to the constructor in the url property.', function () {
		var r = new Route({ name: 'route-name', url: '/test/url' });
		
		expect(r.url).toBe('/test/url');
	});
	
	it('trims the whitespace of the url passed to the constructor.', function () {
		var r = new Route({ name: 'route-name', url: '  /test/url  ' });
		
		expect(r.url).toBe('/test/url');
	});
	
	it('throws an exception when the url does not begin with a /.', function () {
		expect(function () {
			new Route({ name: 'route-name', url: 'test/url' });
		}).toThrow(exceptions.url);
	});
	
	it('throws an exception when the url contains whitespace.', function () {
		expect(function () {
			new Route({ name: 'route-name', url: '/te st/url' });
		}).toThrow(exceptions.url);
	});
	
	it('throws an exception when a variable in the url has a number following the colon.', function () {
		expect(function () {
			new Route({ name: 'route-name', url: '/test/:2url' });
		}).toThrow(exceptions.url);
	});
	
	it('throws an exception when a variable in the url contains a -.', function () {
		expect(function () {
			new Route({ name: 'route-name', url: '/test/:u-rl' });
		}).toThrow(exceptions.url);
	});
	
	it('allows the url to be /', function () {
		var route = new Route({ name: 'default', url: '/' });
		
		expect(route.url).toBe('/');
	});
	
	it('allows a variable in the url contains a _.', function () {
		var url = '/test/:u_rl';
		var route = new Route({ name: 'route-name', url: url });
		
		expect(route.url).toBe(url);
	});
	
	it('allows a url to contain a - in a non-variable segment.', function () {
		expect(function () {
			new Route({ name: 'route-name', url: '/test/:u-rl' });
		}).toThrow(exceptions.url);
	});
	
	it('allows a url to contain a _ in a non-variable segment.', function () {
		var url = '/te_st/url';
		var route = new Route({ name: 'test-route', url: url });
		
		expect(route.url).toBe(url);
	});
	
	it('allows a url to contain a number in a non-variable segment.', function () {
		var url = '/te-st/url';
		var route = new Route({ name: 'test-route', url: url });
		
		expect(route.url).toBe(url);
	});
	
	it('allows a url to contain an alphanumeric segment which starts with a number.', function () {
		var url = '/test/2url';
		var route = new Route({ name: 'test-route', url: url });
		
		expect(route.url).toBe(url);
	});
	
	/* Equals */
	
	it('returns true from equals when the names match.', function () {
		var name = "test-route";
		
		var r1 = new Route({ name: name, url: '/route1' });
		var r2 = new Route({ name: name, url: '/route2' });
		
		expect(r1.equals(r2)).toBe(true);
	});
	
	it('returns true from equals when the URLs match.', function () {
		var url = "/test-route";
		
		var r1 = new Route({ name: 'route1', url: url });
		var r2 = new Route({ name: 'route2', url: url });
		
		expect(r1.equals(r2)).toBe(true);
	});
	
	it('returns true from equals when the URL patterns match.', function () {
		var r1 = new Route({ name: 'route1', url: '/route/:foo' });
		var r2 = new Route({ name: 'route2', url: '/route/:bar' });
		
		expect(r1.equals(r2)).toBe(true);
	});
	
	it('returns false from equals when name and URL do not match.', function () {
		var r1 = new Route({ name: 'route1', url: '/foo/:id' });
		var r2 = new Route({ name: 'route2', url: '/bar/:id' });
		
		expect(r1.equals(r2)).toBe(false);
	});
	
	/* Matches */
	
	it('returns true from matches when the URL matches a route with no parameters.', function () {
		expect(new Route({
			name: 'route-name',
			url: '/foo/bar'
		}).matches('/foo/bar')).toBe(true);
	});
	
	it('returns true when the URL mathes a route with a parameter.', function () {
		expect(new Route({
			name: 'route-name',
			url: '/foo/:bar'
		}).matches('/foo/1')).toBe(true);
	});
	
	it('returns true when the URL mathes a route with multiple parameters.', function () {
		expect(new Route({
			name: 'route-name',
			url: '/foo/:id/bar/:tar'
		}).matches('/foo/1/bar/par')).toBe(true);
	});
	
	it('returns false when the URL partially mathes a route.', function () {
		expect(new Route({
			name: 'route-name',
			url: '/foo/bar'
		}).matches('/foo')).toBe(false);
	});
	
	it('returns false when a route only partially matches the URL.', function () {
		expect(new Route({
			name: 'route-name',
			url: '/foo/bar'
		}).matches('/foo/bar/tar')).toBe(false);
	});
	
	/* Parameters */
	
	it('returns an empty object from parameters when the route has no parameters.', function () {
		var route = new Route({
			name: 'test-route',
			url: '/foo/bar'
		});
		
		var parameters = route.parameters('/foo/bar');
		
		expect(typeof parameters).toBe('object');
		expect(Object.keys(parameters).length).toBe(0);
	});
	
	it('returns an object populated with a single field when the route has a single parameter.', function () {
		var route = new Route({
			name: 'test-route',
			url: '/foo/:id'
		});
		
		var parameters = route.parameters('/foo/bar');
		
		expect(typeof parameters).toBe('object');
		expect(Object.keys(parameters).length).toBe(1);
		expect(parameters.id).toBe('bar');
	});
	
	it('returns an object populated with a multiple field when the route has multiple parameters.', function () {
		var route = new Route({
			name: 'test-route',
			url: '/foo/:id/bar/:name'
		});
		
		var parameters = route.parameters('/foo/1/bar/test');
		
		expect(typeof parameters).toBe('object');
		expect(Object.keys(parameters).length).toBe(2);
		expect(parameters.id).toBe('1');
		expect(parameters.name).toBe('test');
	});
	
	/* Component */
	
	it('sets the component to be the name of the route if no component is supplied.', function () {
		var route = new Route({ name: 'route', url: '/foo/bar' });
		
		expect(route.component).toBe('route');
	});
	
	it('sets the component to be the name of the route if component is null.', function () {
		var route = new Route({ name: 'route', url: '/foo/bar', component: null });
		
		expect(route.component).toBe('route');
	});
	
	it('sets the component to be the name of the route if component is whitespace.', function () {
		var route = new Route({ name: 'route', url: '/foo/bar', component: '   ' });
		
		expect(route.component).toBe('route');
	});
	
	it('sets the component property to the value of the component passed into the constructor', function () {
		var route = new Route({ name: 'route', url: '/foo/bar', component: 'routecomponent' });
		
		expect(route.component).toBe('routecomponent');
	});
	
	it('sets the component property to the value trimmed of whitespace of the component passed into the constructor', function () {
		var route = new Route({ name: 'route', url: '/foo/bar', component: '  routecomponent  ' });
		
		expect(route.component).toBe('routecomponent');
	});
	
	it('registers a knockout component with the route name when an object is passed in the component argument.', function () {
		var name = 'route';
		var route = new Route({
			name: name,
			url: '/foo/bar',
			component: {
				template: 'Hello',
				viewModel: {}
			}
		});
		
		expect(route.component).toBe(name);
		expect(ko.components.isRegistered(name)).toBe(true);
	});
	
	it('returns the url from format when there are no parameters required.', function () {
		var route = new Route({ name: 'default', url: '/' });
		
		expect(route.format()).toBe('/');
	});
	
	it('ignores any parameters passed to format when none are needed.', function () {
		var route = new Route({ name: 'default', url: '/dashboard' });
		
		expect(route.format({ id: 1 })).toBe('/dashboard');
	});
	
	it('replaces a parameter in the url when format is called.', function () {
		var route = new Route({ name: 'default', url: '/item/:id' });
		
		expect(route.format({ id: 3 })).toBe('/item/3');
	});
	
	it('replaces multiple parameters in the url when format is called.', function () {
		var route = new Route({ name: 'default', url: '/parent/:parent/child/:child' });
		
		expect(route.format({ parent: 3, child: 'foo' })).toBe('/parent/3/child/foo');
	});
	
	it('throws an exception when no parameters are supplied to format when the route requires them.', function () {
		var route = new Route({ name: 'default', url: '/item/:id' });
		
		expect(function () {
			route.format();
		}).toThrow('No parameters supplied to format route');
	});
	
	it('throws an exception when an expected parameter is not present.', function () {
		var route = new Route({ name: 'default', url: '/parent/:parent/child/:child' });
		
		expect(function () { 
			route.format({ parent: 3 });
		}).toThrow('Unable to format route due to missing parameter: child');
	});
	
	it('unwraps a knockout object when formatting a URL.', function () {
		var route = new Route({ name: 'default', url: '/item/:id' });
		
		expect(route.format({ id: ko.observable(3) })).toBe('/item/3');
	});
});