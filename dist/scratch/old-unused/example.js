'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inquirer = require('inquirer');

inquirer.prompt([{
  type: 'list',
  name: 'theme',
  message: 'What do you want to do?',
  choices: ['Order a pizza', 'Make a reservation', new inquirer.Separator(), 'Ask for opening hours', {
    name: 'Contact support',
    disabled: 'Unavailable at this time'
  }, 'Talk to the receptionist']
}, {
  type: 'list',
  name: 'size',
  message: 'What size do you need?',
  choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
  filter: function filter(val) {
    return val.toLowerCase();
  }
}]).then(function (answers) {
  console.log((0, _stringify2.default)(answers, null, '  '));
});