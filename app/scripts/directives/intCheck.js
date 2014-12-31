'use strict';

angular.module('lodeditApp')
    .directive('intTen', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            var flags = attr.intFlags || '';
            var regex = new RegExp('^[0-9]+$', flags);            
            ctrl.$parsers.unshift(function(value) {
                var valid = regex.test(value);
                if (valid) {
                    if (value.length>10) {
                        valid=false;
                    };
                };
                ctrl.$setValidity('intTen', valid);
                return valid ? value : undefined;
            });
        }
    };
});