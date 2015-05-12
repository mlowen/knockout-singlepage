describe 'Knockout single page router route matching', () ->
	router = null

	beforeAll () ->
		router = new KnockoutSinglePageRouter [
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

	beforeEach () -> router.current null

	# Route Matching

	## Default

	it 'matches the default route', () ->
		router.go '/'
		expect(router.current().component).toBe('default')

	it 'matches the default route with a query string', () ->
		router.go '/?foo=bar'
		expect(router.current().component).toBe('default')

	it 'matches the default route with a hash', () ->
		router.go '/#hash'
		expect(router.current().component).toBe('default')

	it 'matches the default route with a hash and a query string', () ->
		router.go '/#hash?foo=bar'
		expect(router.current().component).toBe('default')

	## Single component

	it 'matches a single component route', () ->
		router.go '/foo'
		expect(router.current().component).toBe('single')

	it 'matches a single component route with a query string', () ->
		router.go '/foo?foo=bar'
		expect(router.current().component).toBe('single')

	it 'matches a single component route with a hash', () ->
		router.go '/foo#hash'
		expect(router.current().component).toBe('single')

	it 'matches a single component route with a hash and a query string', () ->
		router.go '/foo#hash?foo=bar'
		expect(router.current().component).toBe('single')

	## Multiple components

	it 'matches a multi component route', () ->
		router.go '/foo/bar'
		expect(router.current().component).toBe('multi')

	it 'matches a multi component route with a query string', () ->
		router.go '/foo/bar?foo=bar'
		expect(router.current().component).toBe('multi')

	it 'matches a multi component matches the default route with a hash', () ->
		router.go '/foo/bar#hash'
		expect(router.current().component).toBe('multi')

	it 'matches a multi component matches the default route with a hash and a query string', () ->
		router.go '/foo/bar#hash?foo=bar'
		expect(router.current().component).toBe('multi')

	## Single parameter

	it 'matches a route with a parameter', () ->
		router.go '/foo/123'

		expect(router.current().component).toBe('parameter')
		expect(router.current().parameters.id).toBe('123')

	it 'matches a route with a parameter and a query string', () ->
		router.go '/foo/123?foo=bar'

		expect(router.current().component).toBe('parameter')
		expect(router.current().parameters.id).toBe('123')

	it 'matches a route with a parameter and a hash', () ->
		router.go '/foo/123#hash'

		expect(router.current().component).toBe('parameter')
		expect(router.current().parameters.id).toBe('123')

	it 'matches a route with a parameter and a hash and a query string', () ->
		router.go '/foo/123#hash?foo=bar'

		expect(router.current().component).toBe('parameter')
		expect(router.current().parameters.id).toBe('123')

	## Multiple parameters

	it 'matches a route with multiple parameters', () ->
		router.go '/foo/123/bar/abc'

		expect(router.current().component).toBe('multiparameters')
		expect(router.current().parameters.foo).toBe('123')
		expect(router.current().parameters.bar).toBe('abc')

	it 'matches a route with multiple parameters and a query string', () ->
		router.go '/foo/123/bar/abc?foo=bar'

		expect(router.current().component).toBe('multiparameters')
		expect(router.current().parameters.foo).toBe('123')
		expect(router.current().parameters.bar).toBe('abc')

	it 'matches a route with multiple parameters and a hash', () ->
		router.go '/foo/123/bar/abc#hash'

		expect(router.current().component).toBe('multiparameters')
		expect(router.current().parameters.foo).toBe('123')
		expect(router.current().parameters.bar).toBe('abc')

	it 'matches a route with a parameter and a hash and a query string', () ->
		router.go '/foo/123/bar/abc#hash?foo=bar'

		expect(router.current().component).toBe('multiparameters')
		expect(router.current().parameters.foo).toBe('123')
		expect(router.current().parameters.bar).toBe('abc')

	## Unknown route

	it 'sets current to null if unable to match a route', () ->
		router.go '/unknown'
		expect(router.current()).toBe(null)

	# Hash extraction

	it 'extracts the hash into a property of the current route', () ->
		router.go '/#hash'

		expect(router.current().hash).toBe('hash')

	it 'sets the hash property to be null when there is no hash in the URL', () ->
		router.go '/'

		expect(router.current().hash).toBe(null)

	# Query string extraction

	it 'extracts a query parameter into the query object of the current route', () ->
		router.go '/?foo=123'

		expect(router.current().query.foo).toBe('123')

	it 'extracts a query parameter into the query object of the current route and sets it to null if there is no value', () ->
		router.go '/?foo'

		expect(router.current().query.foo).toBe(null)

	it 'extracts a query parameter into the query object of the current route when there is also a hash', () ->
		router.go '/#hash?foo=123'

		expect(router.current().hash).toBe('hash')
		expect(router.current().query.foo).toBe('123')

	it 'extracts a query parameter into the query object of the current route when the parameter contains a hash', () ->
		router.go '/?foo=123#abc'

		expect(router.current().hash).toBe(null)
		expect(router.current().query.foo).toBe('123#abc')

	it 'extracts multiple query parameters into the query object of the current route', () ->
		router.go '/?foo=123&bar=abc'

		expect(router.current().query.foo).toBe('123')
		expect(router.current().query.bar).toBe('abc')

	it 'extracts multiple query parameters of the same name into an array on the query object of the current route', () ->
		router.go '/?foo=123&foo=abc'

		expect(router.current().query.foo.length).toBe(2)
		expect('123' in router.current().query.foo).toBe(true)
		expect('abc' in router.current().query.foo).toBe(true)

	it 'overwrites a query parameter when specified twice times but at least once without a value', () ->
		router.go '/?foo=123&foo'

		expect(router.current().query.foo).toBe('123')

	it 'does not add query parameter to array if it has been specified multiple times and at least once without a value.', () ->
		router.go '/?foo=123&foo=abc&foo'

		expect(router.current().query.foo.length).toBe(2)
		expect('123' in router.current().query.foo).toBe(true)
		expect('abc' in router.current().query.foo).toBe(true)
