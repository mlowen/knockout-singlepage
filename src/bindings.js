var urlBindingHandler = function (element, valueAccessor) {
	if (element.tagName.toLowerCase() != 'a')
		return;

	var value = ko.unwrap(valueAccessor());
	var url = '';

	if (typeof value == 'object')
		url = ko.singlePage.url(value.route, value.params);
	else
		url = ko.singlePage.url(value);

	if (url)
		element.setAttribute('href', url);
	else
		element.removeAttribute('href');
};

ko.bindingHandlers.url = { init: urlBindingHandler, update: urlBindingHandler };
