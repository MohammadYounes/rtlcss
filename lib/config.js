function main (options, plugins) {
  if (!options) {
    options = {}
  }

  function optionOrDefault (option, def) {
    return option in options ? options[option] : def
  }

  var config = {}
  function addKey (key, def) {
    config[key] = optionOrDefault(key, def)
  }
  addKey('autoRename', false)
  addKey('greedy', false)
  addKey('log', false)
  addKey('preserveComments', true)
  addKey('preserveDirectives', false)
  addKey('processUrls', false)
  addKey('stringMap', [])

  // default strings map
  if (Array.isArray(config.stringMap)) {
    if (!config.stringMap.some(function (map) { return map.name === 'left-right' })) {
      config.stringMap.push({
        'name': 'left-right',
        'priority': 100,
        'exclusive': false,
        'search': ['left', 'Left', 'LEFT'],
        'replace': ['right', 'Right', 'RIGHT'],
        'options': { 'scope': '*', 'ignoreCase': false }
      })
    }

    if (!config.stringMap.some(function (map) { return map.name === 'ltr-rtl' })) {
      config.stringMap.push({
        'name': 'ltr-rtl',
        'priority': 100,
        'exclusive': false,
        'search': ['ltr', 'Ltr', 'LTR'],
        'replace': ['rtl', 'Rtl', 'RTL'],
        'options': { 'scope': '*', 'ignoreCase': false }
      })
    }
    config.stringMap.sort(function (a, b) { return a.priority - b.priority })
  }

  // plugins
  config.plugins = []

  var corePlugin = require('./plugin.js')

  if (Array.isArray(plugins)) {
    if (!plugins.some(function (plugin) { return plugin.name === 'rtlcss' })) {
      config.plugins.push(corePlugin)
    }
    config.plugins = config.plugins.concat(plugins)
  } else if (!plugins || plugins.name !== 'rtlcss') {
    config.plugins.push(corePlugin)
  }
  config.plugins.sort(function (a, b) { return a.priority - b.priority })
  return config
}
module.exports.configure = main
