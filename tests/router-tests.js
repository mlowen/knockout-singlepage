describe('Router', function () {
	it('can add a single route.', function () {
		var router = new Router();
		
		expect(router.routes().length).toBe(0);
		
		router.add({ name: 'default', url: '/' });
		
		expect(router.routes().length).toBe(1);
	});
	
	it('can add multiple routes.', function () {
		var router = new Router();
		
		expect(router.routes().length).toBe(0);
		
		router.add([
			{ name: 'default', url: '/' },
			{ name: 'test-route', url: '/test-url' }
		]);
		
		expect(router.routes().length).toBe(2);
	});
	
	it('can be initialised with a route.', function () {
		var router = new Router({ name: 'default', url: '/' });
		
		expect(router.routes().length).toBe(1);
	});
	
	it('can be initialised with multiple routes.', function () {
		var router = new Router([
			{ name: 'default', url: '/' },
			{ name: 'test-route', url: '/test-url' }
		]);
		
		expect(router.routes().length).toBe(2);
	});
	
	it('throws an exception when adding a route which matches an existing route.', function () {
		var message = 'Route clashes with existing route'; 
		var router = new Router({
			name: 'default',
			url: '/route/:id'
		});
		
		expect(function () {
			router.add({ name: 'default', url: '/' });
		}).toThrow(message);
		
		expect(function () {
			router.add({ name: 'test', url: '/route/:id' });
		}).toThrow(message);
		
		expect(function () {
			router.add({ name: 'test', url: '/route/:foo' });
		}).toThrow(message);
	});
	
	it('returns a list of route names from the routes method.', function () {
		var router = new Router([
			{ name: 'default', url: '/' },
			{ name: 'test-route', url: '/test-url' }
		]);
		
		expect(router.routes()).toEqual([
			'default',
			'test-route'
		]);
	});
	
	it('returns the appropriate route when the default (/) url is passed to the match method.', function () {
		var router = new Router([
			{ name: 'default', url: '/' },
			{ name: 'test1', url: '/foo' },
			{ name: 'test2', url: '/foo/:id' }
		]);
		
		var match = router.match('/');
		
		expect(match.name).toBe('default');
	});
	
	it('returns the appropriate route when a url is passed to the match method.', function () {
		var router = new Router([
			{ name: 'default', url: '/' },
			{ name: 'test1', url: '/foo' },
			{ name: 'test2', url: '/foo/:id' }
		]);
		
		var match = router.match('/foo');
		
		expect(match.name).toBe('test1');
	});
	
	it('returns the appropriate route when a url is passed to the match method.', function () {
		var router = new Router([
			{ name: 'default', url: '/' },
			{ name: 'test1', url: '/foo' },
			{ name: 'test2', url: '/foo/:id' }
		]);
		
		var match = router.match('/foo/1');
		
		expect(match.name).toBe('test2');
		expect(match.parameters.id).toBe('1');
	});
	
	it('returns the appropriate route when a url is passed to the match method.', function () {
		var router = new Router([
			{ name: 'default', url: '/' },
			{ name: 'test1', url: '/foo' },
			{ name: 'test2', url: '/foo/:id' }
		]);
		
		expect(router.match('/bar')).toBe(null);
	});
	
	it('retrieves the appropriate route when given the route name.', function () {
		var router = new Router([
			{ name: 'default', url: '/' },
			{ name: 'test1', url: '/foo' },
			{ name: 'test2', url: '/foo/:id' }
		]);
		
		var route = router.get('test1');
		
		expect(route.name).toBe('test1');
		expect(route.url).toBe('/foo');
	});
	
	it('returns null when there is no route matching the given name.', function () {
		var router = new Router([
			{ name: 'default', url: '/' },
			{ name: 'test1', url: '/foo' },
			{ name: 'test2', url: '/foo/:id' }
		]);
		
		expect(router.get('non-existant-route')).toBe(null);
	});
});