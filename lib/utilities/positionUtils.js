var CardinalDirection = require('../enum/cardinalDirection');
var CardinalPortPosition = require('../model/layout/cardinalPortPosition');
/**
 * @class PositionUtils
 * @static
 */
var PositionUtils = {};

// Data model scales values up to 0-100.
var DATA_MODEL_MULTIPLIER = 100;

// some useful constants
var DIRECTION_TO_PERCENT = {};
DIRECTION_TO_PERCENT[CardinalDirection.NORTH] = 0;
DIRECTION_TO_PERCENT[CardinalDirection.SOUTH] = 1;
DIRECTION_TO_PERCENT[CardinalDirection.EAST] = 1;
DIRECTION_TO_PERCENT[CardinalDirection.WEST] = 0;

var limitFraction = function(val) {
  if (val < 0) {
    return 0;
  }
  if (val > 1) {
    return 1;
  }

  return val;
};

/**
 * Utilities for converting positions between formats
 * @class PositionUtils.Conversion
 * @static
 */
PositionUtils.Conversion = {
  /**
   * Convert N/S/E/W to x, y. For placing inside some bounded object such as a Node.
   *
   * @method cardinalToCartesian
   * @param  {CardinalDirection} positionData
   * @return {Object} contains x,y placement with origin in top left in range [0, 1].
   */
  cardinalToCartesian: function(positionData) {
    var amount = positionData.get('percentage') / DATA_MODEL_MULTIPLIER;

    var direction = positionData.get('direction');

    switch(direction) {
    case CardinalDirection.NORTH:
      return {x: amount, y: 0};

    case CardinalDirection.SOUTH:
      return {x: amount, y: 1};

    case CardinalDirection.EAST:
      return {x: 1, y: amount};

    case CardinalDirection.WEST:
      return {x: 0, y: amount};

    default:
      throw new Error('Unsupported cardinal direction: ' + direction);
    }

  },

  /**
   * Convert x, y positions between 0 and 1 (fraction of some bound such as a Node) to Cardinal
   * @method cartesianToCardinal
   * @param  {Object} cartesianPct cartesian x,y position
   * @return {CardinalPortPosition} the position, converted to cardinal coordinates
   */
  cartesianToCardinal: function(cartesianPct) {
    var hPct = limitFraction(cartesianPct.x);
    var vPct = limitFraction(cartesianPct.y);

    // figure out what the closest side of the node is
    // we do this in a 2 round competiton
    // E/W and N/S face off and then the winners compete to get the final direction

    // Winner is determined by closeness to the side (calculeted with absolute difference)

    // WEST vs EAST
    var distFromWest = Math.abs(hPct - DIRECTION_TO_PERCENT[CardinalDirection.WEST]);
    var distFromEast = Math.abs(hPct - DIRECTION_TO_PERCENT[CardinalDirection.EAST]);
    var eastOrWestDirection = distFromWest < distFromEast ? CardinalDirection.WEST : CardinalDirection.EAST;

    // NORTH vs SOUTH
    var distFromNorth = Math.abs(vPct - DIRECTION_TO_PERCENT[CardinalDirection.NORTH]);
    var distFromSouth = Math.abs(vPct - DIRECTION_TO_PERCENT[CardinalDirection.SOUTH]);
    var northOrSouthDirection = distFromNorth < distFromSouth ? CardinalDirection.NORTH : CardinalDirection.SOUTH;

    // [WEST|EAST] vs [NORTH|SOUTH]
    var distFromEW = Math.abs(hPct - DIRECTION_TO_PERCENT[eastOrWestDirection]);
    var distFromNS = Math.abs(vPct - DIRECTION_TO_PERCENT[northOrSouthDirection]);

    var direction;
    var pct;

    if (distFromEW < distFromNS) {
      direction = eastOrWestDirection;
      pct = limitFraction(vPct);

    } else {
      direction = northOrSouthDirection;
      pct = limitFraction(hPct);
    }

    return new CardinalPortPosition({
      direction: direction,
      percentage: pct * DATA_MODEL_MULTIPLIER
    });
  }
};

module.exports = PositionUtils;
