(function() {

var KnockoutSinglePageRouter;

KnockoutSinglePageRouter = (function() {
  KnockoutSinglePageRouter.prototype.errorMessages = {
    invalidRoute: 'Invalid route',
    invalidRouteName: 'Route has no name',
    invalidRouteUrl: 'Route has an invalid URL',
    routesWithDuplicateName: 'Multiple routes added with the same name',
    routesWithDuplicateUrl: 'Multiple routes added with the same URL'
  };

  function KnockoutSinglePageRouter(routes) {
    var existing, i, j, len, len1, name, paramRegex, parameters, r, ref, regex, route, url;
    this.current = ko.observable(null);
    this.routes = [];
    for (i = 0, len = routes.length; i < len; i++) {
      r = routes[i];
      if (!r) {
        throw this.errorMessages.invalidRoute;
      }
      if (!r.name) {
        throw this.errorMessages.invalidRouteName;
      }
      if (!r.url) {
        throw this.errorMessages.invalidRouteUrl;
      }
      paramRegex = /:([a-z][a-z0-9]+)/ig;
      url = (r.url[0] === '/' ? r.url : '/' + r.url).trim();
      regex = '^' + (url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')) + '\\/?(#.*)?(\\?.*)?$';
      regex = regex.replace(paramRegex, '([a-z0-9]+)');
      parameters = r.url.match(paramRegex);
      name = r.name.trim();
      if (!name) {
        throw this.errorMessages.invalidRouteName;
      }
      if (!url) {
        throw this.errorMessages.invalidRouteUrl;
      }
      if (r.component) {
        ko.components.register(name, r.component);
      }
      route = {
        component: name,
        parameters: parameters ? parameters.map(function(item) {
          return item.slice(1);
        }) : [],
        regex: new RegExp(regex, 'i')
      };
      ref = this.routes;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        existing = ref[j];
        if (existing.component === route.component) {
          throw this.errorMessages.routesWithDuplicateName;
        }
        if (existing.regex.toString() === route.regex.toString()) {
          throw this.errorMessages.routesWithDuplicateUrl;
        }
      }
      this.routes.push(route);
    }
  }

  KnockoutSinglePageRouter.prototype.go = function(url) {
    var equalPosition, hash, hashStart, i, index, j, len, matches, name, parameter, params, query, queryStart, queryStringParameters, ref, ref1, route, value;
    route = (this.routes.filter(function(r) {
      return r.regex.test(url);
    }))[0];
    if (route) {
      params = {};
      query = {};
      hash = null;
      if (route.parameters.length) {
        matches = url.match(route.regex).slice(1);
        for (index = i = 0, ref = route.parameters.length - 1; 0 <= ref ? i <= ref : i >= ref; index = 0 <= ref ? ++i : --i) {
          params[route.parameters[index]] = matches[index];
        }
      }
      hashStart = url.indexOf('#') + 1;
      queryStart = url.indexOf('?') + 1;
      if (hashStart > 0) {
        if (queryStart < 1) {
          hash = url.slice(hashStart);
        }
        if (queryStart > hashStart) {
          hash = url.slice(hashStart, +(queryStart - 2) + 1 || 9e9);
        }
      }
      if (queryStart > 0) {
        queryStringParameters = url.slice(queryStart).split('&');
        for (j = 0, len = queryStringParameters.length; j < len; j++) {
          parameter = queryStringParameters[j];
          equalPosition = parameter.indexOf('=');
          name = null;
          value = null;
          if (equalPosition > 0) {
            ref1 = parameter.split('='), name = ref1[0], value = ref1[1];
          } else {
            name = parameter;
          }
          if (query[name]) {
            if (value) {
              if ('array' === typeof query[name]) {
                query[name].push(value);
              } else {
                query[name] = [query[name], value];
              }
            }
          } else {
            query[name] = value;
          }
        }
      }
      return this.current({
        component: route.component,
        parameters: params,
        hash: hash,
        query: query
      });
    } else {
      return this.current(null);
    }
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
      element.setAttribute('data-bind', 'component: current');
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

  if(typeof define === 'function' && define.amd) {
    define([ 'knockout' ], initialise);
  } else if(!ko) {
    throw 'Unable to find knockout';
  } else {
    initialise(ko);
  }
})();
