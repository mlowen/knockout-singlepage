initialise = (ko) ->
	class KnockoutSinglePageExtension
		constructor: () ->
			@router = null
			@baseUrl = location.protocol + '//' + location.host

		init: (element, routes) ->
			throw 'Router has already been initialised' if @router

			@router = new Router routes
			@router.go location.pathname

			element = document.body unless element
			element.setAttribute 'data-bind', 'component: current'

			document.body.addEventListener 'click', (e) =>
				e.stopPropagation()

				if e.target.tagName.toLowerCase() == 'a' && e.target.href[... @baseUrl.length] is @baseUrl
					@go e.target.href[@baseUrl.length ...]

					e.preventDefault()
			, false

			ko.applyBindings @router

		go: (url) ->
			throw 'Router has not been initialised' unless @router

			history.pushState null, null, url
			@router.go url

	ko.router = new KnockoutSinglePageExtension() unless ko.router
