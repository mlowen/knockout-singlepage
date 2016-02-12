# Knockout-SinglePage

[![Build Status](https://travis-ci.org/mlowen/knockout-singlepage.svg?branch=master)](https://travis-ci.org/mlowen/knockout-singlepage)

A [single page application](http://en.wikipedia.org/wiki/Single-page_application) extension for [Knockout](http://knockoutjs.com/). Knockout-SinglePage leverages Knockout components and the browser history API to achieve its functionality.

## Getting

You can get Knockout-Singlepage via the package managers [npm](https://www.npmjs.com/) or [bower](http://bower.io/) otherwise you can download the latest from Github.

### Bower

```
bower install knockout-singlepage
```

### npm

```
npm install knockout-singlepage
```

### Latest release

You can download the latest release of Knockout-Singlepage from the [release page](https://github.com/mlowen/knockout-singlepage/releases) on GitHub.

### From source

If you [clone the repository](https://github.com/mlowen/knockout-singlepage) locally you can use the instructions from the Contributing section to build the javascript from source.

## Dependencies

The dependencies for using the compiled version of Knockout-SinglePage are:

* [Knockout](http://knockoutjs.com/) - v3.4.0

### Optional

* [RequireJS](http://requirejs.org/)

### Development

In addition to the above there are also the following dependencies for developing Knockout-SinglePage:

* [Gulp](http://gulpjs.com/)

## Usage

To add Knockout-SinglePage to your web application you need to reference using a `<script>` tag somewhere in your HTML, for example:

```html
<script type="text/javascript" src="<path to scripts>/knockout-singlepage.js"></script>
```

Due to the dependency on Knockout the script tag must be after tag that references Knockout. Once you have referenced the library it is time to define some routes. Routes are an array of objects containing a name, a URL and optionally a component like so:

```js
var routes = [
	{ name: 'default', url: '/', component: 'dashboardComponent' },
	{ name: 'anotherRoute', url: '/another-route' }
];
```

As mentioned above Knockout-SinglePage relies on Knockout components to provide some of the [core functionality](http://knockoutjs.com/documentation/component-overview.html), if the component field is not defined then the name of the route must map to a component that has been registered. Knockout-SinglePage also supports route variables which are defined by prefixing a portion of the URL with a colon `:` an example of which is below:

```js
{ name: 'routeWithVariable', url: '/foo/:id' }
```

This will extract a variable called `id` from the route and supply it to the component view model via the route context (see more below).

Once the route is defined you need to set up you HTML to house your application, the following is a very basic example:

```html
<html>
	<head>
		<script type="text/javascript" src="<path to scripts>/knockout.js"></script>
		<script type="text/javascript" src="<path to scripts>/knockout-singlepage.js"></script>
	</head>
	<body>
		<h1>App title</h1>
		<div id="app"></div>

		<script type="text/javascript" src="<path to scripts>/app.js"></script>
	</body>
</html>
```

Now we have our HTML setup we can initialise Knockout-SinglePage, unlike traditional Knockout where you call `ko.ApplyBindings` with Knockout-SinglePage the extension must be initialised like so:

```js
ko.singlePage.init(routes, document.getElementById('app'));
```

This will use the current URL to load the appropriate component into the element identified as the second parameter. The second argument is optional, if none is supplied it will use the `<body>` tag as the container element. You then can change the URL programmatically either via a `<a>` tag or by invoking the `go` method of the extension like so:

```js
ko.singlePage.go('/another-route');
```

The `go` method will also accept an object as a parameter which is expected to be structured like the following:

```js
{
	href: '/another-route',
	route: 'url-only'
}
```

The `href` value must be supplied whereas the `route` value is optional. When the `route` value is supplied it can modify the behaviour of Knockout-SinglePage, the accepted values for this field are:

* `url-only` - Only the browser URL will be updated, Knockout-SinglePage will not attempt to match this to a component.

This behaviour can also be replicated within the view by using the `data-route` attribute as follows:

```html
<a href="/another-route" data-route="url-only">Link Text</a>
```

The values which are accepted for the `data-route` attribute are:

* `url-only` - Behaves the same as the `go` method only updating the browser URL.
* `none` - When this is supplied Knockout-SinglePage will ignore the link when it is clicked and leave the browser to handle it.

### Defining component with the route

You can define a component when defining a route. This is done by passing an object via the `component` field which acts in the same manner as the object passed in as the second parameter to [`ko.components.register`](http://knockoutjs.com/documentation/component-registration.html), Knockout-SinglePage uses the name of the route as the name of the route. The route definitions in turn look like:

```js
var routes = [
	{
		name: 'default',
		url: '/',
		component: {
			viewModel: DefaultViewModel
			template: '<h2>Hello world</h2>'
		}
	}
];
```

### Route context

When a route is matched Knockout.SinglePage extracts the following information from it:

* Any route parameters that have been defined.
* Query string parameters
* Hash

And add these to an object that is passed to the view model of the component using the [`params` option of the component binding](http://knockoutjs.com/documentation/component-binding.html). For the route `/foo/:id` when matching the URL `/foo/1#bar?tar=2&baz=3&tar=4` it will result in a route context that looks like:

```js
{
	params: { id: 1 },
	hash: 'bar',
	query: {
		tar: [ 2, 4 ],
		baz: 3
	}
}
```

### Events

Knockout-SinglePage emits a set of events during the lifetime of the application. Events can be subscribed to either through a method or via the object which can be passed into the `init` method. In both cases either a method or an array of methods can be passed in to be bound to the event.

#### Route Changed

* **Subscribe:** `ko.singlepage.subscribe.routeChanged(callback)`
* **Unsubscribe:** `ko.singlepage.unsubscribe.routeChanged(callback)`

The route changed event is fired when when the URL changes and a new component is loaded. It is important to note that if the `go` method is called with the 'url-only' option or the `data-route` attribute is used with the 'none' or 'url-only' options then the event will not be triggered.

When the route changed event is triggered the Knockout-SinglePage specific information can be found in the detail property of the event. The data supplied is the URL, the component being displayed and the route context. The structure of the data will look like the following:

```js
{
	detail: {
		name: 'foo',
		url: '/foo/1#bar?tar=2&baz=3&tar=4',
		component: 'foo-component',
		context: {
			params: { id: 1 },
			hash: 'bar',
			query: {
				tar: [ 2, 4 ],
				baz: 3
			}
		}
	}
}
```

#### URL Changed

* **Subscribe:** `ko.singlepage.subscribe.urlChanged(callback)`
* **Unsubscribe:** `ko.singlepage.unsubscribe.urlChanged(callback)`

The URL changed event is triggered when the URL for the browser is changed but navigation does not move away from the application. The data which is supplied when the event is triggered is as follows:

```js
{
	detail: {
		url: '/foo/1#bar?tar=2&baz=3&tar=4'
	}
}
```

### Initialising with an object

In the scenario where Knockout-SinglePage is initialised and you want to handle the `ko-sp-route-changed` event if you use the `init` method as described above then the code will not miss receiving the event emitted on the initial component load. The `init` method also accepts the passing in of an object as an argument which will allow you to bind events before the initial component is loaded. The equivalent of the previous example with event binding would be as follows:

```js
ko.singlePage.init({
	routes: routes,
	element: document.getElementById('app'),
	subscribe: {
		routeChanged: function(e) {
			console.log(e);
		}
	}
});
```

Note that in the scenario where the first argument passed in is an object all other arguments are ignored.

### Bindings

Knockout-SinglePage ships with a binding to populate the `href` attribute of an `a` tag, the binding name is `url` which accepts either a string which is the name of the route or an object which has a `route` property and a `params` object which is used to populate the route parameters. Given the following routes:

```js
[
	{ name: 'default', url: '/' },
	{ name: 'profile', url: '/user/:id/profile' }
]
```

When used in the following bindings:

```html
<a data-bind="route: 'default'">Home</a>
<a data-bind="url: { route: 'profile', params: { id: 1 }}">Profile</a>
```

Will result in HTML which looks like:

```html
<a href="/">Home</a>
<a href="/user/1/profile">Profile</a>
```

This functionality is also available via the `ko.singlePage.url(route, params)` method.

### Loading via AMD

Knockout-SinglePage will expose itself as an [AMD module](http://en.wikipedia.org/wiki/Asynchronous_module_definition) if it is possible. If it is a mixed environment where some things are loaded via AMD and some aren't Knockout-SinglePage will expose itself as an AMD module and load itself into the global scope if Knockout is available in the global scope. When loading Knockout-SinglePage as an AMD module it is important to note that it expects Knockout to be loaded as `knockout`.

## Issues

If you find an bug with Knockout-SinglePage or you have an idea on how it can be improved please submit an [issue at the GitHub repository](https://github.com/mlowen/knockout-singlepage/issues?q=is%3Aopen+is%3Aissue) for discussion.

### Known Issues

Any known issues can be found on the [GitHub issues page with the `bug` tag](https://github.com/mlowen/knockout-singlepage/issues?q=is%3Aopen+is%3Aissue+label%3Abug).

## Contributing

If you are wanting to contribute to Knockout-SinglePage the first thing you will want to do is [clone the source code](https://github.com/mlowen/knockout-singlepage), once you have done that you can install the

If you are just starting to work with the Knockout-SinglePage source code the first thing you will want to do is make sure you have the development dependencies installed and then install all of the plugins that Gulp requires by running the following command:

```
npm install
```

Now that the dependencies have been installed you can compile the coffeescript into javascript by running the following command:

```
gulp
```

During development it is handy to have Gulp rebuilding the javascript whenever a change is made, this can be done by running the following command:

```
gulp watch
```

### Running tests

Knockout-SinglePage uses [Jasmine](http://jasmine.github.io/) for any of its tests, these are run when you run `gulp` and are automatically invoked when a source file is changed while `gulp watch` is running. However if you only want to run the tests and not create the final javascript files this can be done with the following command:

```
gulp test
```

### Running the demos

Knockout-SinglePage has two demos which show how to use it either loaded into the [global scope](https://github.com/mlowen/knockout-singlepage/tree/master/demo/traditional) (the traditional demo) or as an [AMD module](https://github.com/mlowen/knockout-singlepage/tree/master/demo/amd). Once you have compiled the javascript files you should be able to run the demos, they are designed to be run with a local file based http server - I usually use `python -m http.server` - run in the directory of the particular demo.

### Pull requests

Before submitting a pull request if would be appreciated if you could [create an issue](https://github.com/mlowen/knockout-singlepage/issues?q=is%3Aopen+is%3Aissue) so the changes can be discussed so that we make sure that no one is doubling up on work and that your change is suitable for this extension.

Knockout-SinglePage has [continuous integration set up at Travis](https://travis-ci.org/mlowen/knockout-singlepage) which also builds any [pull requests](https://travis-ci.org/mlowen/knockout-singlepage/pull_requests) if your pull request does not successfully build it will not be accepted.

## License

Knockout-SinglePage is available under the MIT license which is as follows:

Copyright &copy; 2016 Michael Lowen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
