!function(){var a;a=function(a){var b;return b=function(){function b(){this.router=null,this.baseUrl=location.protocol+"//"+location.host}return b.prototype.init=function(b,c){if(this.router)throw"Router has already been initialised";return this.router=new Router(b),this.router.go(location.pathname),c||(c=document.body),c.setAttribute("data-bind","component: { name: current().compoent, params: { params: current().parameters, hash: current().hash, query: current().query } }"),document.body.addEventListener("click",function(a){return function(b){return"a"===b.target.tagName.toLowerCase()&&b.target.href.slice(0,a.baseUrl.length)===a.baseUrl?(a.go(b.target.href.slice(a.baseUrl.length)),b.stopPropagation(),b.preventDefault()):void 0}}(this),!1),a.applyBindings(this.router)},b.prototype.go=function(a){if(!this.router)throw"Router has not been initialised";return history.pushState(null,null,a),this.router.go(a)},b}(),a.singlePage?void 0:a.singlePage=new b};"function"==typeof define&&define.amd;if(amdAvailble&&define(["knockout"],a),ko)a(ko);else if(!amdAvailble)throw"Unable to find knockout"}();