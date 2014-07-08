angular.module('cgForm.ffqForm', ['cgForm.formElement', 'cgForm.formConfig', 'cgForm.formService' , 'cgForm.lodash', 'cgForm.schemaFactory', 'ui.router', 'cgForm.joelpurra'])
    .directive('ffqForm', function (FormConfig, _, SchemaFactory, $state, FormService, $rootScope, JoelPurra) {

        function postLink(scope, element) {

            Date.prototype.today = function () {
                return this.getFullYear() + '-' + (((this.getMonth() + 1) < 10) ? '0' : '') + (this.getMonth() + 1) + '-' + ((this.getDate() < 10) ? '0' : '') + this.getDate();
            };


            Date.prototype.timeNow = function () {
                return ((this.getHours() < 10) ? '0' : '') + this.getHours() + ':' + ((this.getMinutes() < 10) ? '0' : '') + this.getMinutes() + ':' + ((this.getSeconds() < 10) ? '0' : '') + this.getSeconds();
            };
            var newDate = new Date();
            $rootScope.timestamp = newDate.today() + ' ' + newDate.timeNow();

            /* Load Json Schema for current state if not supplied through attributes */
            scope.schema = _.clone(scope.options) || _.clone(SchemaFactory.get($state.current.name))

            /* Initialize form data */
            scope.data = {};

            /* Extend the current schema with default config */
            scope.schema = _.extend(scope.schema, FormConfig.getConfig());

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
            var multipleSelectElements = _.filter(scope.schema.properties, {type: 'checkbox'});
            _.each(multipleSelectElements, function (item) {
                scope.data[item.name] = {};
            });
            /* Store datastore value in scope to use in controller */
            scope.data.datastore = _.find(scope.schema.properties, {name: 'datastore'}).value;


            /* Create a separate collection for hidden elements  */
            scope.schema.hiddenElements = _.filter(scope.schema.properties, {type: 'hidden'});

            /* Remove hidden items from schema */
            _.remove(scope.schema.properties, {type: 'hidden'});


            /* Bind Enter as Tab and Validation to form */
            element.plusAsTab();
            element.bValidator();

        }

        function controllerFn($scope, $element, $state, $stateParams) {

            function isValidForm() {
                return $element.data('bValidator').validate()
            }

            $scope.onSubmit = function (data) {

                /* Validate form before submit */
                if (isValidForm())
                    postData(data)

            };

            /* Posts form data to Sever */
            function postData(data) {

                var done = function () {
                    $state.go($scope.schema.onSave, $stateParams);

                };
                var fail = function () {
                    throw  'Failed to post data'
                };
                FormService.postResource(data).then(done, fail);
            }
        }


        return {
            templateUrl: 'template/ffqForm/ffqForm.html',
            restrict: 'E',
            replace: true,
            scope: { options: ' = ' },
            link: postLink,
            controller: controllerFn
        }
    });

