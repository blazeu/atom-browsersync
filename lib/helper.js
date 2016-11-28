'use babel'

import { dirname, basename } from 'path'

function getPath (path) {
  let [projectPath, filePath] = atom.project.relativizePath(path)

  if (!projectPath) {
    projectPath = dirname(filePath)
    filePath = basename(filePath)
  }

  return { projectPath, filePath }
}

function getActiveFile () {
  let editor = atom.workspace.getActivePaneItem()
    if (editor.file) {
      return editor.file.path
    } else if (editor.buffer && editor.buffer.file) {
      return editor.buffer.file.path
    }
}

function getUserConfig (projectPath) {
  try {
    return require(projectPath + '/bs-config.js')
  } catch(err) {
    return {}
  }
}

function onlineConfig (value) {
  switch (value) {
    case 0:
      return false
      break;
    case 1:
      return undefined
      break;
    case 2:
      return true
      break;
  }
}

export { getPath, getActiveFile, getUserConfig, onlineConfig }
