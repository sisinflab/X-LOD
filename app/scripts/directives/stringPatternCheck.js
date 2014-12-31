'use strict';

angular.module('lodeditApp')
    .directive('stringPatternCheck', function() {
    return {
         restrict: 'A',
        require: 'ngModel',
  
        link: function(scope, elem, attr, ctrl) {
            
            var flags = attr.intFlags || '';
            
            var regex = new RegExp(attr.stringPatternCheck, flags);            
              
            ctrl.$parsers.unshift(function(value) {
                
                var valid = regex.test(value);
                ctrl.$setValidity('stringPatternCheck', valid);
                
                return valid ? value : undefined;
            });
        }
    };
});