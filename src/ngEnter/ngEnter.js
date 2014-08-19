angular.module('cgForm.ngEnter', [])
    .directive('ngEnter', function () {

        function postLink(scope, elem, attrs) {

            elem.bind('keypress', function (e) {

                if (e.charCode === 13 && !e.shiftKey)
                    scope.$apply(attrs.ngEnter)

            })

        }

        return {
            restrict: 'A',
            link: postLink
        }
    })
