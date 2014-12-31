'use strict';

angular.module('lodeditApp')
    .directive('durationCheck', function() {
    return {
               restrict: 'A',
                require: 'ngModel',
        
        link: function(scope, elem, attr, ctrl) {
            var flags = attr.intFlags || '';
            var regex = new RegExp('^(\+|-)?P([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T([0-9]+H)?([0-9]+M)?([0-9]+(\.[0-9]+)?S)?)?$', flags);            
                        
            ctrl.$parsers.unshift(function(value) {
                var valid = regex.test(value);
                if (value=='P' || value=='+P' || value=='-P') {
                    valid=false;
                };
                ctrl.$setValidity('durationCheck', valid);

                return valid ? value : undefined;
            });
         
        }
    };
});