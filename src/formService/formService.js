angular.module('cgForm.formService', ['cgForm.formConfig', 'cgForm.lodash', 'ui.router'])
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
            },
            getCrossCheckData:function(reqData){
                reqData.refId = $stateParams[reqData.ref];
                return $http.post(FormConfig.getConfig().crossCheckBaseUrl, reqData);

            },
            checkCrossFlow: function (crossFlows) {
                angular.forEach(crossFlows, function (crossFlow) {

                    crossFlow.refId = $stateParams[crossFlow.ref];

                });
                return $http.post(FormConfig.getConfig().crossFlowBaseUrl, crossFlows);

            }
        };
    });