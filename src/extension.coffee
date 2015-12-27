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
			@go location.href[@baseUrl.length ...]

			element = document.body unless element
			element.dataset.bind = 'component: { name: component(), params: { params: parameters(), hash: hash(), query: query() } }'

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
						@go e.target.href[@baseUrl.length ...]

						e.stopPropagation()
						e.preventDefault()
			, false

			window.onpopstate = (e) => @go location.href[@baseUrl.length ...]

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
