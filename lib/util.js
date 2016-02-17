'use strict'
var config
var REPLACEMENT_CHARACTER = '\uFFFD'
var REGEX_REPLACEMENT_CHARACTER_PLACEHOLDER = /\uFFFD/ig
var PATTERN_NUMBER = '\\-?(\\d*?\\.\\d+|\\d+)'
var PATTERN_PLACEHOLDER = '\u00AB\\d+\u00BB' // «offset»
var REGEX_DIRECTIVE = /\/\*(?:!)?rtl:[^]*?\*\//img
var REGEX_ESCAPE = /[.*+?^${}()|[\]\\]/g
var REGEX_HEX_COLOR = /#[a-f0-9]{3,6}/ig
var REGEX_COMMENT = /\/\*[^]*?\*\//igm // none-greedy
var REGEX_FUNCTION = /\([^\(\)]+\)/i
var REGEX_TOKEN = new RegExp(PATTERN_PLACEHOLDER + '(\\d+)', 'i')
var REGEX_COMPLEMENT = new RegExp('(calc' + PATTERN_PLACEHOLDER + '\\d+)|(' + PATTERN_NUMBER + ')(?!d\\()', 'i')
var REGEX_NEGATE_ONE = new RegExp('(calc' + PATTERN_PLACEHOLDER + '\\d+)|(' + PATTERN_NUMBER + ')(?!d\\()', 'i')
var REGEX_NEGATE_ALL = new RegExp('(calc' + PATTERN_PLACEHOLDER + '\\d+)|(' + PATTERN_NUMBER + ')(?!d\\()', 'ig')
var DEFAULT_STRING_MAP_OPTIONS = { scope: '*', ignoreCase: true }
var TOKEN_ID = 0

function compare (what, to, ignoreCase) {
  if (ignoreCase) {
    return what.toLowerCase() === to.toLowerCase()
  }
  return what === to
}

function escapeRegExp (string) {
  return string.replace(REGEX_ESCAPE, '\\$&')
}

module.exports = {
  extend: function (dest, src) {
    if (typeof dest === 'undefined' || typeof dest !== 'object') {
      dest = {}
    }
    for (var prop in src) {
      if (!dest.hasOwnProperty(prop)) {
        dest[prop] = src[prop]
      }
    }
    return dest
  },
  swap: function (value, a, b, options) {
    var expr = escapeRegExp(a) + '|' + escapeRegExp(b)
    options = options || DEFAULT_STRING_MAP_OPTIONS
    var greedy = options.hasOwnProperty('greedy') ? options.greedy : config.greedy
    if (!greedy) {
      expr = '\\b(' + expr + ')\\b'
    }
    var flags = options.ignoreCase ? 'img' : 'mg'
    return value.replace(new RegExp(expr, flags), function (m) { return compare(m, a, options.ignoreCase) ? b : a })
  },
  swapLeftRight: function (value) {
    return this.swap(value, 'left', 'right')
  },
  swapLtrRtl: function (value) {
    return this.swap(value, 'ltr', 'rtl')
  },
  applyStringMap: function (value, isUrl) {
    var result = value
    for (var x = 0; x < config.stringMap.length; x++) {
      var map = config.stringMap[x]
      var options = this.extend(map.options, DEFAULT_STRING_MAP_OPTIONS)
      if (options.scope === '*' || (isUrl && options.scope === 'url') || (!isUrl && options.scope === 'selector')) {
        if (Array.isArray(map.search) && Array.isArray(map.replace)) {
          for (var mapIndex = 0; mapIndex < map.search.length; mapIndex++) {
            result = this.swap(result, map.search[mapIndex], map.replace[mapIndex % map.search.length], options)
          }
        } else {
          result = this.swap(result, map.search, map.replace, options)
        }
        if (map.exclusive === true) {
          break
        }
      }
    }
    return result
  },
  comments: [],
  saveComments: function (value) {
    return value.replace(REGEX_COMMENT, function (c) { this.comments.push(c); return REPLACEMENT_CHARACTER }.bind(this))
  },
  restoreComments: function (value) {
    var index = 0
    var result = value.replace(REGEX_REPLACEMENT_CHARACTER_PLACEHOLDER, function () {
      return this.comments[index++]
    }.bind(this))
    this.comments.length = 0
    return result
  },
  negate: function (value) {
    return value.replace(REGEX_NEGATE_ONE, function (num) {
      return REGEX_TOKEN.test(num) ? num.replace(REGEX_TOKEN, function (m) { return '(-1*' + m + ')' }) : parseFloat(num, 10) * -1
    })
  },
  negateAll: function (value) {
    return value.replace(REGEX_NEGATE_ALL, function (num) {
      return REGEX_TOKEN.test(num) ? num.replace(REGEX_TOKEN, function (m) { return '(-1*' + m + ')' }) : parseFloat(num, 10) * -1
    })
  },
  complement: function (value) {
    return value.replace(REGEX_COMPLEMENT, function (num) {
      return REGEX_TOKEN.test(num) ? num.replace(REGEX_TOKEN, function (m) { return '(100%-' + m + ')' }) : 100 - parseFloat(num, 10)
    })
  },
  guard: function (what, who, indexed) {
    var state = {
      value: who,
      store: [],
      offset: TOKEN_ID++,
      token: '\u00AB' + TOKEN_ID + '\u00BB',
      indexed: indexed === true
    }
    if (state.indexed === true) {
      while (what.test(state.value)) {
        state.value = state.value.replace(what, function (m) { state.store.push(m); return state.token + state.store.length })
      }
    } else {
      state.value = state.value.replace(what, function (m) { state.store.push(m); return state.token })
    }
    return state
  },
  unguard: function (state, callback) {
    if (state.indexed === true) {
      var detokenizer = new RegExp('(\\w*?)' + state.token + '(\\d+)', 'i')
      while (detokenizer.test(state.value)) {
        state.value = state.value.replace(detokenizer, function (match, name, index) {
          var value = state.store[index - 1]
          if (typeof callback === 'function') {
            return name + callback(value, name)
          }
          return name + value
        })
      }
      return state.value
    } else {
      return state.value.replace(new RegExp('(\\w*?)' + state.token, 'i'), function (match, name) {
        var value = state.store.shift()
        if (typeof callback === 'function') {
          return name + callback(value, name)
        }
        return name + value
      })
    }
  },
  saveHexColors: function (value) {
    return this.guard(REGEX_HEX_COLOR, value, true)
  },
  restoreHexColors: function (state, callback) {
    return this.unguard(state, callback)
  },
  saveFunctions: function (value) {
    return this.guard(REGEX_FUNCTION, value, true)
  },
  restoreFunctions: function (state, callback) {
    return this.unguard(state, callback)
  },
  trimDirective: function (value) {
    return value.replace(REGEX_DIRECTIVE, '')
  },
  regexCache: {},
  regexDirective: function (name) {
    // /(?:\/\*(?:!)?rtl:ignore(?::)?)([^]*?)(?:\*\/)/img
    this.regexCache[name] = this.regexCache[name] || new RegExp('(?:\\/\\*(?:!)?rtl:' + (name ? escapeRegExp(name) + '(?::)?' : '') + ')([^]*?)(?:\\*\\/)', 'img')
    return this.regexCache[name]
  },
  regex: function (what, options) {
    what = what || []
    var expression = ''
    for (var x = 0; x < what.length; x++) {
      switch (what[x]) {
        case 'percent':
          expression += '|(' + PATTERN_NUMBER + '%)'
          break
        case 'length':
          expression += '|(' + PATTERN_NUMBER + ')(?:ex|ch|r?em|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc)?'
          break
        case 'number':
          expression += '|(' + PATTERN_NUMBER + ')'
          break
        case 'position':
          expression += '|(left|center|right|top|bottom)'
          break
        case 'calc':
          expression += '|(calc' + PATTERN_PLACEHOLDER + '\\d+)'
          break
      }
    }
    return new RegExp(expression.slice(1), options)
  },
  isLastOfType: function (node) {
    var isLast = true
    var next = node.next()
    while (next) {
      if (next && next.type === node.type) {
        isLast = false
        break
      }
      next = next.next()
    }
    return isLast
  },
  /**
   * Simple breakable each: returning false in the callback will break the loop
   * returns false if the loop was broken, otherwise true
   */
  each: function (array, callback) {
    for (var len = 0; len < array.length; len++) {
      if (callback(array[len]) === false) {
        return false
      }
    }
    return true
  }
}

module.exports.configure = function (configuration) {
  config = configuration
  return this
}
