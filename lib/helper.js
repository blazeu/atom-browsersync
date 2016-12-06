'use babel'

import { dirname, basename } from 'path'

function getPath (path) {
  let [projectPath, filePath] = atom.project.relativizePath(path)

  if (!projectPath) {
    projectPath = filePath ? dirname(filePath) : null
    filePath = filePath ? basename(filePath) : null
  }

  return { projectPath, filePath }
}

function getActiveFile () {
  let editor = atom.workspace.getActivePaneItem()
    if (editor) {
      if (editor.file) {
        return editor.file.path
      } else if (editor.buffer && editor.buffer.file) {
        return editor.buffer.file.path
      }
    }
}

function getActiveProject () {
  return getPath(getActiveFile()).projectPath
}

function getUserConfig (projectPath) {
  let bsConfig = projectPath + '/bs-config.js'
  try {
    delete require.cache[require.resolve(bsConfig)]
    return require(bsConfig)
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

export { getPath, getActiveFile, getActiveProject, getUserConfig, onlineConfig }
