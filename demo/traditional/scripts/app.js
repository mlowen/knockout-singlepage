$(function () {
	var routes = [
		{
			name: 'default',
			url: '/',
			component: {
				viewModel: DefaultViewModel,
				template: 
					'<p>This is the default template, choose the positive number to be added to the route for the next page</p>' +
					'<div class="row">' +
						'<div class="col-md-10">' +
							'<input class="form-control" type="number" data-bind="value: input, valueUpdate: \'afterkeydown\'" />' +
						'</div>' +
						'<div class="col-md-2">' +
							'<a class="btn btn-primary btn-block pull-right" data-bind="href: { route: \'second\', params: { id: input } }, visible: valid">Go to next page</a>' +
						'</div>' +
					'</div>' +
					'<ul>' +
						'<li><a href="/random">Go to non-existant route</a></li>' +
						'<li><a href="#" data-bind="click: onClick">This should print to the console</a></li>' +
						'<li><a href="/new-url" data-route="url-only">Link which only updates the URL</a></li>' +
						'<li><a href="/ignored-url" data-route="none">Link which is ignored by the framework</a></li>' +
					'</ul>'
			}
		}, 
		{
			name: 'second',
			url: '/second/:id',
			component: {
				viewModel: SecondViewModel,
				template: 
					'Second template, id from url: <strong data-bind="text: id"></strong>' + 
					'<a class="btn btn-default pull-right" data-bind="href: \'default\'">Back to default</a>'
			}
		}
	];
	
	ko.singlePage.init(routes, document.getElementById('app'));
	ko.singlePage.subscribe.routeChanged(function(e) {
		console.log('Route has changed.');
		console.log(e);
	});
});
