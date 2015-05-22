class Router
	errors:
		invalidRoute: 'Invalid route'
		duplicateRoute: 'Route clashes with existing route'

	constructor: (routes) ->
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

	get: (url) ->
		match = (@routes.filter (r) -> r.matches url)[0]
		route = null

		if match
			route =
				component: match.component
				parameters: match.extractParameters url

		route
