#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
let textPath = process.argv[2] || 'sample.txt' // should be process.argv[2] ?? 'sample.txt' instead

const { UI } = require('./src/UI')
const { Game } = require('./src/Game.js')

function readContent(callback) {
    fs.readFile(path.resolve(__dirname, 'wordLists', textPath), 'utf-8', (err, data) => {
        if (err) return callback(err)
        callback(data)
    })

}

readContent(function (content) {
    let wordsArray = content.split(',')
    const mistype = new Game(new UI(wordsArray))
    mistype.start()
})