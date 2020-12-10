/* global process */
'use strict'
const fs = require('fs')
const path = require('path')
const findup = require('find-up')
const stripJSONComments = require('strip-json-comments')
let config = {}
const configSources = ['package.json', '.rtlcssrc', '.rtlcss.json']

module.exports.load = function (configFilePath, cwd, overrides) {
  if (configFilePath) {
    return override(
      JSON.parse(
        stripJSONComments(
          fs.readFileSync(configFilePath, 'utf-8').trim())), overrides)
  }

  const directory = cwd || process.cwd()
  config = loadConfig(directory)
  if (!config) {
    const evns = [process.env.USERPROFILE, process.env.HOMEPATH, process.env.HOME]
    for (let x = 0; x < evns.length; x++) {
      if (!evns[x]) {
        continue
      }
      config = loadConfig(evns[x])
      if (config) {
        break
      }
    }
  }

  if (config) {
    override(config, overrides)
  }
  return config
}

function loadConfig (dir) {
  for (let x = 0; x < configSources.length; x++) {
    let found
    const source = configSources[x]
    try {
      found = findup.sync(dir, source)
    } catch (e) {
      continue
    }

    if (found) {
      const configFilePath = path.normalize(path.join(found, source))
      try {
        config = JSON.parse(
          stripJSONComments(
            fs.readFileSync(configFilePath, 'utf-8').trim()))
      } catch (e) {
        throw new Error(e + ' ' + configFilePath)
      }

      if (source === 'package.json') {
        config = config.rtlcssConfig
      }

      if (config) {
        return config
      }
    }
  }
}

function override (to, from) {
  if (to && from) {
    for (const p in from) {
      if (typeof to[p] === 'object') {
        override(to[p], from[p])
      } else {
        to[p] = from[p]
      }
    }
  }
  return to
}
