define(['knockout'], function(ko) {
	return function () {
		var self = this;
		
		self.input = ko.observable(null);
		self.valid = ko.computed(function () { return self.input() != null && self.input() > 0; });
		self.onClick = function () { console.log('Element was clicked.'); };
	};
});
