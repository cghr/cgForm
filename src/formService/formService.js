angular.module('cgForm.formService', ['cgForm.formConfig', 'lodash', 'ui.router'])
    .factory('FormService', function (FormConfig, $http, $location, _, $stateParams) {


        return {
            getResource: function (entity) {
                var params = $location.url().split('/');
                var entityId = _.last(params);
                var dataUrl = FormConfig.getConfig().resourceBaseUrl + entity + '/' + entityId;
                return $http.get(dataUrl);
            },
            postResource: function (data) {

                return $http.post(FormConfig.getConfig().submitUrl, data);
            },
            getLookupData: function (reqData) {
                reqData.refId = $stateParams[reqData.ref];
                return $http.post(FormConfig.getConfig().lookupBaseUrl, reqData);
            }
        };
    }
);
