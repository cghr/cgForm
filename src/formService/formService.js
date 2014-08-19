angular.module('cgForm.formService', ['cgForm.formConfig', 'cgForm.lodash', 'ui.router'])
    .factory('FormService', function (FormConfig, $http, $location, _, $stateParams, $log) {


        function postData(url, data) {

            function success() {

            }

            function error() {
                $log.info()
            }

            return $http.post(url, data).success()
            error()
        }

        function getData(url) {
            return $http.get(url)
        }

        function getResource(entity) {
            var params = $location.url().split('/')
            var entityId = _.last(params)
            var dataUrl = FormConfig.resourceBaseUrl + entity + '/' + entityId

            return getData(dataUrl)
        }

        function postResource(data) {

            return postData(FormConfig.submitUrl, data)
        }

        function getLookupData(reqData) {

            reqData.refId = $stateParams[reqData.ref]
            return postData(FormConfig.lookupBaseUrl, reqData)

        }

        function getCrossCheckData(reqData) {

            reqData.refId = $stateParams[reqData.ref]
            return postData(FormConfig.crossCheckBaseUrl, reqData)

        }

        function checkCrossFlow(crossFlows) {

            angular.forEach(crossFlows, function (crossFlow) {

                crossFlow.refId = $stateParams[crossFlow.ref]

            })
            return postData(FormConfig.crossFlowBaseUrl, crossFlows)

        }


        return {
            getResource: getResource,
            postResource: postResource,
            getLookupData: getLookupData,
            getCrossCheckData: getCrossCheckData,
            checkCrossFlow: checkCrossFlow
        }
    })