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

var KnockoutSinglePageRouter;

KnockoutSinglePageRouter = (function() {
  KnockoutSinglePageRouter.prototype.errors = {
    invalidRoute: 'Invalid route',
    duplicateRoute: 'Route clashes with existing route'
  };

  function KnockoutSinglePageRouter(routes) {
    this.routes = [];
    if (routes) {
      this.add(routes);
    }
  }

  KnockoutSinglePageRouter.prototype.add = function(route) {
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
        ko.components.register(r.component, route.component);
      }
      return this.routes.push(r);
    }
  };

  KnockoutSinglePageRouter.prototype.get = function(url) {
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

  return KnockoutSinglePageRouter;

})();

var initialise;

initialise = function(ko) {
  var KnockoutSinglePageExtension;
  KnockoutSinglePageExtension = (function() {
    function KnockoutSinglePageExtension() {
      this.router = null;
      this.baseUrl = location.protocol + '//' + location.host;
    }

    KnockoutSinglePageExtension.prototype.init = function(routes, element) {
      if (this.router) {
        throw 'Router has already been initialised';
      }
      this.router = new Router(routes);
      this.router.go(location.pathname);
      if (!element) {
        element = document.body;
      }
      element.setAttribute('data-bind', 'component: { name: current().compoent, params: { params: current().parameters, hash: current().hash, query: current().query } }');
      document.body.addEventListener('click', (function(_this) {
        return function(e) {
          if (e.target.tagName.toLowerCase() === 'a' && e.target.href.slice(0, _this.baseUrl.length) === _this.baseUrl) {
            _this.go(e.target.href.slice(_this.baseUrl.length));
            e.stopPropagation();
            return e.preventDefault();
          }
        };
      })(this), false);
      return ko.applyBindings(this.router);
    };

    KnockoutSinglePageExtension.prototype.go = function(url) {
      if (!this.router) {
        throw 'Router has not been initialised';
      }
      history.pushState(null, null, url);
      return this.router.go(url);
    };

    return KnockoutSinglePageExtension;

  })();
  if (!ko.singlePage) {
    return ko.singlePage = new KnockoutSinglePageExtension();
  }
};

  var amdAvailable = typeof define === 'function' && define.amd;

  if(amdAvailble) define([ 'knockout' ], initialise);

  if(ko) initialise(ko);
  else if (!amdAvailble) throw 'Unable to find knockout';
})();
