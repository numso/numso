/*global console, require */

require.config({
    paths: {
        'jquery': 'lib/jquery',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone',
        'tmpl': 'lib/tmpl'
    },

    shim: {
        'jquery': {
            deps: [],
            exports: '$'
        },

        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require([
    'jquery',
    'tmpl!templates/values',
    'tmpl!templates/graph',
    'tmpl!templates/coverFlow'
], function (
    $,
    valuesTmpl,
    graphTmpl,
    coverFlowTmpl
) {

    var myArr = [[],['normal'],[]];
    for (var i = 0; i < 7; ++i) {
        myArr[0].push('left');
        myArr[2].push('right');
    }

    $('.cover-flow').html(coverFlowTmpl(myArr));

    $('.my-img').hover(function (e) {
        var myEl = $(e.target).closest('.img-holder');
        $('.normal').removeClass('normal');
        myEl.addClass('normal');

        var str = 'left';
        var myPics = $('.my-img');

        for (var i = 0; i < myPics.length; ++i) {
            var cur = myPics[i];
            $(cur).removeClass('right').removeClass('left');
            if (cur === myEl.find('.my-img')[0]) {
                str = 'right';
            } else {
                $(cur).addClass(str);
            }
        }
    });




    // start coding here
    var MAX_NUM_INPUTS = 20;
    var CANVAS_SIZE = 300;

    var arr = [];
    for (var i = 0; i < MAX_NUM_INPUTS; i = i + 2) {
        arr.push([i, i + 1]);
    }

    $('.graph').html(graphTmpl(CANVAS_SIZE));
    $('.values').html(valuesTmpl(arr));

    $('.num-input').blur(function () {
        var myNums = [];
        for (var i = 0; i < MAX_NUM_INPUTS; ++i) {
            var inp = $('#box-' + i).val();
            var parsed = parseInt(inp, 10);
            if (inp && !isNaN(parsed)) {
                myNums.push(parsed);
                $('#box-' + i).val(parsed);
            } else {
                $('#box-' + i).val('');
            }
        }
//        myNums.sort();

        if (myNums.length < 3) {
            clearCanvas();
            $('#area-num').text('0');
        } else {
            createCanvas(myNums);
            $('#area-num').text(calculateArea(myNums));
        }
    });

    var toRad = function (a) {
        return Math.PI / 180 * a;
    };

    var lawOfCosine = function (a, b, C) {
        var c = a * a + b * b - 2 * a * b * Math.cos(toRad(C));
        return Math.sqrt(c);
    };

    var heronsFormula = function (a, b, c) {
        var s = ( a + b + c ) / 2;
        var t = s * ( s - a ) * ( s - b ) * ( s - c );
        return Math.sqrt(t);
    };

    var calculateArea = function (nums) {
        nums.sort();
        var area = 0;

        var angle = 360 / nums.length;

        for (var i = 0; i < nums.length; ++i) {
            var num1 = nums[i];
            if (i + 1 === nums.length) {
                var num2 = nums[0];
            } else {
                var num2 = nums[i + 1];
            }
            var num3 = lawOfCosine(num1, num2, angle);
            var shard = heronsFormula(num1, num2, num3);
            area += shard;
        }

        return area;
    };

    var createCanvas = function (nums) {
        var c = CANVAS_SIZE / 2;
        var a = 360 / nums.length;

        var max = 1;

        var coords = [];
        for (var i = 0; i < nums.length; ++i) {
            var curAngle = a * i;

            coords.push({
                x: (Math.cos(toRad(curAngle)) * nums[i]),
                y: (Math.sin(toRad(curAngle)) * nums[i]),
                c: (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256))
            })

            if (Math.abs(Math.cos(toRad(curAngle)) * nums[i]) > max) {
                max = Math.abs(Math.cos(toRad(curAngle)) * nums[i]);
            }

            if (Math.abs(Math.sin(toRad(curAngle)) * nums[i]) > max) {
                max = Math.abs(Math.sin(toRad(curAngle)) * nums[i]);
            }
        }

        var mult = (c - 20) / max;

        var myCanvas = document.getElementById('graph-canvas');
        var ctx = myCanvas.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        for (var j = 0; j < coords.length; ++j) {
            if (j + 1 === coords.length) {
                var two = coords[0];
            } else {
                var two = coords[j + 1];
            }
            ctx.beginPath();
            ctx.lineWidth=1;
            ctx.strokeStyle='rgb(' + coords[j].c + ')';
            ctx.fillStyle='rgba(' + coords[j].c + ',.3)';
            // ctx.strokeStyle='rgb(0,255,0)';
            // ctx.fillStyle='rgba(0,255,0,.3)';

            ctx.moveTo(c, c);
            ctx.lineTo((coords[j].x * mult) + c, (coords[j].y * mult) + c);
            ctx.lineTo((two.x * mult) + c, (two.y * mult) + c);
            ctx.lineTo(c, c);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    };

    var clearCanvas = function () {
        var myCanvas = document.getElementById('graph-canvas');
        var ctx = myCanvas.getContext('2d');
        ctx.clearRect(0, 0, 300, 300);
    };
});
