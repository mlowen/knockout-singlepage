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

		init: (routes, element) ->
			throw 'Router has already been initialised' if @router

			# Register default 404 component
			ko.components.register @notFoundComponent, template: 'This page does not exist'

			@router = new Router ko, routes
			@go location.pathname

			element = document.body unless element
			element.setAttribute 'data-bind', 'component: { name: component(), params: { params: parameters(), hash: hash(), query: query() } }'

			document.body.addEventListener 'click', (e) =>

				if e.target.tagName.toLowerCase() == 'a'
					isLeftButton = (e.which || evt.button) == 1
					isBaseUrl = e.target.href[... @baseUrl.length] is @baseUrl

					if isLeftButton && isBaseUrl
						@go e.target.href[@baseUrl.length ...]

						e.stopPropagation()
						e.preventDefault()
			, false

			ko.applyBindings @viewModel

		go: (url) ->
			throw 'Router has not been initialised' unless @router

			route = @router.get url

			if route
				queryData = urlQueryParser url

				@viewModel.hash queryData.hash
				@viewModel.query queryData.query
				@viewModel.parameters route.parameters
				@viewModel.component route.component
			else
				@viewModel.hash null
				@viewModel.query null
				@viewModel.parameters null
				@viewModel.component @notFoundComponent

			history.pushState null, null, url

	ko.singlePage = new KnockoutSinglePageExtension() unless ko.singlePage
