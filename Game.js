const { WORDS, COLORS, GAME_SPEED } = require('./constants.js')

class Game {
  constructor(ui) {
    this.ui = ui
    this.times = { start: 0, finish: 0 }

    this.currentWordIndex = 0
    this.currentLetterIndex = 0
    this.inputLetter = ''
    this.score = 0
    this.timer = null
    this.roundFinished = false

    this.ui.bindHandlers(
      this.keyInput.bind(this),
      this.quit.bind(this),
      this.reset.bind(this)
    )
  }

  reset() {
    this.currentWordIndex = 0
    this.currentLetterIndex = 0
    this.inputLetter = ''
    this.score = 0
    clearInterval(this.timer)
    this.roundFinished = false
    
    this.ui.clearScreen()
    this.ui.createWordContainers()

    this.start()
  }

  removeWords() {
    this.ui.gameContainer.children.forEach(e => e.detach())
  }

  keyInput(_, key) {
    if (!this.roundFinished) {
      this.inputLetter = key.name;      

      if (this.isLetterCorrect()) {
        this.currentLetterIndex++;
        // reach end of word
        if (this.isEndOfCurrentWord()) {
          this.ui.gameContainer.children[this.currentWordIndex].hide();
          this.currentWordIndex++;
          this.currentLetterIndex = 0;
          this.score++
          this.fillProgressBar()
          // reach end of list of words
          if (this.isEndOfWordsList()) {
            this.times.finish = new Date()
            clearInterval(this.timer)
            // this.ui.gameContainer.detach();
            this.showGameOver('You typed all words')
          } else {
            // if last word in list not reached highlight next word         
            this.highlightCurrentWord()
          }
        }
      } else {
        // game over screen
        this.times.finish = new Date()
        clearInterval(this.timer)
        // this.ui.gameContainer.detach()
        this.showGameOver('Game over: you typed the wrong letter')
      }

      this.ui.render()
    }

  }

  moveWordsUp() {

    this.ui.gameContainer.children.forEach((wordBox, ind) => {
      if (wordBox.top <= 1) {
        // collides with top of screen
        wordBox.hide()
        if (ind === this.currentWordIndex) {
          // if is the highlighted word change and highlight next
          this.currentWordIndex++
          this.currentLetterIndex = 0
          if (this.isEndOfWordsList()) {
            // no more words left to highlight
            // game is over
            this.times.finish = new Date();
            this.roundFinished = true
            clearInterval(this.timer)
            // this.ui.gameContainer.detach();
            this.showGameOver('Game over: reached last word')
          } else {
            this.highlightCurrentWord()
          }
        }
      } else {
        wordBox.top -= 2
      }
    });
    this.ui.render();
  }

  fillProgressBar() {
    let progress = Math.round((this.currentWordIndex / WORDS.length) * 100)
    this.ui.bottomContainer.setProgress(progress)
  }

  highlightCurrentWord() {
    this.ui.gameContainer.children[this.currentWordIndex].style.bg = 'magenta'
  }

  showGameOver(msg) {
    this.ui.gameOverToScreen(this.score, this.getTimeDiff(), msg)
  }

  isEndOfCurrentWord() {
    return this.currentLetterIndex >= WORDS[this.currentWordIndex].length
  }

  isEndOfWordsList() {
    return this.currentWordIndex >= WORDS.length
  }

  isLetterCorrect() {
    return this.inputLetter === WORDS[this.currentWordIndex][this.currentLetterIndex]
  }

  getTimeDiff() {
    return ((this.times.finish - this.times.start) / 1000)
  }

  start() {
    this.times.start = new Date()
    this.highlightCurrentWord()
    this.ui.render()
    this.timer = setInterval(this.moveWordsUp.bind(this), GAME_SPEED)
  }

  quit() {
    process.exit(0)
  }
}

module.exports = { Game }