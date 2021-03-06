var AttrValidators = require('../../utilities/attrValidators');
var CardinalDirection = require('../../enum/cardinalDirection');
var CardinalPortPosition = require('../layout/cardinalPortPosition');
var createClass = require('../../utilities/createClass');
var Lang = require('../../utilities/lang');
var Layout = require('./layout');

var PortLayout = createClass({
  extend: Layout,
  attrs: {
    position: {
      valueFn: function() {
        return new CardinalPortPosition({
          direction: CardinalDirection.NORTH,
          percentage: 0
        });
      },

      validator: AttrValidators.isNullOrInstanceOf(CardinalPortPosition)
    }
  }
});

module.exports = PortLayout;
