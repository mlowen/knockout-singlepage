var KnockoutSinglePage = function () {
	var self = this;
	var router = null;
	var eventManager = null;
	var baseUrl = location.protocol + '//' + location.host;
	var viewModel = new MasterViewModel();
	var exceptions = {
		alreadyInitialised: 'Knockout-SinglePage has already been initialised',
		notInitialised: 'Knockout-SinglePage has not been initialised',
	};

	/* Private Methods */
	var isInitialised = function () { return router != null; };
	
	var mustBeInitialised = function () {
		if (!isInitialised())
			throw exceptions.notInitialised;
	};
	
	var urlPath = function (url) {
		if (url) 
			return url.slice(baseUrl.length);
		
		return urlPath(location.href); 
	};

	/* Public Methods */

	self.init = function (routes, el) {
		if (isInitialised())
			throw exceptions.alreadyInitialised;

		var params = routes;

		if (Array.isArray(routes))
			params = { routes: routes, element: el };

		ko.components.register(viewModel.notFoundComponent, { template: 'This page does not exist' });

		params.element = params.element ? params.element : document.body;
		params.element.dataset.bind = 'component: { name: component(), params: { params: parameters(), hash: hash(), query: query() } }';

		eventManager = new EventManager(params.element);
		router = new Router(eventManager, params.routes);

		document.body.addEventListener('click', function (e) {
			if (e.target.tagName.toLowerCase() != 'a')
				return;
				
			// This feels hacky but it works, as best as I can tell there
			// is no way to programmatically determine if there is a
			// particular knockout binding on an element.
			var hasClickBinding = false;
			
			if (e.target.dataset.bind) {
				hasClickBinding = e.target.dataset.bind.split(',').reduce(function (initial, current) {
					return initial || current.split(':')[0].trim().toLowerCase() == 'click';
				}, false);
			}

			var isLeftButton = (e.which || e.button) == 1;
			var isBaseUrl = e.target.href.slice(0, baseUrl.length) == baseUrl;

			if (isLeftButton && isBaseUrl && !hasClickBinding) {
				var url = { href: urlPath(e.target.href) };
				
				if (e.target.dataset.route)
					url.route = e.target.dataset.route.toLowerCase();
					
				if (url.route != 'none') {
					self.go(url);
					
					e.stopPropagation();
					e.preventDefault();
				}
			}
		}, false);
		
		window.onpopstate = function (e) { self.go(urlPath()); };

		// Attach any event handlers
		if (params.subscribe) {
			if (params.subscribe.routeAdded)
				self.subscribe.routeAdded(params.subscribe.routeAdded);
			
			if (params.subscribe.routeChanged)
				self.subscribe.routeChanged(params.subscribe.routeChanged);
			
			if (params.subscribe.urlChanged)
				self.subscribe.routeChanged(params.subscribe.urlChanged);
		}

		self.go(urlPath());

		ko.applyBindings(viewModel, params.element);
	};
	
	self.go = function (url) {
		mustBeInitialised();
		
		if (typeof url == 'string')
			url = { href: url };

		if (url.route.toLowerCase() != 'url-only') {
			var route = router.match(url.href);

			if (route)
				viewModel.update(route, urlQueryParser(url.href));
			else
				viewModel.update();

			eventManager.publish.routeChanged({
				url: url.href,
				name: route.name,
				component: route.component,
				context: {
					hash: viewModel.hash(),
					query: viewModel.query(),
					parameters: viewModel.parameters()
				}
			});
		}

		history.pushState(null, null, url.href);
		eventManager.publish.urlChanged({ url: url.href });
	};
	
	self.subscribe = {
		routeAdded: function (callback) {
			mustBeInitialised();
			eventManager.subscribe.routeAdded(callback);
		},
		routeChanged: function (callback) {
			mustBeInitialised();
			eventManager.subscribe.routeChanged(callback); 
		},
		urlChanged: function (callback) {
			mustBeInitialised();
			eventManager.subscribe.urlChanged(callback);
		}
	};
	
	self.unsubscribe = {
		routeAdded: function (callback) {
			mustBeInitialised();
			eventManager.unsubscribe.routeAdded(callback);
		}, 
		routeChanged: function (callback) {
			mustBeInitialised();
			eventManager.unsubscribe.routeChanged(callback); 
		},
		urlChanged: function (callback) {
			mustBeInitialised();
			eventManager.unsubscribe.urlChanged(callback);
		}
	};
};