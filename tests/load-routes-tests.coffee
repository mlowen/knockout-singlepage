describe 'Router loading routes', () ->
	it 'loads a single index route', () ->
		router = new Router ko, [
			{
				name: 'default'
				url: '/'
			}
		]

		expect(router.routes.length).toBe(1)

		route = router.routes[0]

		expect(route.component).toBe('default')
		expect(route.regex.toString()).toBe((/^\/\/?(#.*)?(\?.*)?$/i).toString())

	it 'loads a single route with a single path component', () ->
		router = new Router ko, [
			{
				name: 'default'
				url: '/foo'
			}
		]

		expect(router.routes.length).toBe(1)

		route = router.routes[0]

		expect(route.component).toBe('default')
		expect(route.regex.toString()).toBe((/^\/foo\/?(#.*)?(\?.*)?$/i).toString())

	it 'loads a single route with a multiple path components', () ->
		router = new Router ko, [
			{
				name: 'default'
				url: '/foo/bar'
			}
		]

		expect(router.routes.length).toBe(1)

		route = router.routes[0]

		expect(route.component).toBe('default')
		expect(route.regex.toString()).toBe((/^\/foo\/bar\/?(#.*)?(\?.*)?$/i).toString())

	it 'loads multiple routes', () ->
		router = new Router ko, [
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
		router = new Router ko, [
			{
				name: 'default'
				url: '/foo/:id'
			}
		]

		route = router.routes[0]

		expect(route.regex.toString()).toBe((/^\/foo\/([a-z0-9]+)\/?(#.*)?(\?.*)?$/i).toString())
		expect(route.parameters.length).toBe(1)
		expect('id' in route.parameters).toBe(true)

	it 'extracts multiple parameters from a route', () ->
		router = new Router ko, [
			{
				name: 'default'
				url: '/foo/:id/bar/:bar'
			}
		]

		route = router.routes[0]

		expect(route.regex.toString()).toBe((/^\/foo\/([a-z0-9]+)\/bar\/([a-z0-9]+)\/?(#.*)?(\?.*)?$/i).toString())
		expect(route.parameters.length).toBe(2)
		expect('id' in route.parameters).toBe(true)
		expect('bar' in route.parameters).toBe(true)

	it 'registers a component if it supplied one', () ->
		expect(ko.components.isRegistered 'default').toBe(false)

		router = new Router ko, [
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
		expect(() -> new Router ko, [
			null
		]).toThrow('Invalid route')

	it 'throws an error when trying to add a route with null name', () ->
		expect(() -> new Router ko, [
			{
				url: '/'
			}
		]).toThrow('Route has no name')

	it 'throws an error when trying to add a route with empty name', () ->
		expect(() -> new Router ko, [
			{
				name: ''
				url: '/'
			}
		]).toThrow('Route has no name')

	it 'throws an error when trying to add a route with null name', () ->
		expect(() -> new Router ko, [
			{
				name: null
				url: '/'
			}
		]).toThrow('Route has no name')

	it 'throws an error when the url is null', () ->
		expect(() -> new Router ko, [
			{
				name: 'default'
				url: null
			}
		]).toThrow('Route has an invalid URL')

	it 'throws an error when the url is undefined', () ->
		expect(() -> new Router ko, [
			{
				name: 'default'
			}
		]).toThrow('Route has an invalid URL')

	it 'throws an error when the url is an empty string', () ->
		expect(() -> new Router ko, [
			{
				name: 'default'
				url: ''
			}
		]).toThrow('Route has an invalid URL')

	it 'throws an error when trying to add multiple routes with the same name', () ->
		expect(() -> new Router ko, [
			{
				name: 'default'
				url: '/'
			}
			{
				name: 'default'
				url: '/foo'
			}
		]).toThrow('Route clashes with existing route')

	it 'throws an error when trying to add multiple routes with the same URL pattern', () ->
		expect(() -> new Router ko, [
			{
				name: 'first'
				url: '/'
			}
			{
				name: 'second'
				url: '/'
			}
		]).toThrow('Route clashes with existing route')
