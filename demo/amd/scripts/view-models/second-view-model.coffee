define [ 'knockout' ], (ko) ->
	class SecondViewModel
		constructor: (context) ->
			@id = context.params.id
