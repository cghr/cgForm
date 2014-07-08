angular.module('cgForm.standardForm', ['cgForm.formElement', 'cgForm.formConfig', 'cgForm.formService', 'cgForm.lodash', 'ui.router', 'cgForm.schemaFactory', 'cgForm.joelpurra'])
    .directive('standardForm', function (FormConfig, _, SchemaFactory, $state, FormService, $rootScope, JoelPurra) {
        return {
            templateUrl: 'template/standardForm/standardForm.html',
            restrict: 'E',
            replace: true,
            scope: {
                options: '=',
                randomtotal: '@',
                randomsize: '@',
                formdata: '='
            },
            link: function postLink(scope, element, attrs) {

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

                /* Generates a random form */
                var randoms = [];
                var randomProperties = [];

                scope.randomsize = angular.isDefined(scope.randomsize) ? scope.randomsize : 0;
                for (var i = 0; i < scope.randomsize; i++) {
                    randoms.push(getRandomNumber());
                }
                if (scope.randomsize > 0 && scope.randomtotal > 0) {
                    /* Push all hidden properties */
                    angular.forEach(scope.schema.properties, function (property, index) {
                        if (property.type === 'hidden') {
                            randomProperties.push(property);
                            //scope.schema.properties.splice(index,1);
                        }
                    });
                    _.remove(scope.schema.properties, {type: 'hidden'});

                    angular.forEach(randoms, function (randomItem) {
                        randomProperties.push(scope.schema.properties[randomItem]);

                    });
                    scope.schema.properties = randomProperties;

                }
                function mathRandom() {
                    return Math.floor((Math.random() * (scope.randomtotal)) + 1);
                }

                function getRandomNumber() {
                    var randomNumber;
                    while (1) {
                        randomNumber = mathRandom();
                        if (!_.contains(randoms, randomNumber)) {
                            break;
                        }
                    }
                    return randomNumber;
                }

                console.log('random properties');
                console.log(scope.schema.properties);


                /* Initialize data in  scope to save all form data*/
                scope.data = scope.formdata || {};

                /* Extend the current schema with default config */
                scope.schema = _.extend(scope.schema, FormConfig.getConfig());


                /* Load lookup data if any and add initFocus attr to every elem to disable initFocus attribute */
                angular.forEach(scope.schema.properties, function (elem) {
                    elem.initFocus = false;
                    elem.scrollTop = false;

                    if (elem.type === 'lookup') {
                        FormService.getLookupData(elem.lookup).then(function (resp) {
                            elem.type = 'radio';
                            elem.items = resp.data;
                        });
                    }
                });

                /* Evaluate information in hidden fields */
                angular.forEach(scope.schema.properties, function (elem) {

                    if (elem.name !== 'datastore' && elem.type === 'hidden') {
                        elem.value = $rootScope.$eval(elem.value);

                    }
                    if (elem.type === 'hidden') {
                        scope.data[elem.name] = elem.value;
                    }

                });


                /* Initialize checkbox element's data with empty objects in scope.data */
                var multipleSelectElements = _.filter(scope.schema.properties, {
                    type: 'checkbox'
                });
                _.each(multipleSelectElements, function (item) {
                    scope.data[item.name] = {};
                });
                /* Store datastore value in scope.data  */
                scope.data.datastore = _.find(scope.schema.properties, {
                    name: 'datastore'
                }).value;


                /* Bind Enter as Tab and Validation to form */


                element.plusAsTab();
                element.bValidator();

            },
            controller: function ($scope, $element, $state, $stateParams) {

                $scope.onSubmit = function (data) {

                    /* Validate form before submit */
                    if (!$element.data('bValidator').validate()) {
                        return;
                    }


                    postData(data);

                };

                /* Posts  data to Sever */
                function postData(data) {

                    var done = function () {
                        $state.go($scope.schema.onSave, $stateParams);

                    };
                    var fail = function () {
                        throw new Error('Failed to post data');
                    };
                    FormService.postResource(data).then(done, fail);
                }

                /* Get GPS */
                $scope.getGps = function () {
                    $scope.data.gps_latitude = '12.7435';
                    $scope.data.gps_longitude = '17.9872';

                };
            }

        };
    });