class KnockoutSinglePageRouter
	constructor: (routes) ->
		@routes = routes.map (route) ->
			throw 'Invalid route' unless route
			throw 'Route has no name' unless route.name
			throw 'Route has an invalid URL' unless route.url

			paramRegex = /:([a-z][a-z0-9]+)/ig
			url = (if route.url[0] == '/' then route.url else '/' + route.url).trim()
			regex = '^' + (url.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\/?$'
			parameters = route.url.match(paramRegex)
			name = route.name.trim()

			throw 'Invalid route' unless route
			throw 'Route has no name' unless name
			throw 'Route has an invalid URL' unless url

			ko.components.register route.name, route.component if route.component

			component: name
			parameters: if parameters then parameters.map((item) -> item[1 ..]) else []
			regex: new RegExp regex, 'i'
