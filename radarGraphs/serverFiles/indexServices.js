/*jshint node:true*/

module.exports = function () {

    return {
        // Cloud9 still has a couple bugs. I use this when I can't get my server to quit through the UI.
        stopServer: function (request, response, next) {
            process.exit();
        }
    };
};
