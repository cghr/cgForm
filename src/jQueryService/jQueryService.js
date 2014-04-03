
angular.module('jQuery',[])
    .factory('jQuery', function ($window) {

        if (!$window.jQuery){
            throw new Error('jQuery library not available');
        }


        return $window.jQuery;
    });

