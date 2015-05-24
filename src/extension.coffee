initialise = (ko) ->
	class KnockoutSinglePageExtension
		constructor: () ->
			@router = null
			@baseUrl = location.protocol + '//' + location.host
			@viewModel =
				component: ko.observable null
				parameters: ko.observable null
				hash: ko.observable null
				query: ko.observable null

		init: (routes, element) ->
			throw 'Router has already been initialised' if @router

			@router = new Router ko, routes
			@go location.pathname

			element = document.body unless element
			element.setAttribute 'data-bind', 'component: { name: component(), params: { params: parameters(), hash: hash(), query: query() } }'

			document.body.addEventListener 'click', (e) =>
				if e.target.tagName.toLowerCase() == 'a' && e.target.href[... @baseUrl.length] is @baseUrl
					@go e.target.href[@baseUrl.length ...]

					e.stopPropagation()
					e.preventDefault()
			, false

			ko.applyBindings @viewModel

		go: (url) ->
			throw 'Router has not been initialised' unless @router

			route = @router.get url

			if route
				history.pushState null, null, url
				queryData = urlQueryParser url

				@viewModel.hash queryData.hash
				@viewModel.query queryData.query
				@viewModel.parameters route.parameters
				@viewModel.component route.component

	ko.singlePage = new KnockoutSinglePageExtension() unless ko.singlePage
