'use babel'

export default {
  'ui': {
    title: 'UI',
    description: 'Enable Browsersync UI',
    type: 'boolean',
    default: true,
    order: 1
  },
  'notify': {
    description: 'Show notifications in the browser',
    type: 'boolean',
    default: true,
    order: 2
  },
  'online': {
    description: 'Network status',
    type: 'integer',
    default: 1,
    enum: [
      {value: 0, description: 'Offline'},
      {value: 1, description: 'Auto'},
      {value: 2, description: 'Online'},
    ],
    order: 3
  },
  'port': {
    description: 'Use a specific port',
    type: 'integer',
    default: 3000,
    order: 4
  },
  'ghostMode': {
    type: 'object',
    order: 5,
    properties: {
      'clicks': {
        description: 'Mirror clicks to all devices',
        type: 'boolean',
        default: true
      },
      'scroll': {
        description: 'Mirror scrolls to all devices',
        type: 'boolean',
        default: true
      },
      'forms': {
        description: 'Mirror forms input to all devices',
        type: 'boolean',
        default: true
      },
    }
  }
}
