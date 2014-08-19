angular.module('cgForm.schemaResolver', ['cgForm.schemaFactory', 'cgForm.lodash', 'ui.router', 'cgForm.formConfig'])
    .factory('SchemaResolver', function (SchemaFactory, _, $state, FormConfig) {

        function resolveSchema(scope) {

            /* Load Json Schema for current state if not supplied through attributes */
            var schema = _.clone(scope.options) || _.clone(SchemaFactory.get($state.current.name))


            /* Extend the current schema with default config */
            return  _.extend(schema, FormConfig);
        }

        return { resolve: resolveSchema }
    })
