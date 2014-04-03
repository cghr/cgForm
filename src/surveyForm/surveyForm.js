angular.module('cgForm.surveyForm', ['cgForm.formElement', 'cgForm.formConfig', 'cgForm.schemaFactory', 'cgForm.formService' , 'lodash', 'ui.router'])
    .controller('surveyFormCtrl', function ($scope, $element, FormService) {

        /* Posts  data to Sever */
        function postData() {
            var done = function () {
                $scope.$eval($scope.schema.onSave);

            };
            var fail = function () {
                throw  new Error('Failed to post data');
            };
            FormService.postResource($scope.data).then(done, fail);
        }

        /* Validate form before submit */
        function isValidForm() {

            return $element.data('bValidator').validate();
        }

        /* Handles enter Event on Form to render next Question */
        $scope.showNext = function () {

            if (!isValidForm()) {
                return;
            }

            if ($scope.flowIndex <= $scope.schema.properties.length) {
                handleFlow();
            } else {
                postData();
            }

        };

        /* Handles the flow condition logic  */
        function handleFlow() {

            $scope.flowSeq++;
            var nextItemInFlow = $scope.schema.properties[$scope.flowSeq];
            if (nextItemInFlow.flow.length === 0 || $scope.$eval(nextItemInFlow.flow) === true) {
                $scope.flowIndex = $scope.flowSeq;
                $scope.flow.properties.push($scope.schema.properties[$scope.flowIndex]);
            }

            else {
                handleFlow();
            }

        }

        /* Handles focus event on control group and modifies flow accordingly */
        $scope.jumpFlow = function (itemName) {

            var flowIndex = _.findIndex($scope.flow.properties, {name: itemName});
            var seqIndex = _.findIndex($scope.schema.properties, {name: itemName});

            $scope.flow.properties = _.initial($scope.flow.properties, ($scope.flow.properties.length - 1) - flowIndex);

            /* Remove all non-flow properties added to $scope.data (form data) as a result of flow navigation back */
            _.each($scope.data, function (value, key) {

                var isPresent = _.findIndex($scope.flow.properties, {name: key});
                if (isPresent === -1) {
                    delete $scope.data[key];
                }

            });


        };

    })
    .directive('surveyForm', function (FormConfig, _, SchemaFactory, $state, FormService, $rootScope, $timeout) {
        return {
            templateUrl: 'template/surveyForm/surveyForm.html',
            restrict: 'E',
            replace: true,
            scope: {
                options: ' = '
            },
            link: function postLink(scope, element) {

                /* Load Json Schema for current state if not supplied through attributes */
                scope.schema = scope.options || SchemaFactory.get($state.current.name);

                /* Merge schema with default config */
                scope.schema = _.extend(scope.schema, FormConfig.getConfig());

                /* Load lookup data if any */
                angular.forEach(scope.schema.properties, function (elem) {
                    if (elem.type === 'lookup') {
                        FormService.getLookupData(elem.lookup).then(function (resp) {
                            elem.type = 'radio';
                            elem.items = resp.data;
                        });
                    }
                });

                /* Evaluate values in hidden fields */
                angular.forEach(scope.schema.properties, function (elem) {
                    if (elem.name !== 'datastore' && elem.type === 'hidden') {
                        elem.value = $rootScope.$eval(elem.value);
                    }
                });


                /* Initialize form data */
                scope.data = {};

                /* Initialize checkbox element's data with empty objects in scope.data */
                var multipleSelectElements = _.filter(scope.schema.properties, {type: 'checkbox'});
                _.each(multipleSelectElements, function (item) {
                    scope.data[item.name] = {};
                });
                /* Store datastore value in scope to use in controller */
                scope.datastore = _.find(scope.schema.properties, {name: 'datastore'}).value;


                /* Bind Enter as Tab and Validation to form */
                element.bValidator();

                scope.flow = {properties: []};

                //Render All hidden elements
                var i = -1;//count all hidden elements
                angular.forEach(scope.schema.properties, function (elem) {
                    if (elem.type === 'hidden') {
                        scope.flow.properties.push(elem);
                        i++;
                    }
                });

                /* Render Initial Item in the flow after all hidden elements(without conditions) */
                scope.flow.properties.push(scope.schema.properties[++i]);
            },
            controller: 'surveyFormCtrl'

        };
    });
