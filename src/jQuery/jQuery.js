
angular.module('cgForm.jQuery',[])
    .factory('jQuery', function ($window) {

        if (!$window.jQuery){
            throw new Error('Lodash library not available');
        }


        return $window.jQuery;
    });
