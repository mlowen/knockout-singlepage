define(function() {
	return [
		{
			name: 'default',
			url: '/',
			component: {
				viewModel: { require: '/scripts/view-models/default-view-model.js' },
				template: { require: 'text!/templates/default.html' }
			}
		}, 
		{
			name: 'second',
			url: '/second/:id',
			component: {
				viewModel: { require: '/scripts/view-models/second-view-model.js' },
				template: { require: 'text!/templates/second.html' }
			}
		}
	];
});
