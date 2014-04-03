angular.module('cgForm.ngEnter', [])
    .directive('ngEnter', function () {
        return {
            link: function postLink(scope, elem, attrs) {

                elem.bind('keypress', function (e) {
                    if (e.charCode === 13 && !e.shiftKey) {
                        scope.$apply(attrs.ngEnter);
                    }
                });

            }
        };
    });
