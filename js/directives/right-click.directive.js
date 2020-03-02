(function () {
  'use strict';
  // this directive is for right click to keep flag
  angular.module('mineSweeperApp')
    .directive('rightClick', function ($parse) {
      return function (scope, element, attrs) {
        var fn = $parse(attrs.rightClick);
        element.bind('contextmenu', function (event) {
          scope.$apply(function () {
            event.preventDefault();
            fn(scope, {
              $event: event
            });
          });
        });
      };
    });
})();