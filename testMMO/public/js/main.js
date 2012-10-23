/*global console, require */

require.config({
    paths: {
        'jquery': 'lib/jquery',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone',
        'tmpl': 'lib/tmpl',
        'socketio': '/socket.io/socket.io'
    },

    shim: {
        'jquery': {
            deps: [],
            exports: '$'
        },

        'socketio': {
            deps: [],
            exports: "io"
        },

        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require([
    'jquery',
    'socketio',
    'tmpl!pages/chars/templates/myCharacter',
    'tmpl!pages/chars/templates/netCharacter'
], function (
    $,
    io,
    myCharacter,
    netCharacter
) {
    var socket = io.connect('/portfolio');
    socket.on('connect', function () {
        $(".wrapper").append(myCharacter());

        var myID;

        socket.on("setID", function (data) {
            myID = data;
        });

        socket.on("playerJoined", function (data) {
            $(".wrapper").append(netCharacter(data));

            socket.emit("playerAlreadyHere", {
                id: myID,
                top: $('.myCharacter').position().top,
                left: $('.myCharacter').position().left
            });
        });

        socket.on("playerAlreadyHere", function (data) {
            if ($("#" + data.id).length === 0) {
                $(".wrapper").append(netCharacter(data));
            }
        });

        socket.on("updatePosition", function (data) {
            $("#" + data.id).css({
                top: data.top,
                left: data.left,
                "background-position-x": data.backX,
                "background-position-y": data.backY
            });
        });

        socket.on("playerLeft", function (data) {
            $("#" + data).remove();
        });

        var moveDist = 4;
        var myTimer = 0;

        var movingLeft = false,
            movingRight = false,
            movingUp = false,
            movingDown = false;

        $("body").keydown(function (e) {
            if (e.keyCode === 37) {
                movingLeft = true;
                $(".myCharacter").css("background-position-y", "-32px");
            }

            if (e.keyCode === 38) {
                movingUp = true;
                $(".myCharacter").css("background-position-y", "-96px");
            }

            if (e.keyCode === 39) {
                movingRight = true;
                $(".myCharacter").css("background-position-y", "-64px");
            }

            if (e.keyCode === 40) {
                movingDown = true;
                $(".myCharacter").css("background-position-y", "0px");
            }
        });

        $("body").keyup(function (e) {
            if (e.keyCode === 37) {
                movingLeft = false;
            }

            if (e.keyCode === 38) {
                movingUp = false;
            }

            if (e.keyCode === 39) {
                movingRight = false;
            }

            if (e.keyCode === 40) {
                movingDown = false;
            }
        });

        var moveCharacter = function () {
            var newLeft, newTop, update, newBackX;

            if (++myTimer > 4) {
                newBackX = +$(".myCharacter").css("background-position-x").replace("px", "") - 32;
                if (newBackX < -64) {
                    newBackX = 0;
                }
                myTimer = 0;
            }

            if (movingLeft) {
                newLeft = $('.myCharacter').position().left - moveDist;
                $('.myCharacter').css('left', newLeft + "px");
                if (!update) {
                    $('.myCharacter').css('background-position-x', newBackX);
                }
                update = true;
            }

            if (movingRight) {
                newLeft = $('.myCharacter').position().left + moveDist;
                $('.myCharacter').css('left', newLeft + "px");
                if (!update) {
                    $('.myCharacter').css('background-position-x', newBackX);
                }
                update = true;
            }

            if (movingUp) {
                newTop = $('.myCharacter').position().top - moveDist;
                $('.myCharacter').css('top', newTop + "px");
                if (!update) {
                    $('.myCharacter').css('background-position-x', newBackX);
                }
                update = true;
            }

            if (movingDown) {
                newTop = $('.myCharacter').position().top + moveDist;
                $('.myCharacter').css('top', newTop + "px");
                if (!update) {
                    $('.myCharacter').css('background-position-x', newBackX);
                }
                update = true;
            }

            if (update) {
                socket.emit("updatePosition", {
                    id: myID,
                    top: $('.myCharacter').position().top,
                    left: $('.myCharacter').position().left,
                    backX: $('.myCharacter').css('background-position-x'),
                    backY: $('.myCharacter').css('background-position-y')
                });
            }

            window.requestAnimationFrame(moveCharacter);
        };

        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

        window.requestAnimationFrame(moveCharacter);
    });
});
