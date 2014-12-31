'use strict';

angular.module('lodeditApp')
    .directive('gyearCheck', function() {
    return {
               restrict: 'A',
                require: 'ngModel',
        
        link: function(scope, elem, attr, ctrl) {
            var flags = attr.intFlags || '';
            var regex = new RegExp('^[0-9][0-9][0-9][0-9]$', flags);            
                        
            ctrl.$parsers.unshift(function(value) {
                var valid = regex.test(value);
                ctrl.$setValidity('gyearCheck', valid);

                return valid ? value : undefined;
            });
         
        }
    };
});