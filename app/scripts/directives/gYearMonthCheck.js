'use strict';

angular.module('lodeditApp')
    .directive('gyearMonthCheck', function() {
    return {
               restrict: 'A',
                require: 'ngModel',
        
        link: function(scope, elem, attr, ctrl) {
            var flags = attr.intFlags || '';
            var regex = new RegExp('^[0-9][0-9][0-9][0-9]-[0-1][0-9]$', flags);            
                        
            ctrl.$parsers.unshift(function(value) {
                var valid = regex.test(value);
                if (value.substring(5)>12) {
                    valid=false;
                };
                ctrl.$setValidity('gyearMonthCheck', valid);

                return valid ? value : undefined;
            });
         
        }
    };
});