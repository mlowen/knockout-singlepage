describe 'Knockout single page router route loading', () ->
	it 'loads a single index route', () ->
		router = new KnockoutSinglePageRouter [
			{
				name: 'default'
				url: '/'
			}
		]

		expect(router.routes.length).toBe(1)

		route = router.routes[0]

		expect(route.component).toBe('default')
		expect(route.regex.toString()).toBe((/^\/\/?(\?.*)?(#.*)?$/i).toString())

	it 'loads a single route with a single path component', () ->
		router = new KnockoutSinglePageRouter [
			{
				name: 'default'
				url: '/foo'
			}
		]

		expect(router.routes.length).toBe(1)

		route = router.routes[0]

		expect(route.component).toBe('default')
		expect(route.regex.toString()).toBe((/^\/foo\/?(\?.*)?(#.*)?$/i).toString())

	it 'loads a single route with a multiple path components', () ->
		router = new KnockoutSinglePageRouter [
			{
				name: 'default'
				url: '/foo/bar'
			}
		]

		expect(router.routes.length).toBe(1)

		route = router.routes[0]

		expect(route.component).toBe('default')
		expect(route.regex.toString()).toBe((/^\/foo\/bar\/?(\?.*)?(#.*)?$/i).toString())

	it 'loads multiple routes', () ->
		router = new KnockoutSinglePageRouter [
			{
				name: 'first'
				url: '/'
			}
			{
				name: 'second'
				url: '/foo'
			}
		]

		expect(router.routes.length).toBe(2)

	it 'extracts a parameter from a route', () ->
		router = new KnockoutSinglePageRouter [
			{
				name: 'default'
				url: '/foo/:id'
			}
		]

		route = router.routes[0]

		expect(route.parameters.length).toBe(1)
		expect('id' in route.parameters).toBe(true)

	it 'extracts multiple parameters from a route', () ->
		router = new KnockoutSinglePageRouter [
			{
				name: 'default'
				url: '/foo/:id/:bar'
			}
		]

		route = router.routes[0]

		expect(route.parameters.length).toBe(2)
		expect('id' in route.parameters).toBe(true)
		expect('bar' in route.parameters).toBe(true)

	it 'registers a component if it supplied one', () ->
		expect(ko.components.isRegistered 'default').toBe(false)

		router = new KnockoutSinglePageRouter [
			{
				name: 'default'
				url: '/'
				component:
					template: 'Hello'
					viewModel: {}
			}
		]

		expect(ko.components.isRegistered 'default').toBe(true)

	it 'throws an error when the array contains a null route', () ->
		expect(() -> new KnockoutSinglePageRouter [
			null
		]).toThrow('Invalid route')

	it 'throws an error when trying to add a route with null name', () ->
		expect(() -> new KnockoutSinglePageRouter [
			{
				url: '/'
			}
		]).toThrow('Route has no name')

	it 'throws an error when trying to add a route with empty name', () ->
		expect(() -> new KnockoutSinglePageRouter [
			{
				name: ''
				url: '/'
			}
		]).toThrow('Route has no name')

	it 'throws an error when trying to add a route with null name', () ->
		expect(() -> new KnockoutSinglePageRouter [
			{
				name: null
				url: '/'
			}
		]).toThrow('Route has no name')

	it 'throws an error when the url is null', () ->
		expect(() -> new KnockoutSinglePageRouter [
			{
				name: 'default'
				url: null
			}
		]).toThrow('Route has an invalid URL')

	it 'throws an error when the url is undefined', () ->
		expect(() -> new KnockoutSinglePageRouter [
			{
				name: 'default'
			}
		]).toThrow('Route has an invalid URL')

	it 'throws an error when the url is an empty string', () ->
		expect(() -> new KnockoutSinglePageRouter [
			{
				name: 'default'
				url: ''
			}
		]).toThrow('Route has an invalid URL')

	it 'throws an error when trying to add multiple routes with the same name', () ->
		expect(() -> new KnockoutSinglePageRouter [
			{
				name: 'default'
				url: '/'
			}
			{
				name: 'default'
				url: '/foo'
			}
		]).toThrow('Multiple routes added with the same name')

	it 'throws an error when trying to add multiple routes with the same URL pattern', () ->
		expect(() -> new KnockoutSinglePageRouter [
			{
				name: 'first'
				url: '/'
			}
			{
				name: 'second'
				url: '/'
			}
		]).toThrow('Multiple routes added with the same URL')
