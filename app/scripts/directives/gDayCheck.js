'use strict';

angular.module('lodeditApp')
    .directive('gdayCheck', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            var flags = attr.booleanFlags || '';
            var regex = new RegExp('^---[0-3][0-9]$', flags);            
            ctrl.$parsers.unshift(function(value) {
                var valid = regex.test(value);
                if (value.substring(3)>31) {
                    valid=false;
                };
                ctrl.$setValidity('gdayCheck', valid);
                return valid ? value : undefined;
            });
        }
    };
});