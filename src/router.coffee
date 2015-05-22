class KnockoutSinglePageRouter
	errors:
		invalidRoute: 'Invalid route'
		duplicateRoute: 'Route clashes with existing route'

	constructor: (routes) ->
		@current = ko.observable null
		@routes = []

		@add routes if routes

	add: (route) ->
		if Array.isArray route
			@add r for r in route
		else
			throw @errors.invalidRoute unless route

			r = new Route route

			throw @errors.duplicateRoute if @routes.filter((i) -> r.clashesWith i).length
			ko.components.register r.component, route.component if route.component

			@routes.push r

	go: (url) ->
		route = (@routes.filter (r) -> r.matches url)[0]

		if route
			@current
				component: route.component
				parameters: route.extractParameters url
		else
			@current null
