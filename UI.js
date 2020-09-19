const blessed = require('blessed');
const {COLORS, WORDS} = require('./constants.js') 

class UI {
    constructor() {
        this.blessed = blessed
        this.screen = blessed.screen()
        this.screen.title = 'Mistype.js'

        this.topBox = this.createTopBox();
        this.gameBox = this.createGameBox();
        this.gameOverBox = this.createGameOverBox()
        this.bottomBox = this.createBottomBox()

        this.topContainer = this.blessed.box(this.topBox)
        this.gameContainer = this.blessed.box(this.gameBox)
        this.bottomContainer = this.blessed.progressbar(this.bottomBox)
        this.createWordContainers()
    }

    bindHandlers(keyPressHandler, quitHandler, enterHandler) {
        this.screen.on('keypress', keyPressHandler)
        this.screen.key(['escape'], quitHandler)
        this.screen.key(['enter', 'return'], enterHandler)
    }

    clearScreen() {
        this.gameContainer.detach()
        this.gameContainer = this.blessed.box(this.gameBox)
        this.gameOverContainer.detach()
        this.bottomContainer.detach()
        this.bottomContainer = this.blessed.progressbar(this.bottomBox)
    }

    createTopBox() {
        return {
            parent: this.screen,
            top: 0,
            left: 'center',
            width: '100%',
            height: 1,            
            tags: true, 
            content: 'Instructions: Type the highlighted word before it reaches the top',
            style: {
                fg: 'black',
                bg: 'white',
            }
        }
    }

    createGameBox() {
        return {
            parent: this.screen,
            top: 1,
            left: 0,
            width: '100%',
            height: '100%-1',
            style: {
                fg: 'black',
                bg: 'black'
            },
        }
    }

    createBottomBox () {
        return {
            parent: this.screen,
            bottom: 0,
            left: 0,
            width: '100%',
            height: 1,
            orientation: 'horizontal',
            filled: 0,
            style: {
                bar: {
                    fg: 'magenta',
                    bg: 'magenta'
                }
            },
        }
    }

    createGameOverBox() {
        return {
            parent: this.screen,
            top: 'center',
            left: 'center',
            width: 50,
            height: 4,
            tags: true,
            valign: 'middle',
            align: 'center',
            content: ``,
            boder: {
                type: 'line'
            },
            style: {
                bg: COLORS.red,
                fg: COLORS.blue,
                border: {
                    fg: COLORS.blue
                }
            }
        }
    }

    createWordContainers() {
        let usedXCoord = [];
        

        WORDS.forEach((word, index) => {
            let xCoord = this.generateRandomCoord(0, this.screen.width - 12)
            let yCoord = 10 + index * 3
            while (usedXCoord.some((x) => (xCoord >= x) && (xCoord <= x + 8))) {
                xCoord = this.generateRandomCoord(0, this.screen.width - 9)
            }
            usedXCoord.push(xCoord)
            let wordContainer = this.createWordBox(word, { x: xCoord, y: yCoord });
            this.blessed.box(wordContainer)
        })
    }

    generateRandomCoord (min, max) {
        return Math.round(Math.random() * (max - min) + min)
    }

    createWordBox(word, coords) {
        return {
            parent: this.gameContainer,
            content: `{center}${word}{/center}`,
            tags: true,
            valign: 'middle',
            top: coords.y,
            left: coords.x,
            height: 2,
            width: 12,
            style: {
                fg: 'white',
                bg: 'black',
            }
        }
    }

    gameOverToScreen(score, time, description) {
        this.gameOverContainer = this.blessed.box(this.gameOverBox)
        this.gameOverContainer.setContent(
            `{center}${description}\nScore: ${score} in ${time} secs\nPress Enter to play again{/center}`
            )
    }

    render() {
        this.screen.render()
    }


}

module.exports = { UI } 
