/*!
 * knockout-singlepage 0.2.0-alpha
 * (c) Michael Lowen - https://github.com/mlowen/knockout-singlepage
 * License: MIT (http://opensource.org/licenses/mit-license.php)
 */
(function() {

var urlQueryParser;

urlQueryParser = function(url) {
  var data, equalPosition, hashStart, i, len, name, parameter, queryStart, queryStringParameters, ref, value;
  data = {
    hash: null,
    query: {}
  };
  hashStart = url.indexOf('#') + 1;
  queryStart = url.indexOf('?') + 1;
  if (hashStart > 0) {
    if (queryStart < 1) {
      data.hash = url.slice(hashStart);
    }
    if (queryStart > hashStart) {
      data.hash = url.slice(hashStart, +(queryStart - 2) + 1 || 9e9);
    }
  }
  if (queryStart > 0) {
    queryStringParameters = url.slice(queryStart).split('&');
    for (i = 0, len = queryStringParameters.length; i < len; i++) {
      parameter = queryStringParameters[i];
      equalPosition = parameter.indexOf('=');
      name = null;
      value = null;
      if (equalPosition > 0) {
        ref = parameter.split('='), name = ref[0], value = ref[1];
      } else {
        name = parameter;
      }
      if (data.query[name]) {
        if (value) {
          if ('array' === typeof data.query[name]) {
            data.query[name].push(value);
          } else {
            data.query[name] = [data.query[name], value];
          }
        }
      } else {
        data.query[name] = value;
      }
    }
  }
  return data;
};

var Route;

Route = (function() {
  Route.prototype.errors = {
    invalidRouteName: 'Route has no name',
    invalidRouteUrl: 'Route has an invalid URL'
  };

  Route.prototype.parameterRegex = /:([a-z][a-z0-9]+)/ig;

  function Route(data) {
    var name, parameters, regex, url;
    if (!data.name) {
      throw this.errors.invalidRouteName;
    }
    if (!data.url) {
      throw this.errors.invalidRouteUrl;
    }
    name = data.name.trim();
    url = (data.url[0] === '/' ? data.url : '/' + data.url).trim();
    regex = '^' + (url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')) + '\\/?(#.*)?(\\?.*)?$';
    regex = regex.replace(this.parameterRegex, '([a-z0-9]+)');
    parameters = data.url.match(this.parameterRegex);
    if (!name) {
      throw this.errors.invalidRouteName;
    }
    if (!url) {
      throw this.errors.invalidRouteUrl;
    }
    this.component = name;
    this.parameters = parameters ? parameters.map(function(item) {
      return item.slice(1);
    }) : [];
    this.regex = new RegExp(regex, 'i');
  }

  Route.prototype.clashesWith = function(route) {
    return route.component === this.component || route.regex.toString() === this.regex.toString();
  };

  Route.prototype.matches = function(url) {
    return this.regex.test(url);
  };

  Route.prototype.extractParameters = function(url) {
    var i, index, matches, params, ref;
    params = {};
    if (this.parameters.length) {
      matches = url.match(this.regex).slice(1);
      for (index = i = 0, ref = this.parameters.length - 1; 0 <= ref ? i <= ref : i >= ref; index = 0 <= ref ? ++i : --i) {
        params[this.parameters[index]] = matches[index];
      }
    }
    return params;
  };

  return Route;

})();

var Router;

Router = (function() {
  Router.prototype.errors = {
    invalidRoute: 'Invalid route',
    duplicateRoute: 'Route clashes with existing route'
  };

  function Router(ko, routes) {
    this.ko = ko;
    this.routes = [];
    if (routes) {
      this.add(routes);
    }
  }

  Router.prototype.add = function(route) {
    var j, len, r, results;
    if (Array.isArray(route)) {
      results = [];
      for (j = 0, len = route.length; j < len; j++) {
        r = route[j];
        results.push(this.add(r));
      }
      return results;
    } else {
      if (!route) {
        throw this.errors.invalidRoute;
      }
      r = new Route(route);
      if (this.routes.filter(function(i) {
        return r.clashesWith(i);
      }).length) {
        throw this.errors.duplicateRoute;
      }
      if (route.component) {
        this.ko.components.register(r.component, route.component);
      }
      return this.routes.push(r);
    }
  };

  Router.prototype.get = function(url) {
    var match, route;
    match = (this.routes.filter(function(r) {
      return r.matches(url);
    }))[0];
    route = null;
    if (match) {
      route = {
        component: match.component,
        parameters: match.extractParameters(url)
      };
    }
    return route;
  };

  return Router;

})();

var initialise;

initialise = function(ko) {
  var KnockoutSinglePageExtension;
  KnockoutSinglePageExtension = (function() {
    function KnockoutSinglePageExtension() {
      this.router = null;
      this.baseUrl = location.protocol + '//' + location.host;
      this.notFoundComponent = 'ko-singlepage-notfound';
      this.viewModel = {
        component: ko.observable(null),
        parameters: ko.observable(null),
        hash: ko.observable(null),
        query: ko.observable(null)
      };
      this.events = {
        routeChanged: 'ko-sp-route-changed'
      };
    }

    KnockoutSinglePageExtension.prototype.init = function(routes, element) {
      var params;
      if (this.router) {
        throw 'Router has already been initialised';
      }
      params = routes;
      if (Array.isArray(routes)) {
        params = {
          routes: routes,
          element: element
        };
      }
      ko.components.register(this.notFoundComponent, {
        template: 'This page does not exist'
      });
      this.router = new Router(ko, params.routes);
      this.element = params.element != null ? params.element : document.body;
      this.element.dataset.bind = 'component: { name: component(), params: { params: parameters(), hash: hash(), query: query() } }';
      document.body.addEventListener('click', (function(_this) {
        return function(e) {
          var hasClickBinding, isBaseUrl, isLeftButton, url;
          if (e.target.tagName.toLowerCase() === 'a') {
            if (e.target.dataset.bind) {
              hasClickBinding = e.target.dataset.bind.split(',').reduce((function(initial, current) {
                return (current.split(':')[0].trim().toLowerCase() === 'click') || initial;
              }), false);
            }
            isLeftButton = (e.which || evt.button) === 1;
            isBaseUrl = e.target.href.slice(0, _this.baseUrl.length) === _this.baseUrl;
            if (isLeftButton && isBaseUrl && !hasClickBinding) {
              url = {
                href: e.target.href.slice(_this.baseUrl.length)
              };
              if (e.target.dataset.route != null) {
                url.route = e.target.dataset.route.toLowerCase();
              }
              if (url.route !== 'none') {
                _this.go(url);
                e.stopPropagation();
                return e.preventDefault();
              }
            }
          }
        };
      })(this), false);
      window.onpopstate = (function(_this) {
        return function(e) {
          return _this.go(location.href.slice(_this.baseUrl.length));
        };
      })(this);
      if (params.on != null) {
        if (params.on.routeChanged != null) {
          this.onRouteChanged(params.on.routeChanged);
        }
      }
      this.go(location.href.slice(this.baseUrl.length));
      return ko.applyBindings(this.viewModel);
    };

    KnockoutSinglePageExtension.prototype.go = function(url) {
      var queryData, route;
      if (!this.router) {
        throw 'Router has not been initialised';
      }
      if (typeof url !== 'object') {
        url = {
          href: url
        };
      }
      if (url.route !== 'url-only') {
        route = this.router.get(url.href);
        if (route) {
          queryData = urlQueryParser(url.href);
          this.viewModel.hash(queryData.hash);
          this.viewModel.query(queryData.query);
          this.viewModel.parameters(route.parameters);
          this.viewModel.component(route.component);
        } else {
          this.viewModel.hash(null);
          this.viewModel.query(null);
          this.viewModel.parameters(null);
          this.viewModel.component(this.notFoundComponent);
        }
        this.element.dispatchEvent(new CustomEvent(this.events.routeChanged, {
          detail: {
            url: url.href,
            component: this.viewModel.component(),
            context: {
              hash: this.viewModel.hash(),
              query: this.viewModel.query(),
              parameters: this.viewModel.parameters()
            }
          }
        }));
      }
      return history.pushState(null, null, url.href);
    };

    KnockoutSinglePageExtension.prototype.on = function(event, callback) {
      return this.element.addEventListener(event, callback);
    };

    KnockoutSinglePageExtension.prototype.onRouteChanged = function(callback) {
      return this.on(this.events.routeChanged, callback);
    };

    KnockoutSinglePageExtension.prototype.off = function(event, callback) {
      return this.element.removeEventListener(event, callback);
    };

    KnockoutSinglePageExtension.prototype.offRouteChanged = function(callback) {
      return this.off(this.events.routeChanged, callback);
    };

    return KnockoutSinglePageExtension;

  })();
  if (!ko.singlePage) {
    return ko.singlePage = new KnockoutSinglePageExtension();
  }
};

  var amdAvailable = typeof define === 'function' && define.amd;

  if(amdAvailable) define([ 'knockout' ], initialise);

  if('undefined' !== typeof ko) initialise(ko);
  else if (!amdAvailable) throw 'Unable to find knockout';
})();
