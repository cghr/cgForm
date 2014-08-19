angular.module('cgForm.initFocus', [])
    .directive('initFocus', function ($timeout) {

        function postLink(scope, elm, attrs) {

            if (attrs.initFocus === 'false')
                return

            function elmFocus() {
                elm.focus()
            }

            $timeout(elmFocus, 0)
        }

        return { restrict: 'A', link: postLink }


    })
;