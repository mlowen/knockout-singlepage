describe 'Knockout single page router route loading', () ->
	it 'Loads a single index route', () ->
		router = new KnockoutSinglePageRouter [
			{
				name: 'default'
				url: '/'
			}
		]

		expect(router.routes.length).toBe(1)

		route = router.routes[0]

		expect(route.component).toBe('default')
		expect(route.regex.toString()).toBe((/^\/?\/?(\?.*)?$/i).toString())

	it 'Loads a single route with a single path component', () ->
		router = new KnockoutSinglePageRouter [
			{
				name: 'default'
				url: '/foo'
			}
		]

		expect(router.routes.length).toBe(1)

		route = router.routes[0]

		expect(route.component).toBe('default')
		expect(route.regex.toString()).toBe((/^\/?foo\/?(\?.*)?$/i).toString())

	it 'Loads a single route with a multiple path components', () ->
		router = new KnockoutSinglePageRouter [
			{
				name: 'default'
				url: '/foo/bar'
			}
		]

		expect(router.routes.length).toBe(1)

		route = router.routes[0]

		expect(route.component).toBe('default')
		expect(route.regex.toString()).toBe((/^\/?foo\/bar\/?(\?.*)?$/i).toString())

	it 'Loads multiple routes', () ->
		router = new KnockoutSinglePageRouter [
			{
				name: 'default'
				url: '/'
			}
			{
				name: 'default'
				url: '/foo'
			}
		]

		expect(router.routes.length).toBe(2)

	it 'Extracts a parameter from a route', () -> expect(true).toBe(false)
	it 'Extracts multiple parameters from a route', () -> expect(true).toBe(false)
	it 'Registers a component if it supplied one', () -> expect(true).toBe(false)
	it 'Throws an error when trying to add a route with no name', () -> expect(true).toBe(false)
	it 'Throws an error when trying to add multiple routes with the same name', () -> expect(true).toBe(false)
	it 'Throws an error when trying to add multiple routes with the same url pattern', () -> expect(true).toBe(false)
