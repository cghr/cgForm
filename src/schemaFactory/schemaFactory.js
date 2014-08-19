angular.module('cgForm.schemaFactory', ['cgForm.lodash'])
    .factory('SchemaFactory', function (_) {

        function getSchema(schemaName) {

            if (_.isUndefined(this[schemaName]))
                throw 'Schema Not found for ' + schemaName

            return this[schemaName]
        }

        function putSchema(schemaName, schemaObject) {
            this[schemaName] = schemaObject
        }


        return { get: getSchema, put: putSchema }

    })
