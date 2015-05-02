  if(typeof define === 'function' && define.amd) {
    define([ 'knockout' ], initialise);
  } else if(!ko) {
    throw 'Unable to find knockout';
  } else {
    initialise(ko);
  }
})();
