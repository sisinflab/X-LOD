'use strict';

angular.module('lodeditApp')
    .directive('urlCheck', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            var maxLength=100;
            var flags = attr.urlFlags || '';
            var regex = /^(?:([a-z0-9+.-]+:\/\/)((?:(?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(:(?:\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?|([a-z0-9+.-]+:)(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?)(\?(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?(#(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?$/i;            
            ctrl.$parsers.unshift(function(value) {
                var valid = regex.test(value);
                if (valid) {
                    if (value.indexOf('.')!=-1) {
                        var before=value.substring(0,value.indexOf('.'));
                        var after=value.substring(value.indexOf('.')+1);
                        if(before.length>maxLength || after.length>maxLength){
                            valid=false;
                        }
                    }else{
                        if(value.length>maxLength){
                            valid=false;
                        }
                    }
                };
                ctrl.$setValidity('urlCheck', valid);
                return valid ? value : undefined;
            });
        }
    };
});