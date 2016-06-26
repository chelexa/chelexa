# jsDice
_adopted and mangled from jsDice.com_

The standard dice rolling format for tabletop games is [times]d[sides]. Typical dice strings could add/subtract formats and static numbers together.

jsDice is a small library for parsing dice formula strings as well as rolling the dice.

## Basic Usage

    var Dice = require('jsdice');
    var dieroll = new Dice('4d6 + d20 - 3');
    var results = dieroll.roll();
    console.log(results.total);
    // 24
    console.log(results.results);
    // [ 2, 5, 4, 5, 11, -3 ]

## Installation

This adaptation of jsDice is written for Node.js, and may be used browser-side with browserify.

    npm install jsdice

## Stats Template Usage

When initializing the dice, you can pass a stats object as a second argument to be using in the formula.

    var stats = {dex: 12, str: 4, int: 19, agility: 9};
    diceroll = new Dice('d10 + {str}', stats);
    console.log(diceroll.roll());
    //{ results: [ 3, 4 ], total: 7 }
