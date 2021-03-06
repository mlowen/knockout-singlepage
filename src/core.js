var KnockoutSinglePage = function () {
	var self = this;
	var router = null;
	var eventManager = null;
	var baseUrl = location.protocol + '//' + location.host;
	var viewModel = new MasterViewModel();
	var exceptions = {
		alreadyInitialised: 'Knockout-SinglePage has already been initialised',
		notInitialised: 'Knockout-SinglePage has not been initialised',
		routeDoesntExist: 'No route exists with name: ',
		parameterIsNotFunction: 'Parameter is not a function'
	};

	var hooks = { route: [] };

	/* Private Methods */
	self.initialised = function () { return router != null; };

	var mustBeInitialised = function () {
		if (!self.initialised())
			throw exceptions.notInitialised;
	};

	var urlPath = function (url) {
		if (url)
			return url.slice(baseUrl.length);

		return urlPath(location.href);
	};

	var changeUrl = function (url) {
		console.log('Url changed')

		history.pushState(null, null, url);
		eventManager.publish.urlChanged({ url: url });
	};

	var getATag = function (e) {
		var element = null;

		if(e.path) {
			element = e.path.reduce(function (previous, current) {
				if (!previous && current.tagName && current.tagName.toLowerCase() == 'a')
					return current;

				return previous;
			}, null);
		} else {
			var current = e.target;

			while (current && current.tagName && current.tagName.toLowerCase() != 'a') {
				current = current.parentNode;
			}

			if (current.tagName)
				element = current;
		}

		return element;
	};

	/* Public Methods */

	self.init = function (routes, el) {
		if (self.initialised())
			throw exceptions.alreadyInitialised;

		var params = routes;

		if (Array.isArray(routes))
			params = { routes: routes, element: el };

		ko.components.register(viewModel.notFoundComponent, { template: 'This page does not exist' });

		params.element = params.element ? params.element : document.body;
		params.element.dataset.bind = 'component: { name: component(), params: { params: parameters(), hash: hash(), query: query() } }';

		eventManager = new EventManager(params.element);
		router = new Router(params.routes);

		document.body.addEventListener('click', function (e) {
			var element = getATag(e);

			if (!element)
				return;

			console.log(element);

			// This feels hacky but it works, as best as I can tell there
			// is no way to programmatically determine if there is a
			// particular knockout binding on an element.
			var hasClickBinding = false;

			if (element.dataset.bind) {
				hasClickBinding = element.dataset.bind.split(',').reduce(function (initial, current) {
					return initial || current.split(':')[0].trim().toLowerCase() == 'click';
				}, false);
			}

			var isLeftButton = (e.which || e.button) == 1;
			var isBaseUrl = element.href.slice(0, baseUrl.length) == baseUrl;

			if (isLeftButton && isBaseUrl && !hasClickBinding) {
				var url = { href: urlPath(element.href) };

				if (element.dataset.route)
					url.route = element.dataset.route.toLowerCase();

				if (url.route != 'none') {
					self.go(url, element);

					e.stopPropagation();
					e.preventDefault();
				}
			}
		}, false);

		window.onpopstate = function (e) { self.go(urlPath()); };

		// Attach any event handlers
		if (params.subscribe) {
			if (params.subscribe.routeChanged)
				self.subscribe.routeChanged(params.subscribe.routeChanged);

			if (params.subscribe.urlChanged)
				self.subscribe.routeChanged(params.subscribe.urlChanged);
		}

		if (params.hooks) {
			if (params.hooks.route)
				self.hooks.route(params.hooks.route);
		}

		self.go(urlPath());

		ko.applyBindings(viewModel, params.element);
	};

	self.go = function (url, element) {
		mustBeInitialised();

		if (typeof url == 'string')
			url = { href: url };

		if (url.route && url.route.toLowerCase() == 'url-only') {
			changeUrl(url.href);
		} else {
			var route = router.match(url.href);
			var queryData = urlQueryParser(url.href);
			var data = {
				url: url.href,
				name: route ? route.name : null,
				element: element,
				component: route ? route.component : null,
				context: {
					hash: queryData.hash,
					query: queryData.query,
					parameters: route ? route.parameters : null
				}
			};

			var performUpdate = !hooks.route.reduce(function (current, hook) {
				return current || hook(data);
			}, false);

			if (performUpdate) {
				viewModel.update(data);
				eventManager.publish.routeChanged(data);
				changeUrl(url.href);
			}
		}
	};

	self.url = function (name, params) {
		mustBeInitialised();

		var route = router.get(name);

		if (!route)
			throw exceptions.routeDoesntExist + name;

		return route.format(params);
	};

	self.subscribe = {
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
		routeChanged: function (callback) {
			mustBeInitialised();
			eventManager.unsubscribe.routeChanged(callback);
		},
		urlChanged: function (callback) {
			mustBeInitialised();
			eventManager.unsubscribe.urlChanged(callback);
		}
	};

	self.hooks = {
		route: function (fn) {
			if (Array.isArray(fn))
				fn.forEach(function (hook) { self.hooks.route(hook); });
			else if ('function' == typeof fn)
				hooks.route.push(fn)
			else
				throw 'Parameter is not function or array.';
		}
	}
};
