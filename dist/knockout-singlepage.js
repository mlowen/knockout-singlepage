/*!
 * knockout-singlepage 0.3.0-alpha
 * (c) Michael Lowen - https://github.com/mlowen/knockout-singlepage
 * License: MIT (http://opensource.org/licenses/mit-license.php)
 */
!function(){var e=function(e){var n=function(e){var n={hash:null,query:{}},t=e.indexOf("#")+1,r=e.indexOf("?");return t>0&&(r>t?n.hash=e.slice(t,r):0>r&&(n.hash=e.slice(t))),r>=0&&e.slice(r+1).split("&").forEach(function(e){var t=e.indexOf("="),r=null,o=null;t>=0?(r=e.slice(0,t),o=e.slice(t+1)):r=e,n.query[r]&&o?Array.isArray(n.query[r])?n.query[r].push(o):n.query[r]=[n.query[r],o]:n.query[r]||(n.query[r]=o)}),n},t=function(n){var t=this,r={data:"Invalid route",name:"Route has an invalid name",url:"Route has an invalid URL"},o={whitespace:/^\s+$/,url:/^(\s+)?((\/)|((\/((:[a-z](\w+))|(\w|-)+))+))(\s+)?$/i,parameters:/:([a-z][a-z0-9]+)/gi},u=function(e){return new RegExp(("^"+e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")+"\\/?(#.*)?(\\?.*)?$").replace(o.parameters,"([a-z0-9]+)"),"i")};if(!n||"object"!=typeof n)throw r.data;if(!n.name||o.whitespace.test(n.name))throw r.name;if(t.name=n.name.trim(),!n.url||!o.url.test(n.url))throw r.url;t.url=n.url.trim();var a=u(t.url),i=t.url.match(o.parameters);i=i?i.map(function(e){return e.slice(1)}):[],!n.component||o.whitespace.test(n.component)?t.component=t.name:"object"==typeof n.component?(e.components.register(t.name,n.component),t.component=t.name):t.component=n.component.trim(),t.equals=function(e){return t.name==e.name||t.url==e.url||a.toString()==u(e.url).toString()},t.matches=function(e){return a.test(e)},t.parameters=function(e){var n={};return i.length&&e.match(a).slice(1).forEach(function(e,t){var r=i[t];r&&(n[r]=e)}),n}},r=function(e,n){var r=this,o=[],u={existingRoute:"Route clashes with existing route"};r.routes=function(){return o.map(function(e){return e.name})},r.add=function(n){if(Array.isArray(n))n.forEach(function(e){r.add(e)});else{var a=new t(n),i=o.reduce(function(e,n){return e||n.equals(a)},!1);if(i)throw u.existingRoute;o.push(a),e.publish.routeAdded({route:a})}},r.match=function(e){var n=null,t=o.filter(function(n){return n.matches(e)})[0];return t&&(n={name:t.name,component:t.component,parameters:t.parameters(e)}),n},n&&r.add(n)},o=function(e){var n=this,t=e,r={routeAdded:"ko-sp-route-added",routeChanged:"ko-sp-route-changed",urlChanged:"ko-sp-url-changed"},o=function(e,n){Array.isArray(n)?n.forEach(function(n){o(e,n)}):t.addEventListener(e,n)},u=function(e,n){Array.isArray(n)?n.forEach(function(n){u(e,n)}):t.removeEventListener(e,n)},a=function(e,n){t.dispatchEvent(new CustomEvent(e,{detail:n}))};n.subscribe={routeAdded:function(e){o(r.routeAdded,e)},routeChanged:function(e){o(r.routeChanged,e)},urlChanged:function(e){o(r.urlChanged,e)}},n.unsubscribe={routeAdded:function(e){u(r.routeAdded,e)},routeChanged:function(e){u(r.routeChanged,e)},urlChanged:function(e){u(r.urlChanged,e)}},n.publish={routeAdded:function(e){a(r.routeAdded,e)},routeChanged:function(e){a(r.routeChanged,e)},urlChanged:function(e){a(r.urlChanged,e)}}},u=function(){var n=this;n.notFoundComponent="ko-singlepage-not-found",n.component=e.observable(null),n.parameters=e.observable(null),n.hash=e.observable(null),n.query=e.observable(null),n.update=function(e,t){e?(n.hash(t.hash),n.query(t.query),n.parameters(e.parameters),n.component(e.component)):(n.component(n.notFoundComponent),n.parameters(null),n.hash(null),n.query(null))}},a=function(){var t=this,a=null,i=null,s=location.protocol+"//"+location.host,c=new u,d={alreadyInitialised:"Knockout-SinglePage has already been initialised",notInitialised:"Knockout-SinglePage has not been initialised"},l=function(){return null!=a},h=function(){if(!l())throw d.notInitialised},f=function(e){return e?e.slice(s.length):f(location.href)};t.init=function(n,u){if(l())throw d.alreadyInitialised;var h=n;Array.isArray(n)&&(h={routes:n,element:u}),e.components.register(c.notFoundComponent,{template:"This page does not exist"}),h.element=h.element?h.element:document.body,h.element.dataset.bind="component: { name: component(), params: { params: parameters(), hash: hash(), query: query() } }",i=new o(h.element),a=new r(i,h.routes),document.body.addEventListener("click",function(e){if("a"==e.target.tagName.toLowerCase()){var n=!1;e.target.dataset.bind&&(n=e.target.dataset.bind.split(",").reduce(function(e,n){return e||"click"==n.split(":")[0].trim().toLowerCase()},!1));var r=1==(e.which||e.button),o=e.target.href.slice(0,s.length)==s;if(r&&o&&!n){var u={href:f(e.target.href)};e.target.dataset.route&&(u.route=e.target.dataset.route.toLowerCase()),"none"!=u.route&&(t.go(u),e.stopPropagation(),e.preventDefault())}}},!1),window.onpopstate=function(e){t.go(f())},h.subscribe&&(h.subscribe.routeAdded&&t.subscribe.routeAdded(h.subscribe.routeAdded),h.subscribe.routeChanged&&t.subscribe.routeChanged(h.subscribe.routeChanged),h.subscribe.urlChanged&&t.subscribe.routeChanged(h.subscribe.urlChanged)),t.go(f()),e.applyBindings(c,h.element)},t.go=function(e){if(h(),"string"==typeof e&&(e={href:e}),!e.route||"url-only"!=e.route.toLowerCase()){var t=a.match(e.href);t?c.update(t,n(e.href)):c.update(),i.publish.routeChanged({url:e.href,name:t?t.name:null,component:t?t.component:null,context:{hash:c.hash(),query:c.query(),parameters:c.parameters()}})}history.pushState(null,null,e.href),i.publish.urlChanged({url:e.href})},t.subscribe={routeAdded:function(e){h(),i.subscribe.routeAdded(e)},routeChanged:function(e){h(),i.subscribe.routeChanged(e)},urlChanged:function(e){h(),i.subscribe.urlChanged(e)}},t.unsubscribe={routeAdded:function(e){h(),i.unsubscribe.routeAdded(e)},routeChanged:function(e){h(),i.unsubscribe.routeChanged(e)},urlChanged:function(e){h(),i.unsubscribe.urlChanged(e)}}};e.singlePage||(e.singlePage=new a)},n="function"==typeof define&&define.amd;if(n&&define(["knockout"],e),"undefined"!=typeof ko)e(ko);else if(!n)throw"Unable to find knockout"}();