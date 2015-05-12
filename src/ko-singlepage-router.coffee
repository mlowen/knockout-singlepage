class KnockoutSinglePageRouter
	errorMessages:
		invalidRoute: 'Invalid route'
		invalidRouteName: 'Route has no name'
		invalidRouteUrl: 'Route has an invalid URL'
		routesWithDuplicateName: 'Multiple routes added with the same name'
		routesWithDuplicateUrl: 'Multiple routes added with the same URL'

	constructor: (routes) ->
		@current = ko.observable null
		@routes = []

		for r in routes
			throw @errorMessages.invalidRoute unless r
			throw @errorMessages.invalidRouteName unless r.name
			throw @errorMessages.invalidRouteUrl unless r.url

			paramRegex = /:([a-z][a-z0-9]+)/ig
			url = (if r.url[0] == '/' then r.url else '/' + r.url).trim()
			regex = '^' + (url.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\/?(#.*)?(\\?.*)?$'
			regex = regex.replace paramRegex, '([a-z0-9]+)'
			parameters = r.url.match paramRegex
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

	go: (url) ->
		route = (@routes.filter (r) -> r.regex.test url)[0]

		if route
			params = {}
			query = {}
			hash = null

			if route.parameters.length
				matches = url.match(route.regex)[1..]

				for index in [0..route.parameters.length - 1]
					params[route.parameters[index]] = matches[index]

			hashStart = url.indexOf('#') + 1
			queryStart = url.indexOf('?') + 1

			if hashStart > 0
				hash = url[hashStart ..] if queryStart < 1
				hash = url[hashStart .. (queryStart - 2)] if queryStart > hashStart

			if queryStart > 0
				queryStringParameters = url[queryStart ..].split '&'

				for parameter in queryStringParameters
					equalPosition = parameter.indexOf '='

					if equalPosition > 0
						[name, value] = parameter.split '='

						query[name] = value
					else
						query[parameter] = null

			@current
				component: route.component
				parameters: params
				hash: hash
				query: query
		else
			@current null
