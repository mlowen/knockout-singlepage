class KnockoutSinglePageRouter
	errorMessages:
		invalidRoute: 'Invalid route'
		invalidRouteName: 'Route has no name'
		invalidRouteUrl: 'Route has an invalid URL'
		routesWithDuplicateName: 'Multiple routes added with the same name'
		routesWithDuplicateUrl: 'Multiple routes added with the same URL'

	constructor: (routes) ->
		@routes = []

		for r in routes
			throw @errorMessages.invalidRoute unless r
			throw @errorMessages.invalidRouteName unless r.name
			throw @errorMessages.invalidRouteUrl unless r.url

			paramRegex = /:([a-z][a-z0-9]+)/ig
			url = (if r.url[0] == '/' then r.url else '/' + r.url).trim()
			regex = '^' + (url.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\/?$'
			parameters = r.url.match(paramRegex)
			name = r.name.trim()

			throw @errorMessages.invalidRouteName unless name
			throw @errorMessages.invalidRouteUrl unless url

			ko.components.register name, r.component if r.component

			route =
				component: name
				parameters: if parameters then parameters.map((item) -> item[1 ..]) else []
				regex: new RegExp regex, 'i'

			for existing in @routes
				throw @errorMessages.routesWithDuplicateName if existing.component == route.component
				throw @errorMessages.routesWithDuplicateUrl if existing.regex.toString() == route.regex.toString()

			@routes.push route
