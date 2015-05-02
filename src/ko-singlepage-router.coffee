class KnockoutSinglePageRouter
	errorMessages:
		invalidRoute: 'Invalid route'
		invalidRouteName: 'Route has no name'
		invalidRouteUrl: 'Route has an invalid URL'

	constructor: (routes) ->
		@routes = routes.map (route) =>
			throw @errorMessages.invalidRoute unless route
			throw @errorMessages.invalidRouteName unless route.name
			throw @errorMessages.invalidRouteUrl unless route.url

			paramRegex = /:([a-z][a-z0-9]+)/ig
			url = (if route.url[0] == '/' then route.url else '/' + route.url).trim()
			regex = '^' + (url.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\/?$'
			parameters = route.url.match(paramRegex)
			name = route.name.trim()

			throw @errorMessages.invalidRouteName unless name
			throw @errorMessages.invalidRouteUrl unless url

			ko.components.register route.name, route.component if route.component

			component: name
			parameters: if parameters then parameters.map((item) -> item[1 ..]) else []
			regex: new RegExp regex, 'i'
