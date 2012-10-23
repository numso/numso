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
    'socketio'
], function (
    $,
    io
) {
    // start coding here
});
