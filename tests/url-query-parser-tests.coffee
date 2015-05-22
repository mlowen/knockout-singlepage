describe 'URL parameter parser', () ->
	# Route extraction

	it 'extracts the hash', () ->
		parameters = urlQueryParser '/#hash'

		expect(parameters.hash).toBe('hash')

	it 'sets the hash property to be null when there is no hash in the URL', () ->
		parameters = urlQueryParser '/'

		expect(parameters.hash).toBe(null)

	# Query parameter extraction

	it 'extracts a query parameter into a field on the query object returned', () ->
		parameters = urlQueryParser '/?foo=123'

		expect(parameters.query.foo).toBe('123')

	it 'extracts a query parameter into a field on the query object returned and sets it to null if there is no value', () ->
		parameters = urlQueryParser '/?foo'

		expect(parameters.query.foo).toBe(null)

	it 'extracts a query parameter into a field on the query object returned when there is also a hash', () ->
		parameters = urlQueryParser '/#hash?foo=123'

		expect(parameters.hash).toBe('hash')
		expect(parameters.query.foo).toBe('123')

	it 'extracts a query parameter into a field on the query object returned when the parameter contains a hash', () ->
		parameters = urlQueryParser '/?foo=123#abc'

		expect(parameters.hash).toBe(null)
		expect(parameters.query.foo).toBe('123#abc')

	it 'extracts multiple query parameters into a field on the query object returned', () ->
		parameters = urlQueryParser '/?foo=123&bar=abc'

		expect(parameters.query.foo).toBe('123')
		expect(parameters.query.bar).toBe('abc')

	it 'extracts multiple query parameters of the same name into an array on the query object returned', () ->
		parameters = urlQueryParser '/?foo=123&foo=abc'

		expect(parameters.query.foo.length).toBe(2)
		expect('123' in parameters.query.foo).toBe(true)
		expect('abc' in parameters.query.foo).toBe(true)

	it 'overwrites a query parameter when specified twice times but at least once without a value', () ->
		parameters = urlQueryParser '/?foo=123&foo'

		expect(parameters.query.foo).toBe('123')

	it 'does not add query parameter to array if it has been specified multiple times and at least once without a value.', () ->
		parameters = urlQueryParser '/?foo=123&foo=abc&foo'

		expect(parameters.query.foo.length).toBe(2)
		expect('123' in parameters.query.foo).toBe(true)
		expect('abc' in parameters.query.foo).toBe(true)
