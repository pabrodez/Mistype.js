#!/usr/bin/env node

const { UI } = require('./UI')
const { Game } = require('./Game.js')
const mistype = new Game(new UI())
mistype.start()