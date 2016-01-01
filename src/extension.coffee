initialise = (ko) ->
	class KnockoutSinglePageExtension
		constructor: () ->
			@router = null
			@baseUrl = location.protocol + '//' + location.host
			@notFoundComponent = 'ko-singlepage-notfound'
			@viewModel =
				component: ko.observable null
				parameters: ko.observable null
				hash: ko.observable null
				query: ko.observable null
			@events =
				routeChanged: 'ko-sp-route-changed'

		init: (routes, element) ->
			throw 'Router has already been initialised' if @router

			params = routes

			if Array.isArray routes
				params =
					routes: routes
					element: element

			# Register default 404 component
			ko.components.register @notFoundComponent, template: 'This page does not exist'

			@router = new Router ko, params.routes

			@element = if params.element? then params.element else document.body
			@element.dataset.bind = 'component: { name: component(), params: { params: parameters(), hash: hash(), query: query() } }'

			document.body.addEventListener 'click', (e) =>
				if e.target.tagName.toLowerCase() == 'a'
					# This feels hacky but it works, as best as I can tell there
					# is no way to programmatically determine if there is a
					# particular knockout binding on an element.
					hasClickBinding = e.target.dataset.bind.split(',').reduce((
						(initial, current) ->
							(current.split(':')[0].trim().toLowerCase() is 'click') or initial
					), false) if e.target.dataset.bind

					isLeftButton = (e.which || evt.button) == 1
					isBaseUrl = e.target.href[... @baseUrl.length] is @baseUrl

					if isLeftButton and isBaseUrl and not hasClickBinding
						url = { href: e.target.href[@baseUrl.length ...] }
						url.route = e.target.dataset.route.toLowerCase() if e.target.dataset.route?

						if url.route isnt 'none'
							@go url

							e.stopPropagation()
							e.preventDefault()
			, false

			window.onpopstate = (e) => @go location.href[@baseUrl.length ...]

			# Attach any event handlers
			if params.on?
				@onRouteChanged params.on.routeChanged if params.on.routeChanged?

			@go location.href[@baseUrl.length ...]

			ko.applyBindings @viewModel

		go: (url) ->
			throw 'Router has not been initialised' unless @router

			url = { href: url } unless typeof url is 'object'

			if url.route isnt 'url-only'
				route = @router.get url.href

				if route
					queryData = urlQueryParser url.href

					@viewModel.hash queryData.hash
					@viewModel.query queryData.query
					@viewModel.parameters route.parameters
					@viewModel.component route.component
				else
					@viewModel.hash null
					@viewModel.query null
					@viewModel.parameters null
					@viewModel.component @notFoundComponent

				@element.dispatchEvent new CustomEvent @events.routeChanged, {
					detail:
						url: url.href,
						component: @viewModel.component()
						context:
							hash: @viewModel.hash()
							query: @viewModel.query()
							parameters: @viewModel.parameters()
				}

			history.pushState null, null, url.href

		# Event Management

		on: (event, callback) -> @element.addEventListener event, callback
		onRouteChanged: (callback) -> @on @events.routeChanged, callback

		off: (event, callback) -> @element.removeEventListener event, callback
		offRouteChanged: (callback) -> @off @events.routeChanged, callback

	ko.singlePage = new KnockoutSinglePageExtension() unless ko.singlePage
