/*jshint node:true*/

module.exports = function (io) {

    // Socket IO Server Backend
    io.of('/portfolio').on('connection', function (socket) {
        var uniqueID = Math.floor(Math.random() * 9999999);
        socket.emit("setID", uniqueID);

        socket.broadcast.emit("playerJoined", { id: uniqueID });

        socket.on("playerAlreadyHere", function (data) {
            socket.broadcast.emit("playerAlreadyHere", data);
        });

        socket.on("updatePosition", function (data) {
            socket.broadcast.emit("updatePosition", data);
        });

        socket.on("disconnect", function () {
            socket.broadcast.emit("playerLeft", uniqueID);
        });
    });

    return {
        // Cloud9 still has a couple bugs. I use this when I can't get my server to quit through the UI.
        stopServer: function (request, response, next) {
            process.exit();
        }
    };
};
