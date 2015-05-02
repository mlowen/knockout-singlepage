class KnockoutSinglePageRouter
	constructor: (routes) ->
		@routes = routes.map (route) ->
			paramRegex = /:([a-z][a-z0-9]+)/ig

			ko.components.register route.name, route.component if route.component

			url = if route.url[0] == '/' then route.url[1..] else route.url
			regex = '^\\/?' + (url.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\/?(\\?.*)?$'
			parameters = route.url.match(paramRegex)

			component: route.name
			parameters: if parameters then parameters.map((item) -> item[1 ..]) else []
			regex: new RegExp regex, 'i'
