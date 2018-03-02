'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _reactBlessed = require('react-blessed');

var _Yatta = require('./Yatta');

var _Yatta2 = _interopRequireDefault(_Yatta);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Creating our screen
var screen = _blessed2.default.screen({
    autoPadding: false,
    smartCSR: true,
    dockBorders: true,
    title: 'Yatta'
});

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

// Rendering the React app using our screen
var component = (0, _reactBlessed.render)(_react2.default.createElement(_Yatta2.default, null), screen);