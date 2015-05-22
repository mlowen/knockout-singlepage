urlQueryParser = (url) ->
	data =
		hash: null
		query: {}

	hashStart = url.indexOf('#') + 1
	queryStart = url.indexOf('?') + 1

	if hashStart > 0
		data.hash = url[hashStart ..] if queryStart < 1
		data.hash = url[hashStart .. (queryStart - 2)] if queryStart > hashStart

	if queryStart > 0
		queryStringParameters = url[queryStart ..].split '&'

		for parameter in queryStringParameters
			equalPosition = parameter.indexOf '='
			name = null
			value = null

			if equalPosition > 0
				[name, value] = parameter.split '='
			else
				name = parameter

			if data.query[name]
				if value
					if 'array' == typeof data.query[name]
						data.query[name].push value
					else
						data.query[name] = [data.query[name], value]
			else
				data.query[name] = value

	data
