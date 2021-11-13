'use strict'

const corePlugin = require('./plugin.js')

const defaultOptions = {
  autoRename: false,
  autoRenameStrict: false,
  blacklist: {},
  clean: true,
  greedy: false,
  processUrls: false,
  stringMap: [],
  useCalc: false,
  aliases: {},
  processEnv: true
}

function sort (arr) {
  return arr.sort((a, b) => a.priority - b.priority)
}

function setupStringMap (config) {
  if (!Array.isArray(config.stringMap)) {
    return
  }

  let hasLeftRight = false
  let hasLtrRtl = false

  for (const map of config.stringMap) {
    if (hasLeftRight && hasLtrRtl) {
      break
    } else if (map.name === 'left-right') {
      hasLeftRight = true
    } else if (map.name === 'ltr-rtl') {
      hasLtrRtl = true
    }
  }

  if (!hasLeftRight) {
    config.stringMap.push({
      name: 'left-right',
      priority: 100,
      exclusive: false,
      search: ['left', 'Left', 'LEFT'],
      replace: ['right', 'Right', 'RIGHT'],
      options: { scope: '*', ignoreCase: false }
    })
  }

  if (!hasLtrRtl) {
    config.stringMap.push({
      name: 'ltr-rtl',
      priority: 100,
      exclusive: false,
      search: ['ltr', 'Ltr', 'LTR'],
      replace: ['rtl', 'Rtl', 'RTL'],
      options: { scope: '*', ignoreCase: false }
    })
  }

  return sort(config.stringMap)
}

function setupPlugins (config, plugins) {
  config.plugins = []

  if (!plugins || !plugins.some((plugin) => plugin.name === 'rtlcss')) {
    config.plugins.push(corePlugin)
  }

  return sort([...config.plugins, ...plugins])
}

function setupHooks (config, hooks) {
  config.hooks = {
    pre () {},
    post () {}
  }

  if (typeof hooks.pre === 'function') {
    config.hooks.pre = hooks.pre
  }

  if (typeof hooks.post === 'function') {
    config.hooks.post = hooks.post
  }

  return config.hooks
}

module.exports.configure = (opts = {}, plugins = [], hooks = {}) => {
  const config = { ...defaultOptions, ...opts }

  // string map
  config.stringMap = setupStringMap(config)
  // plugins
  config.plugins = setupPlugins(config, plugins)
  // hooks
  config.hooks = setupHooks(config, hooks)

  return config
}
