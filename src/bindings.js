var hrefBindingHandler = function (element, valueAccessor) {
	var value = ko.unwrap(valueAccessor());
	var url = '';
	
	if (typeof value == 'object')
		url = ko.singlePage.formatURL(value.route, value.params);
	else
		url = ko.singlePage.formatURL(value);
	
	if (url)
		element.setAttribute('href', url);
	else
		element.removeAttribute('href');
};

ko.bindingHandlers.href = { init: hrefBindingHandler, update: hrefBindingHandler };