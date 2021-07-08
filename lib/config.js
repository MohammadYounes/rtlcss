'use strict'
let options
const config = {}
const corePlugin = require('./plugin.js')

function optionOrDefault (option, def) {
  return option in options ? options[option] : def
}

function addKey (key, def) {
  config[key] = optionOrDefault(key, def)
}

function main (opts, plugins, hooks) {
  options = opts || {}
  hooks = hooks || {}
  addKey('autoRename', false)
  addKey('autoRenameStrict', false)
  addKey('blacklist', {})
  addKey('clean', true)
  addKey('greedy', false)
  addKey('processUrls', false)
  addKey('stringMap', [])
  addKey('useCalc', false)
  addKey('aliases', {})
  addKey('processEnv', true)

  // default strings map
  if (Array.isArray(config.stringMap)) {
    let hasLeftRight, hasLtrRtl
    for (let x = 0; x < config.stringMap.length; x++) {
      const map = config.stringMap[x]
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
    config.stringMap.sort(function (a, b) { return a.priority - b.priority })
  }

  // plugins
  config.plugins = []

  if (Array.isArray(plugins)) {
    if (!plugins.some(function (plugin) { return plugin.name === 'rtlcss' })) {
      config.plugins.push(corePlugin)
    }
    config.plugins = config.plugins.concat(plugins)
  } else if (!plugins || plugins.name !== 'rtlcss') {
    config.plugins.push(corePlugin)
  }
  config.plugins.sort(function (a, b) { return a.priority - b.priority })

  // hooks
  config.hooks = { pre: function () {}, post: function () {} }
  if (typeof hooks.pre === 'function') {
    config.hooks.pre = hooks.pre
  }
  if (typeof hooks.post === 'function') {
    config.hooks.post = hooks.post
  }

  return config
}
module.exports.configure = main
