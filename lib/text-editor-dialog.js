/* global atom */
'use babel'

import { CompositeDisposable } from 'atom'

export default class TextEditorDialog {
  constructor (text) {
    this.subscriptions = new CompositeDisposable()

    this.element = document.createElement('div')

    this.label = document.createElement('label')
    this.label.innerHTML = text

    this.editor = document.createElement('atom-text-editor')
    this.editor.setAttribute('mini', true)
    this.model = this.editor.getModel()

    this.element.appendChild(this.label)
    this.element.appendChild(this.editor)

    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'core:confirm': () => this.confirm(),
      'core:cancel': () => this.detach()
    }))
  }

  attach (onConfirm) {
    this.panel = atom.workspace.addModalPanel({ item: this.element })
    this.panel.show()
    this.editor.focus()
    this.onConfirm = onConfirm
  }

  detach () {
    this.panel.destroy()
    this.subscriptions.dispose()
  }

  confirm () {
    this.onConfirm(this.model.getText())
    this.detach()
  }
}
