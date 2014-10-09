angular.module('cgForm.surveyForm', ['cgForm.formElement', 'cgForm.formConfig', 'cgForm.schemaFactory', 'cgForm.formService', 'cgForm.lodash', 'ui.router', 'cgForm.timelog'])
    .controller('surveyFormCtrl', function ($scope, $element, FormService, $state, $stateParams, _, $log) {

        /* Posts  data to Sever */
        function postData() {
            var done = function () {

                if ($scope.schema.onSave !== '')
                    $state.go($scope.schema.onSave, $stateParams);
                else if ($scope.schema.condtion !== '' && $scope.schema.crossEntity === '') {
                    var data = $scope.data
                    var transition = eval($scope.schema.condition) ? $scope.schema.success : $scope.schema.fail
                    $state.go(transition, $stateParams)
                }
                else if ($scope.schema.crossEntity !== '') {

                    var params = $scope.schema.crossEntity.split(';')
                    var entity = params[0]
                    var entityId = params[1]
                    FormService.getResource(entity, $stateParams[entityId])
                        .then(function (resp) {
                            var data = resp.data
                            var transition = eval($scope.schema.condition) ? $scope.schema.success : $scope.schema.fail
                            $state.go(transition, $stateParams)
                        })
                }

                else
                    $scope.fnct({data: $scope.data});


                //$rootScope.$eval($scope.schema.onSave);

            };
            var fail = function () {
                throw new Error('Failed to post data');
            };
            //Format muliselect values
            angular.forEach($scope.data, function (value, key) {
                if (_.isObject(value)) {
                    var selections = _.keys(value, function (val) {
                        return val;
                    });
                    $scope.data[key] = selections.join(';');

                }

            });

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

            if ($scope.flowIndex < ($scope.schema.properties.length - 1)) {
                handleFlow();
                var nextCondition = $scope.schema.properties[$scope.flowIndex]['valdn'];
                var matches = nextCondition.match(/{.*}/);
                if (matches) {
                    var evalValue = $scope.$eval(matches[0].replace('{', '').replace('}', ''));
                    _.last($scope.flow.properties).valdn = nextCondition.replace(/{.*}/, evalValue);
                }
            } else {
                postData();
            }

        };

        /* Handles the flow condition logic  */
        function handleFlow() {

            $scope.flowSeq++;
            var nextItemInFlow = $scope.schema.properties[$scope.flowSeq];
            if (!_.isUndefined(nextItemInFlow)) {
                if (nextItemInFlow.type == 'checkbox')
                    $scope.data[nextItemInFlow.name] = {};

                else if (nextItemInFlow.type == 'dynamic_dropdown') {
                    var reqData = angular.copy(nextItemInFlow.metadata)
                    reqData['refValue'] = $scope.$eval(nextItemInFlow['metadata']['refValue']);
                    FormService.getDynamicDropdownData(reqData).then(function (resp) {
                        var dynamicDropdownIndex = $scope.flowSeq
                        $scope.schema.properties[$scope.flowSeq].items = resp.data
                        $scope.flow.properties.splice($scope.flow.properties.length - 1, 1);
                        $scope.flow.properties.push($scope.schema.properties[dynamicDropdownIndex]);
                    }, function () {
                        $log.error('Failed to fetch data')

                    });
                }
            }
            if (!nextItemInFlow) {
                postData();
                return;
            }
            if (nextItemInFlow.flow.length === 0 || $scope.$eval(nextItemInFlow.flow) === true) {
                $scope.flowIndex = $scope.flowSeq;
                $scope.flow.properties.push(angular.copy($scope.schema.properties[$scope.flowIndex]));
            } else {
                handleFlow();
            }

        }

        /* Handles focus event on control group and modifies flow accordingly */
        $scope.jumpFlow = function (itemName) {

            var flowIndex = _.findIndex($scope.flow.properties, {
                name: itemName
            });
            var seqIndex = _.findIndex($scope.schema.properties, {
                name: itemName
            });

            $scope.flow.properties = _.initial($scope.flow.properties, ($scope.flow.properties.length - 1) - flowIndex);
            $scope.flowIndex = seqIndex;
            $scope.flowSeq = $scope.flowIndex;


            /* Remove all non-flow properties added to $scope.data (form data) as a result of flow navigation back */
            _.each($scope.data, function (value, key) {

                key = key.split('_')[0];

                var isPresent = _.findIndex($scope.flow.properties, {
                    name: key
                });
                if (isPresent === -1) {
                    delete $scope.data[key];
                }

            });


        };
        /* Get GPS */
        $scope.getGps = function () {
            $scope.data.gps_latitude = '12.7435';
            $scope.data.gps_longitude = '17.9872';

        };

    })
    .directive('surveyForm', function (FormConfig, _, SchemaFactory, $state, FormService, $rootScope, $timeout, $q, TimeLogFactory) {
        return {
            templateUrl: 'template/surveyForm/surveyForm.html',
            restrict: 'E',
            replace: true,
            scope: {
                options: ' = ',
                fnct: '&onSave'
            },
            link: function postLink(scope, element) {

                $rootScope.timestamp = TimeLogFactory.getCurrentTime()

                /* Load Json Schema for current state if not supplied through attributes */
                scope.schema = angular.copy(scope.options) || angular.copy(SchemaFactory.get($state.current.name));
                /* Prompt before form submit */
                scope.schema.properties.push({flow: '', type: 'heading', label: 'Section Completed. Press Enter to Continue ', valdn: ''});

                /* Initialize form data */
                scope.data = {};


                /* Merge schema with default config */
                scope.schema = _.extend(scope.schema, FormConfig);

                /* Load lookup data and Cross Check dynamic validation */
                angular.forEach(scope.schema.properties, function (elem) {
                    if (elem.type === 'lookup') {
                        FormService.getLookupData(elem.lookup).then(function (resp) {

                            elem.type = 'radio';
                            elem.items = resp.data;

                            var index = _.findIndex(scope.flow.properties, {name: elem.name});
                            if (index != -1) {
                                scope.flow.properties[index].type = 'radio';
                                scope.flow.properties[index].items = resp.data;

                            }

                        });
                    }
                    if (!_.isEmpty(elem.crossCheck)) {
                        FormService.getCrossCheckData(elem.crossCheck).then(function (resp) {
                            var condition = elem.crossCheck.condition.replace('{value}', resp.data.value);
                            elem.valdn = condition;
                            var index = _.findIndex(scope.flow.properties, {name: elem.name});
                            if (index != -1)
                                scope.flow.properties[index].valdn = condition;

                        });
                    }
                });

                var crossFlowPromises = [];
                var indexes = [];
                /* Check for CrossFlow conditions */
                angular.forEach(scope.schema.properties, function (elem, i) {

                    if (elem.crossFlow) {
                        if (elem.crossFlow.length > 0) {
                            crossFlowPromises.push(FormService.checkCrossFlow(elem.crossFlow));
                            indexes.push(i);
                        }
                    }
                });
                var elemIndex = 0;
                $q.all(crossFlowPromises).then(function (responses) {

                    angular.forEach(responses, function (resp) {
                        if (resp.data.check === false)
                            scope.schema.properties[indexes[elemIndex]].crossFlowCheck = false;

                        elemIndex++;

                    });
                    scope.schema.properties = _.remove(scope.schema.properties, function (element) {

                        if (angular.isUndefined(element.crossFlowCheck))
                            return true;

                        return element.crossFlowCheck !== false;
                    });
                    /* Render Initial Item in the flow after all hidden elements(without conditions) */
                    scope.flow.properties.push(angular.copy(scope.schema.properties[++hiddenCount]));
                    scope.flowSeq++;
                    scope.flowIndex++;

                });


                /* Evaluate values in hidden fields */
                angular.forEach(scope.schema.properties, function (elem) {

                    if (elem.name !== 'datastore' && elem.type === 'hidden')
                        elem.value = $rootScope.$eval(elem.value);


                    if (elem.type === 'hidden')
                        scope.data[elem.name] = elem.value;


                });


                /* Initialize checkbox element's data with empty objects in scope.data */
                var multipleSelectElements = _.filter(scope.schema.properties, {
                    type: 'checkbox'
                });
                _.each(multipleSelectElements, function (item) {
                    scope.data[item.name] = {};
                });
                /* Store datastore value in scope to use in controller */
                scope.datastore = _.find(scope.schema.properties, {
                    name: 'datastore'
                }).value;

                /* Get form data if already populated */
                FormService.getResource(scope.datastore).then(function (resp) {
                    delete resp.data.timelog;
                    delete resp.data.endtime;
                    angular.extend(scope.data, resp.data);
                });

                /* Bind Enter as Tab and Validation to form */
                element.bValidator();

                scope.flow = { properties: [] };

                //Render All hidden elements
                var hiddenCount = -1; //count all hidden elements
                scope.flowSeq = -1;
                scope.flowIndex = -1;
                for (var j = 0; j < scope.schema.properties.length; j++) {
                    var elem = scope.schema.properties[j];
                    if (elem.type === 'hidden' || elem.type === 'heading') {
                        scope.flow.properties.push(angular.copy(elem));
                        hiddenCount++;
                        scope.flowSeq++;
                        scope.flowIndex++;

                    }
                    else
                        break;


                }


            },
            controller: 'surveyFormCtrl'

        };
    });