angular.module('cgForm.ffqForm', ['cgForm.formElement', 'cgForm.formConfig', 'cgForm.formService' , 'lodash', 'cgForm.schemaFactory', 'ui.router'])
    .directive('ffqForm', function (FormConfig, _, SchemaFactory, $state, FormService, $rootScope) {
        return {
            templateUrl: 'template/ffqForm/ffqForm.html',
            restrict: 'E',
            replace: true,
            scope: {
                options: ' = '
            },
            link: function postLink(scope, element) {

                /* Load Json Schema for current state if not supplied through attributes */
                scope.schema = scope.options || SchemaFactory.get($state.current.name);

                /* Extend the current schema with default config */
                scope.schema = _.extend(scope.schema, FormConfig.getConfig());

                /* Evaluate information in hidden fields */
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
                scope.data.datastore = _.find(scope.schema.properties, {name: 'datastore'}).value;


                /* Create a separate collection for hidden elements  */
                scope.schema.hiddenElements = _.filter(scope.schema.properties, {type: 'hidden'});

                /* Remove hidden items from schema */
                _.remove(scope.schema.properties, {type: 'hidden'});


                /* Bind Enter as Tab and Validation to form */
                element.plusAsTab();
                element.bValidator();

            },
            controller: function ($scope, $element) {

                $scope.onSubmit = function (data) {

                    /* Validate form before submit */
                    if (!$element.data('bValidator').validate()) {
                        return;
                    }
                    postData(data);
                };

                /* Posts form data to Sever */
                function postData(data) {

                    var done = function () {
                        $scope.$eval($scope.schema.onSave);

                    };
                    var fail = function () {
                        throw  new Error('Failed to post data');
                    };
                    FormService.postResource(data).then(done, fail);
                }
            }

        };
    });

