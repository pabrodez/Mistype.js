// const { UI } = require('./UI')

const blessed1 = require('blessed');


// Create a screen object.
let screen = blessed1.screen({
    smartCSR: true
});

let box1 = blessed1.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: 0.1,
    style: {
        fg: 'white',
        bg: 'magenta',
    },
});

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
screen.render();
