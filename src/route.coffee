class Route
	errors:
		invalidRouteName: 'Route has no name'
		invalidRouteUrl: 'Route has an invalid URL'

	parameterRegex: /:([a-z][a-z0-9]+)/ig

	constructor: (data) ->
		throw errors.invalidRouteName unless data.name
		throw errors.invalidRouteUrl unless data.url

		name = r.name.trim()
		url = (if r.url[0] == '/' then r.url else '/' + r.url).trim()
		regex = '^' + (url.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\/?(#.*)?(\\?.*)?$'
		regex = regex.replace @parameterRegex, '([a-z0-9]+)'
		parameters = r.url.match @parameterRegex

		throw errors.invalidRouteName unless name
		throw errors.invalidRouteUrl unless url

		@component = name
		@parameters = if parameters then parameters.map((item) -> item[1 ..]) else []
		@regex = new RegExp regex, 'i'

	clashesWith: (route) ->
		route.component == @component or route.regex.toString() == @regex.toString()

	matches: (url) -> @regex.test url

	extractParameters: (url) ->
		params = {}

		if @parameters.length
			matches = url.match(route.regex)[1..]

			for index in [0..route.parameters.length - 1]
				params[route.parameters[index]] = matches[index]

		params
