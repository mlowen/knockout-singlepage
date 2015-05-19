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
			query = {}
			hash = null

			hashStart = url.indexOf('#') + 1
			queryStart = url.indexOf('?') + 1

			if hashStart > 0
				hash = url[hashStart ..] if queryStart < 1
				hash = url[hashStart .. (queryStart - 2)] if queryStart > hashStart

			if queryStart > 0
				queryStringParameters = url[queryStart ..].split '&'

				for parameter in queryStringParameters
					equalPosition = parameter.indexOf '='
					name = null
					value = null

					if equalPosition > 0
						[name, value] = parameter.split '='
					else
						name = parameter

					if query[name]
						if value
							if 'array' == typeof query[name]
								query[name].push value
							else
								query[name] = [query[name], value]
					else
						query[name] = value

			@current
				component: route.component
				parameters: route.extractParameters url
				hash: hash
				query: query
		else
			@current null
