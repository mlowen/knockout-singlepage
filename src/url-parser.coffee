UrlParser:
	extractHash: (url) ->
		hash = null

		hashStart = url.indexOf('#') + 1
		queryStart = url.indexOf('?') + 1

		if hashStart > 0
			hash = url[hashStart ..] if queryStart < 1
			hash = url[hashStart .. (queryStart - 2)] if queryStart > hashStart

		hash

	extractQueryParameters: (url) ->
		query = {}

		hashStart = url.indexOf('#') + 1
		queryStart = url.indexOf('?') + 1

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

				if query[name]
					if value
						if 'array' == typeof query[name]
							query[name].push value
						else
							query[name] = [query[name], value]
				else
					query[name] = value

		query
