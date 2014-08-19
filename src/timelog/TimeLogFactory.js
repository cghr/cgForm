angular.module('cgForm.timelog', [])
    .factory('TimeLogFactory', function () {


        function twoDigits(d) {
            if (0 <= d && d < 10) return '0' + d.toString()
            if (-10 < d && d < 0) return '-0' + (-1 * d).toString()
            return d.toString()
        }

        Date.prototype.toMysqlFormat = function () {
            return this.getUTCFullYear() + '-' + twoDigits(1 + this.getUTCMonth()) + '-' + twoDigits(this.getUTCDate()) + ' ' + twoDigits(this.getUTCHours() + 5) + ':' + twoDigits(this.getUTCMinutes() + 30) + ':' + twoDigits(this.getUTCSeconds())
        }

        return {
            getCurrentTime: function () {
                return new Date().toMysqlFormat()
            }
        }

    })
