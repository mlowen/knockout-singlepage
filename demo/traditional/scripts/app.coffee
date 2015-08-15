$ () ->
	routes = [
		{
			name: 'default'
			url: '/'
			component:
				viewModel: DefaultViewModel
				template: '
					<p>This is the default template, choose the positive number to be added to the route for the next page</p>
					<div class="row">
						<div class="col-md-10">
							<input class="form-control" type="number" data-bind="value: input, valueUpdate: \'afterkeydown\'" />
						</div>
						<div class="col-md-2">
							<a href="/second/1" class="btn btn-primary btn-block pull-right" data-bind="attr: { href: \'/second/\' + input() }, visible: valid">Go to next page</a>
						</div>
					</div>
					<a href="/random">Go to non-existant route</a>
				'
		}
		{
			name: 'second'
			url: '/second/:id'
			component:
				viewModel: SecondViewModel
				template: '
					Second template, id from url: <strong data-bind="text: id"></strong>
					<a href="/" class="btn btn-default pull-right">Back to default</a>
				'
		}
	]

	ko.singlePage.init routes, document.getElementById('app')
