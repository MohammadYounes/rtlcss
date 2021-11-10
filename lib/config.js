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

function main (opts, plugins, hooks) {
  opts = opts || {}
  hooks = hooks || {}

  const config = { ...defaultOptions, ...opts }

  // default strings map
  if (Array.isArray(config.stringMap)) {
    let hasLeftRight, hasLtrRtl
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

    sort(config.stringMap)
  }

  // plugins
  config.plugins = []

  if (Array.isArray(plugins)) {
    if (!plugins.some((plugin) => plugin.name === 'rtlcss')) {
      config.plugins.push(corePlugin)
    }

    config.plugins = config.plugins.concat(plugins)
  } else if (!plugins || plugins.name !== 'rtlcss') {
    config.plugins.push(corePlugin)
  }

  sort(config.plugins)

  // hooks
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

  return config
}

module.exports.configure = main
