var EventManager = function (el) {
	var self = this;
	var element = el;
	var events = {
		routeAdded: 'ko-sp-route-added',
		routeChanged: 'ko-sp-route-changed',
		urlChanged: 'ko-sp-url-changed' 
	};
	
	/* Private */
	
	var subscribe = function (event, callback) { 
		if (Array.isArray(callback))
			callback.forEach(function (cb) { subscribe(event, cb); });
		else
			element.addEventListener(event, callback); 
	};
	
	var unsubscribe = function (event, callback) {
		if (Array.isArray(callback))
			callback.forEach(function (cb) { unsubscribe(event, cb); });
		else
			element.removeEventListener(event, callback);
	};
	
	var publish = function (event, data) { element.dispatchEvent(new CustomEvent(events.routeChanged, { detail: data })); };
	
	/* Public */
	
	self.subscribe = {
		routeAdded: function (callback) { subscribe(events.routeAdded, callback); },
		routeChanged: function (callback) { subscribe(events.routeChanged, callback); },
		urlChanged: function (callback) { subscribe(events.urlChanged, callback); }
	};
	
	self.unsubscribe = {
		routeAdded: function (callback) { unsubscribe(events.routeAdded, callback); },
		routeChanged: function (callback) { unsubscribe(events.routeChanged, callback); },
		urlChanged: function (callback) { unsubscribe(events.urlChanged, callback); }
	};
	
	self.publish = {
		routeAdded: function (data) { publish(events.routeAdded, data); },
		routeChanged: function (data) { publish(events.routeChanged, data); },
		urlChanged: function (data) { publish(events.urlChanged, data); }
	};
};