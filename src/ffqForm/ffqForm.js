angular.module('cgForm.ffqForm', ['cgForm.formElement', 'cgForm.formConfig', 'cgForm.formService' , 'cgForm.lodash', 'cgForm.schemaFactory', 'ui.router', 'cgForm.joelpurra', 'cgForm.timelog', 'cgForm.schemaResolver'])
    .directive('ffqForm', function (FormConfig, _, SchemaFactory, $state, FormService, $rootScope, JoelPurra, TimeLogFactory, SchemaResolver) {

        function postLink(scope, element) {


            $rootScope.timestamp = TimeLogFactory.getCurrentTime()

            /* Initialize form data */
            scope.data = {};

            /* Load Json Schema for current state if not supplied through attributes */
            scope.schema = SchemaResolver.resolve(scope)

            /* Evaluate information in hidden fields */
            _.each(scope.schema.properties, function (elem) {

                if (elem.name !== 'datastore' && elem.type === 'hidden')
                    elem.value = $rootScope.$eval(elem.value);

                if (elem.type === 'hidden')
                    scope.data[elem.name] = elem.value;


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

            /* Get form data if already populated */
            FormService.getResource(scope.data.datastore).then(function (resp) {
                delete resp.data.timelog;
                delete resp.data.endtime;
                angular.extend(scope.data, resp.data);
            });


            /* Bind Enter as Tab and Validation to form */
            element.plusAsTab();
            element.bValidator();

        }

        function controllerFn($scope, $element, $state, $stateParams) {


            $scope.onSubmit = function (data) {

                if (isValidForm())
                    postData(data)

            };
            function isValidForm() {
                return $element.data('bValidator').validate()
            }

            /* Posts form data to Sever */
            function postData(data) {

                FormService.postResource()
                    .then(function () {
                        $state.go($scope.schema.onSave, $stateParams);
                    })
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

