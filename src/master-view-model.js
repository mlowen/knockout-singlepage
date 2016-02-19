var MasterViewModel = function () {
	var self = this;
	
	self.notFoundComponent = 'ko-singlepage-not-found';
	self.component = ko.observable(null);
	self.parameters = ko.observable(null);
	self.hash = ko.observable(null);
	self.query = ko.observable(null);
	
	self.update = function (data) {
		self.hash(data.context.hash);
		self.query(data.context.query);
		self.parameters(data.context.parameters);
		
		if (data.component)
			self.component(data.component);
		else
			self.component(self.notFoundComponent);
	};
};