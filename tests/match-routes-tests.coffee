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

	it 'matches the default route', () ->
		router.go '/'
		expect(router.current().component).toBe('default')

	it 'matches the default route with a query string', () ->
		router.go '/?foo=bar'
		expect(router.current().component).toBe('default')

	it 'matches the default route with a hash', () ->
			router.go '/#hash'
			expect(router.current().component).toBe('default')

	it 'matches a single component route', () -> expect(true).toBe(false)
	it 'matches a single component route with a query string', () -> expect(true).toBe(false)
	it 'matches a single component matches the default route with a hash', () -> expect(true).toBe(false)

	it 'matches a multi component route', () -> expect(true).toBe(false)
	it 'matches a multi component route with a query string', () -> expect(true).toBe(false)
	it 'matches a multi component matches the default route with a hash', () -> expect(true).toBe(false)

	it 'matches a route with a parameter', () -> expect(true).toBe(false)
	it 'matches a route with a parameter and a query string', () -> expect(true).toBe(false)
	it 'matches a route with a parameter and a hash', () -> expect(true).toBe(false)

	it 'matches a route with multiple parameters', () -> expect(true).toBe(false)
	it 'matches a route with multiple parameters and a query string', () -> expect(true).toBe(false)
	it 'matches a route with multiple parameters and a hash', () -> expect(true).toBe(false)

	it 'sets current to null if unable to match a route', () -> expect(true).toBe(false)
