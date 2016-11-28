'use babel'

export default class StatusBarItem {
  constructor () {
    this.element = document.createElement('a')
    this.element.className = 'inline-block'
  }

  setText (text) {
    this.element.textContent = `Browsersync: ${text}`
  }

  clearText (text) {
    this.element.textContent = ''
  }
}
