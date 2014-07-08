angular.module('cgForm.formService', ['cgForm.formConfig', 'cgForm.lodash', 'ui.router'])
    .factory('FormService', function (FormConfig, $http, $location, _, $stateParams) {

        function config() {

            return FormConfig.getConfig();
        }

        function postData(url, data) {
            return $http.post(url, data);
        }

        function getData(url) {
            return $http.get(url)
        }

        function getResource(entity) {
            var params = $location.url().split('/');
            var entityId = _.last(params);
            var dataUrl = config().resourceBaseUrl + entity + '/' + entityId;
            return getData(dataUrl)
        }

        function postResource(data) {

            return postData(config().submitUrl, data);
        }

        function getLookupData(reqData) {

            reqData.refId = $stateParams[reqData.ref];
            return postData(config().lookupBaseUrl, reqData);

        }

        function getCrossCheckData(reqData) {

            reqData.refId = $stateParams[reqData.ref];
            return postData(config().crossCheckBaseUrl, reqData);

        }

        function checkCrossFlow(crossFlows) {

            angular.forEach(crossFlows, function (crossFlow) {

                crossFlow.refId = $stateParams[crossFlow.ref];

            });
            return postData(config().crossFlowBaseUrl, crossFlows);

        }


        return {
            getResource: getResource,
            postResource: postResource,
            getLookupData: getLookupData,
            getCrossCheckData: getCrossCheckData,
            checkCrossFlow: checkCrossFlow
        };
    });