angular.module('cgForm.joelpurra', [])
    .factory('JoelPurra', function ($window) {

        var JoelPurra = $window.JoelPurra
        JoelPurra.PlusAsTab.setOptions({key: 13})

        return JoelPurra;
    });
