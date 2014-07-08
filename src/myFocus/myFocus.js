angular.module('cgForm.myFocus', [])
    .directive('myFocus', function () {
        return {
            link: function postLink(scope, elem, attrs) {

                elem.bind('focus', function (e) {
                    scope.$apply(attrs.myFocus);
                });

            }
        };
    });
