var EventManager = function (el) {
	var self = this;
	var element = el;
	var events = {
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
	
	var publish = function (event, data) { element.dispatchEvent(new CustomEvent(event, { detail: data })); };
	
	/* Public */
	
	self.subscribe = {
		routeChanged: function (callback) { subscribe(events.routeChanged, callback); },
		urlChanged: function (callback) { subscribe(events.urlChanged, callback); }
	};
	
	self.unsubscribe = {
		routeChanged: function (callback) { unsubscribe(events.routeChanged, callback); },
		urlChanged: function (callback) { unsubscribe(events.urlChanged, callback); }
	};
	
	self.publish = {
		routeChanged: function (data) { publish(events.routeChanged, data); },
		urlChanged: function (data) { publish(events.urlChanged, data); }
	};
};