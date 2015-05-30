class DefaultViewModel
	constructor: () ->
		@input = ko.observable null
		@valid = ko.computed () => @input() != null and @input() > 0
