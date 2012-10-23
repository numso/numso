/*jshint node:true*/

module.exports = function (io) {

    return {
        stopServer: function (request, response, next) {
            process.exit();
        }
    };
};
