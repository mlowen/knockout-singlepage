requirejs.config
	baseUrl: '/'
	paths:
		'text': '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text'
		'knockout': '//cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min'
		'knockout.singlepage': '/scripts/knockout-singlepage-debug'
	urlArgs: 'bust=' + (new Date()).getTime()

require [
		'knockout'
		'/scripts/routes.js'
		'knockout.singlepage'
	], (ko, routes) ->
		ko.singlePage.init routes, document.getElementById('app')
