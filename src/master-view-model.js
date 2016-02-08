var MasterViewModel = function () {
	var self = this;
	
	self.notFoundComponent = 'ko-singlepage-not-found';
	self.component = ko.observable(null);
	self.parameters = ko.observable(null);
	self.hash = ko.observable(null);
	self.query = ko.observable(null);
	
	self.update = function (route, queryData) {
		if (route) {
			self.hash(queryData.hash);
			self.query(queryData.query);
			self.parameters(route.parameters);
			self.component(route.component);
		} else {
			self.component(self.notFoundComponent);
			self.parameters(null);
			self.hash(null);
			self.query(null);
		}
	};
};