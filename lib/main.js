'use babel'

import { Disposable, CompositeDisposable } from 'atom'
import { shell } from 'electron'
import { parse as urlParse, resolve as urlResolve } from 'url'
import { allowUnsafeEval } from 'loophole'

import { getPath, getActiveFile, getUserConfig, onlineConfig } from './helper'
import config from './config'
import StatusBarItem from './status-bar-item'

export default {
  config,

  activate () {
    this.subscriptions = new CompositeDisposable()
    this.editorSubscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-browsersync:toggle': () => this.toggle()
    }))
  },

  deactivate () {
    this.stop()
    this.subscriptions.dispose()
  },

  toggle () {
    const browserSync = allowUnsafeEval(() => require('browser-sync'))

    if (this.bs && this.bs.active) {
      return this.stop()
    } else {
      this.bs = browserSync.create()
    }

    let path = getActiveFile()

    if (!path) {
      if (atom.project.getPaths().length === 1) {
        path = atom.project.getPaths()[0]
      } else {
        atom.notifications.addInfo('<b>Atom Browsersync</b>: Can\'t determine file path', {
          description: 'Please select a file from a project',
          dismissable: true
        })
        return
      }
    }

    let pathObj = getPath(path)
    this.projectPath = pathObj.projectPath
    this.initBs(pathObj)

    this.editorSubscriptions.add(atom.workspace.observeTextEditors((editor) => {
      this.editorSubscriptions.add(editor.onDidSave(this.handleDidSave.bind(this)))
    }))

    this.statusBarItem.setText('Starting...')
  },

  initBs (path) {
    let bsConfig = {
      server: path.projectPath,
      startPath: path.filePath,
      logLevel: 'warn'
    }

    let atomConfig = {
      ui: atom.config.get('atom-browsersync.ui'),
      notify: atom.config.get('atom-browsersync.notify'),
      online: onlineConfig(atom.config.get('atom-browsersync.online')),
      port: atom.config.get('atom-browsersync.port'),
      ghostMode: atom.config.get('atom-browsersync.ghostMode')
    }

    let userConfig = getUserConfig( getPath(getActiveFile()).projectPath )

    if (userConfig.proxy) {
      delete bsConfig.server
    }

    let config = Object.assign({}, atomConfig, bsConfig, userConfig)

    this.bs.init(config)

    this.bs.emitter.on('service:running', () => {
      let port = this.bs.getOption('port')

      this.statusBarItem.setText(port)
      this.statusBarItem.element.onclick = this.handleStatusBarClick.bind(this)
    })

    this.bs.emitter.on('service:exit', () => {
      this.statusBarItem.clearText()
      this.statusBarItem.element.onclick = null
    })
  },

  stop () {
    if (this.bs) {
      this.bs.exit()
    }
    this.editorSubscriptions.dispose()
  },

  handleDidSave (event) {
    if (!this.bs.active) return

    let { projectPath, filePath } = getPath(event.path)

    if (projectPath.includes(this.projectPath)) {
      this.bs.reload(filePath)
    }
  },

  handleStatusBarClick () {
    let url = urlParse(this.bs.getOption('urls').get('local'))
    let baseUrl = `${url.protocol}//${url.host}`

    let activeFile = getActiveFile()
    let filePath = activeFile ? getPath(activeFile).filePath : null

    if (filePath) {
      fileUrl = urlResolve(baseUrl, filePath)
    } else {
      fileUrl = baseUrl
    }

    shell.openExternal(fileUrl)
  },

  consumeStatusBar (statusBar) {
    this.statusBarItem = new StatusBarItem()

    let tile = statusBar.addRightTile({item: this.statusBarItem.element, priority: 300})
    this.subscriptions.add(new Disposable(() => tile.destroy()))
  },
}
