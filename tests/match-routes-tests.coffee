describe 'Router matching url to route', () ->
	router = null

	beforeAll () ->
		router = new Router ko, [
			{
				name: 'default'
				url: '/'
			}
			{
				name: 'single'
				url: '/foo'
			}
			{
				name: 'multi'
				url: '/foo/bar'
			}
			{
				name: 'parameter'
				url: '/foo/:id'
			}
			{
				name: 'multiparameters'
				url: '/foo/:foo/bar/:bar'
			}
		]

	# Route Matching

	## Default

	it 'matches the default route', () ->
		route = router.get '/'
		expect(route.component).toBe('default')

	it 'matches the default route with a query string', () ->
		route = router.get '/?foo=bar'
		expect(route.component).toBe('default')

	it 'matches the default route with a hash', () ->
		route = router.get '/#hash'
		expect(route.component).toBe('default')

	it 'matches the default route with a hash and a query string', () ->
		route = router.get '/#hash?foo=bar'
		expect(route.component).toBe('default')

	## Single component

	it 'matches a single component route', () ->
		route = router.get '/foo'
		expect(route.component).toBe('single')

	it 'matches a single component route with a query string', () ->
		route = router.get '/foo?foo=bar'
		expect(route.component).toBe('single')

	it 'matches a single component route with a hash', () ->
		route = router.get '/foo#hash'
		expect(route.component).toBe('single')

	it 'matches a single component route with a hash and a query string', () ->
		route = router.get '/foo#hash?foo=bar'
		expect(route.component).toBe('single')

	## Multiple components

	it 'matches a multi component route', () ->
		route = router.get '/foo/bar'
		expect(route.component).toBe('multi')

	it 'matches a multi component route with a query string', () ->
		route = router.get '/foo/bar?foo=bar'
		expect(route.component).toBe('multi')

	it 'matches a multi component matches the default route with a hash', () ->
		route = router.get '/foo/bar#hash'
		expect(route.component).toBe('multi')

	it 'matches a multi component matches the default route with a hash and a query string', () ->
		route = router.get '/foo/bar#hash?foo=bar'
		expect(route.component).toBe('multi')

	## Single parameter

	it 'matches a route with a parameter', () ->
		route = router.get '/foo/123'

		expect(route.component).toBe('parameter')
		expect(route.parameters.id).toBe('123')

	it 'matches a route with a parameter and a query string', () ->
		route = router.get '/foo/123?foo=bar'

		expect(route.component).toBe('parameter')
		expect(route.parameters.id).toBe('123')

	it 'matches a route with a parameter and a hash', () ->
		route = router.get '/foo/123#hash'

		expect(route.component).toBe('parameter')
		expect(route.parameters.id).toBe('123')

	it 'matches a route with a parameter and a hash and a query string', () ->
		route = router.get '/foo/123#hash?foo=bar'

		expect(route.component).toBe('parameter')
		expect(route.parameters.id).toBe('123')

	## Multiple parameters

	it 'matches a route with multiple parameters', () ->
		route = router.get '/foo/123/bar/abc'

		expect(route.component).toBe('multiparameters')
		expect(route.parameters.foo).toBe('123')
		expect(route.parameters.bar).toBe('abc')

	it 'matches a route with multiple parameters and a query string', () ->
		route = router.get '/foo/123/bar/abc?foo=bar'

		expect(route.component).toBe('multiparameters')
		expect(route.parameters.foo).toBe('123')
		expect(route.parameters.bar).toBe('abc')

	it 'matches a route with multiple parameters and a hash', () ->
		route = router.get '/foo/123/bar/abc#hash'

		expect(route.component).toBe('multiparameters')
		expect(route.parameters.foo).toBe('123')
		expect(route.parameters.bar).toBe('abc')

	it 'matches a route with a parameter and a hash and a query string', () ->
		route = router.get '/foo/123/bar/abc#hash?foo=bar'

		expect(route.component).toBe('multiparameters')
		expect(route.parameters.foo).toBe('123')
		expect(route.parameters.bar).toBe('abc')

	## Unknown route

	it 'sets current to null if unable to match a route', () ->
		route = router.get '/unknown'
		expect(route).toBe(null)
