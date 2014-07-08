angular.module('cgForm.surveyForm', ['cgForm.formElement', 'cgForm.formConfig', 'cgForm.schemaFactory', 'cgForm.formService', 'cgForm.lodash', 'ui.router'])
    .controller('surveyFormCtrl', function ($scope, $element, FormService,$state,$stateParams) {

        /* Posts  data to Sever */
        function postData() {
            var done = function () {

                if($scope.schema.onSave!==''){
                    $state.go($scope.schema.onSave,$stateParams);
                }
                else{
                    $scope.fnct({data:$scope.data});
                }
                    
                
                //$rootScope.$eval($scope.schema.onSave);

            };
            var fail = function () {
                throw new Error('Failed to post data');
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

            if ($scope.flowIndex < ($scope.schema.properties.length-1)) {
                handleFlow();
                var nextCondition=$scope.schema.properties[$scope.flowIndex]['valdn'];
                var matches=nextCondition.match(/{.*}/);
                if(matches){
                    var evalValue=$scope.$eval(matches[0].replace('{','').replace('}',''));
                    $scope.flow.properties[$scope.flowIndex].valdn=nextCondition.replace(/{.*}/,evalValue);
                }
            } else {
                postData();
            }

        };

        /* Handles the flow condition logic  */
        function handleFlow() {

            $scope.flowSeq++;
            var nextItemInFlow = $scope.schema.properties[$scope.flowSeq];
            if(!nextItemInFlow){
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
            $scope.flowIndex=seqIndex;
            $scope.flowSeq=$scope.flowIndex;


            /* Remove all non-flow properties added to $scope.data (form data) as a result of flow navigation back */
            _.each($scope.data, function (value, key) {

                key=key.split('_')[0];

                var isPresent = _.findIndex($scope.flow.properties, {
                    name: key
                });
                if (isPresent === -1) {
                    delete $scope.data[key];
                }

            });


        };
        /* Get GPS */
                $scope.getGps=function(){
                    $scope.data.gps_latitude = '12.7435';
                    $scope.data.gps_longitude = '17.9872';

                };

    })
    .directive('surveyForm', function (FormConfig, _, SchemaFactory, $state, FormService, $rootScope, $timeout,$q) {
        return {
            templateUrl: 'template/surveyForm/surveyForm.html',
            restrict: 'E',
            replace: true,
            scope: {
                options: ' = ',
                fnct:'&onSave'
            },
            link: function postLink(scope, element) {

                Date.prototype.today = function () {
                    return this.getFullYear() + '-' + (((this.getMonth() + 1) < 10) ? '0' : '') + (this.getMonth() + 1) + '-' + ((this.getDate() < 10) ? '0' : '') + this.getDate();
                };


                Date.prototype.timeNow = function () {
                    return ((this.getHours() < 10) ? '0' : '') + this.getHours() + ':' + ((this.getMinutes() < 10) ? '0' : '') + this.getMinutes() + ':' + ((this.getSeconds() < 10) ? '0' : '') + this.getSeconds();
                };
                var newDate = new Date();
                $rootScope.timestamp = newDate.today() + ' ' + newDate.timeNow();

                /* Load Json Schema for current state if not supplied through attributes */
                scope.schema = angular.copy(scope.options) || angular.copy(SchemaFactory.get($state.current.name));
                /* Initialize form data */
                scope.data = {};

                /* Merge schema with default config */
                scope.schema = _.extend(scope.schema, FormConfig.getConfig());

                 /* Load lookup data and Cross Flow dynamic validation */
                    angular.forEach(scope.schema.properties, function (elem) {
                        if (elem.type === 'lookup') {
                            console.log('lookup ');
                            FormService.getLookupData(elem.lookup).then(function (resp) {

                                elem.type='radio';
                                elem.items=resp.data;

                                var index = _.findIndex(scope.flow.properties, {name: elem.name});
                                scope.flow.properties[index].type = 'radio';
                                scope.flow.properties[index].items = resp.data;
                                
                            });
                        }
                        if (!_.isEmpty(elem.crossCheck)) {
                            FormService.getCrossCheckData(elem.crossCheck).then(function (resp) {
                                var condition = elem.crossCheck.condition.replace('{value}', resp.data.value);
                                elem.valdn=condition;
                                var index = _.findIndex(scope.flow.properties, {name: elem.name});
                                scope.flow.properties[index].valdn = condition;
                                
                            });
                        }
                    });

                var crossFlowPromises=[];
                var indexes=[];
                /* Check for CrossFlow conditions */
                angular.forEach(scope.schema.properties, function (elem, i) {

                    if (elem.crossFlow) {
                        if (elem.crossFlow.length > 0) {
                            crossFlowPromises.push(FormService.checkCrossFlow(elem.crossFlow));
                            indexes.push(i);
                        }
                    }
                });
                var elemIndex=0;
                $q.all(crossFlowPromises).then(function(responses){

                    angular.forEach(responses,function(resp){
                        if(resp.data.check===false){
                            scope.schema.properties[indexes[elemIndex]].crossFlowCheck=false;
                            //scope.schema.properties.splice(indexes[elemIndex],1);
                        }
                        elemIndex++;

                    });
                    scope.schema.properties=_.remove(scope.schema.properties,function(element){
                        if(angular.isUndefined(element.crossFlowCheck)){
                            return true;

                        }

                        return element.crossFlowCheck!==false;
                    });

                });


                /* Evaluate values in hidden fields */
                angular.forEach(scope.schema.properties, function (elem) {
                    
                    if (elem.name !== 'datastore' && elem.type === 'hidden') {
                    elem.value = $rootScope.$eval(elem.value);
                    console.log(elem);
                    console.log(elem.value);

                    }
                    if(elem.type==='hidden'){
                        scope.data[elem.name]=elem.value;
                    }
                
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


                /* Bind Enter as Tab and Validation to form */
                element.bValidator();

                scope.flow = {
                    properties: []
                };

                //Render All hidden elements
                var hiddenCount = -1; //count all hidden elements
                scope.flowSeq=-1;
                scope.flowIndex=-1;
                for(var j=0;j<scope.schema.properties.length;j++){
                    var elem=scope.schema.properties[j];
                    if (elem.type === 'hidden' || elem.type==='heading') {
                        scope.flow.properties.push(angular.copy(elem));
                        hiddenCount++;
                        scope.flowSeq++;
                        scope.flowIndex++;

                    }
                    else{
                        break;
                    }

                }

                /* Render Initial Item in the flow after all hidden elements(without conditions) */
                scope.flow.properties.push(angular.copy(scope.schema.properties[++hiddenCount]));
                scope.flowSeq++;
                scope.flowIndex++;

            },
            controller: 'surveyFormCtrl'

        };
    });