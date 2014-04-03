angular.module('cgForm.schemaFactory', [])
    .factory('SchemaFactory', function () {

        return {
            get: function (schemaName) {

                if(this[schemaName]){
                    throw new Error('Schema Not found for '+schemaName);
                }
                return this[schemaName];
            },
            put: function (schemaName, schemaObject) {
                this[schemaName] = schemaObject;
            }
        };

    });
