class KnockoutSinglePageRouter
	constructor: (routes) ->
		@routes = routes.map (route) ->
			ko.components.register route.name, route.component if route.component

			url = if route.url[0] == '/' then route.url[1..] else route.url
			regex = '^\\/?' + (url.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\/?(\\?.*)?$'

			component: route.name
			regex: new RegExp regex, 'i'
