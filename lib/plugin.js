module.exports = (function () {
  return {
    'name': 'rtl',
    'priority': 100,
    'control': {
      'ignore': {
        'expect': {'rule': true, 'decl': true},
        'begin': function (node, cxt) {
          cxt.lockContainer()
          return true
        },
        'end': function (node, cxt) {
          if (cxt.meta.begin !== cxt.meta.end && cxt.util.isLastDecl(node)) {
            cxt.unlockContainer()
            return true
          }
          return false
        }
      },
      'rename': {
        'expect': {'rule': true},
        'begin': function (node, cxt) {
          var renamed = cxt.util.applyStringMap(node.selector, true, false)
          if (renamed !== node.selector) {
            node.selector = renamed
          }
          return false
        },
        'end': function (node, cxt) {
          return true
        }
      },
      'raw': {
        'expect': {'comment': true},
        'begin': function (node, cxt) {
          var nodes = cxt.postcss.parse(cxt.meta.param)
          node.parent.insertBefore(node, nodes)
          return true
        },
        'end': function (node, cxt) {
          return true
        }
      },
      'remove': {
        'expect': {'rule': true, 'decl': true},
        'begin': function (node, cxt) {
          cxt.lockContainer()
          node.remove()
          return true
        },
        'end': function (node, cxt) {
          cxt.unlockContainer()
          return true
        }
      },
      'options': {
        'expect': {'comment': true},
        'stack': [],
        'begin': function (node, cxt) {
          this.stack.push({ config: cxt.config, util: cxt.util })
          var options = JSON.parse(cxt.meta.param)
          cxt.config = require('./config.js').configure(options, cxt.config.plugins)
          cxt.util = require('./util.js').configure(cxt.config)
          return true
        },
        'end': function (node, cxt) {
          var item = this.stack.pop()
          if (item) {
            cxt.config = item.config
            cxt.util = item.util
          }
          return true
        }
      }

    },
    'property': [
      {
        'name': 'direction',
        'expr': /direction/im,
        'action': function (prop, value, cxt) {
          return { 'prop': prop, 'value': cxt.util.swapLtrRtl(value) }
        }
      },
      {
        'name': 'left',
        'expr': /left/im,
        'action': function (prop, value, cxt) {
          return { 'prop': prop.replace(this.expr, function () { return 'right' }), 'value': value }
        }
      },
      {
        'name': 'right',
        'expr': /right/im,
        'action': function (prop, value, cxt) {
          return { 'prop': prop.replace(this.expr, function () { return 'left' }), 'value': value }
        }
      },
      {
        'name': 'four-value syntax',
        'expr': /^(margin|padding|border-(color|style|width))$/ig,
        'match': /[^\s]+/g,
        'action': function (prop, value, cxt) {
          var tokens = cxt.util.saveFunctions(value)
          var result = tokens.value.match(this.match)
          if (result && result.length === 4 && (tokens.store.length > 0 || result[1] !== result[3])) {
            var i = 0
            tokens.value = tokens.value.replace(this.match, function () {
              return result[(4 - i++) % 4]
            })
          }
          return { 'prop': prop, 'value': cxt.util.restoreFunctions(tokens) }
        }
      },
      {
        'name': 'border radius',
        'expr': /border-radius/ig,
        'match': /[^\s]+/g,
        'slash': /[^\/]+/g,
        'flip': function (value) {
          var parts = value.match(this.match)
          var i
          if (parts) {
            switch (parts.length) {
              case 2:
                i = 1
                if (parts[0] !== parts[1]) {
                  return value.replace(this.match, function () {
                    return parts[i--]
                  })
                }
                break
              case 3:
                // preserve leading whitespace.
                return value.replace(/(^\s*)/, function (m) {
                  return m + parts[1] + ' '
                })
              case 4:
                i = 0
                if (parts[0] !== parts[1] || parts[2] !== parts[3]) {
                  return value.replace(this.match, function () {
                    return parts[(5 - i++) % 4]
                  })
                }
            }
          }
          return value
        },
        'action': function (prop, value, cxt) {
          var self = this
          var tokens = cxt.util.saveFunctions(value)
          tokens.value = tokens.value.replace(this.slash, function (m) {
            return self.flip(m)
          })
          return { 'prop': prop, 'value': cxt.util.restoreFunctions(tokens) }
        }
      },
      {
        'name': 'shadow',
        'expr': /shadow/ig,
        'replace': /(\-?(\d*?\.\d+|\d+))/i,
        'other': /#[a-f0-9]{3,6}/ig,
        'others': [],
        'saveOthers': function (value) {
          var self = this
          return value.replace(this.other, function (m) { self.others.push(m); return 'temp' })
        },
        'restoreOthers': function (value) {
          var self = this
          return value.replace(/temp/ig, function () { return self.others.shift() })
        },
        'action': function (prop, value, cxt) {
          var tokens = cxt.util.saveFunctions(this.saveOthers(value))
          tokens.value = tokens.value.replace(/[^,]+/g, function (m) {
            return cxt.util.negate(m)
          })
          return { 'prop': prop, 'value': this.restoreOthers(cxt.util.restoreFunctions(tokens)) }
        }
      },
      {
        'name': 'transform origin',
        'expr': /transform-origin/ig,
        'percent': /calc|%/i,
        'xKeyword': /(left|right)/i,
        'yKeyword': /(center|top|bottom)/i,
        'match': function (cxt) { return cxt.util.regex(['calc', 'percent', 'length'], 'g') },
        'flip': function (value, cxt) {
          if (value === '0') {
            return '100%'
          } else if (value.match(this.percent)) {
            return cxt.util.complement(value)
          }
          return value
        },
        'action': function (prop, value, cxt) {
          var newValue = value
          if (value.match(this.xKeyword)) {
            newValue = cxt.util.swapLeftRight(value)
          } else {
            var tokens = cxt.util.saveFunctions(value)
            var parts = tokens.value.match(this.match(cxt))
            if (parts && parts.length > 0) {
              parts[0] = this.flip(parts[0], cxt)
              tokens.value = tokens.value.replace(this.match(cxt), function () { return parts.shift() })
              newValue = cxt.util.restoreFunctions(tokens)
            }
          }
          return { 'prop': prop, 'value': newValue }
        }
      },
      {
        'name': 'transform',
        'expr': /^(?!text\-).*?transform$/ig,
        'match': /((translate)(x|3d)?|skew(x|y)?|rotate(z|3d)?|matrix(3d)?)\((.|\s)*\)/ig,
        'matrix': /matrix/i,
        'flip': function (value, process, cxt) {
          var replace = cxt.util.regex(['calc', 'number'], 'ig')
          var i = 0
          return value.replace(replace, function (num) {
            return process(++i, num)
          })
        },
        'flipMatrix': function (value, cxt) {
          return this.flip(value, function (i, num) {
            if (i === 2 || i === 3 || i === 5) {
              return cxt.util.negate(num)
            }
            return num
          }, cxt)
        },
        'matrix3D': /matrix3d/i,
        'flipMatrix3D': function (value, cxt) {
          return this.flip(value, function (i, num) {
            if (i === 2 || i === 4 || i === 5 || i === 13) {
              return cxt.util.negate(num)
            }
            return num
          }, cxt)
        },
        'rotate3D': /rotate3d/i,
        'flipRotate3D': function (value, cxt) {
          return this.flip(value, function (i, num) {
            if (i === 2 || i === 4) {
              return cxt.util.negate(num)
            }
            return num
          }, cxt)
        },
        'skewXY': /skew(x|y)?/i,
        'action': function (prop, value, cxt) {
          var self = this
          var parts = value.match(this.match)
          for (var x = 0; parts && x < parts.length; x++) {
            parts[x] = parts[x].replace(/([^\(]*)(?:\()(.*)(?:\))/i, function (m, $1, $2) {
              var tokens = cxt.util.saveFunctions($2)
              if ($1.match(self.matrix3D)) {
                tokens.value = self.flipMatrix3D(tokens.value, cxt)
              } else if ($1.match(self.matrix)) {
                tokens.value = self.flipMatrix(tokens.value, cxt)
              } else if ($1.match(self.rotate3D)) {
                tokens.value = self.flipRotate3D(tokens.value, cxt)
              } else if ($1.match(self.skewXY)) {
                tokens.value = cxt.util.negateAll(tokens.value)
              } else {
                tokens.value = cxt.util.negate(tokens.value)
              }
              return $1 + '(' + cxt.util.restoreFunctions(tokens) + ')'
            })
          }
          return { 'prop': prop, 'value': value.replace(this.match, function () { return parts.shift() }) }
        }
      },
      {
        'name': 'transition',
        'expr': /transition(-property)?$/i,
        'action': function (prop, value, cxt) {
          return { 'prop': prop, 'value': cxt.util.swapLeftRight(value) }
        }
      },
      {
        'name': 'background',
        'expr': /background(-position(-x)?|-image)?$/i,
        'match': function (cxt) { return cxt.util.regex(['position', 'percent', 'length', 'calc'], 'i') },
        'percent': /calc|%/,
        'other': /url\([^]*?\)|#[0-9a-f]{3,6}|hsl(a?)\([^]*?\)|rgb(a?)\([^]*?\)|color-stop\([^]*?\)|\b.*?gradient\([^]*\)/ig,
        'others': [],
        'saveOthers': function (value) {
          var self = this
          return value.replace(this.other, function (m) { self.others.push(m); return 'temp' })
        },
        'restoreOthers': function (value, cxt) {
          var self = this
          return value.replace(/temp/ig, function () {
            var item = self.others.shift()
            if (item.match(/.*?gradient/)) {
              item = cxt.util.swapLeftRight(item)
              if (item.match(/\d+(deg|g?rad|turn)/i)) {
                item = cxt.util.negate(item)
              }
            } else if (item.match(/^url/i)) {
              item = cxt.util.applyStringMap(item, false, true)
            }
            return item
          })
        },
        'flip': function (value, cxt) {
          var parts = value.match(this.match(cxt))
          if (parts && parts.length > 0) {
            parts[0] = parts[0] === '0' ? '100%' : (parts[0].match(this.percent) ? cxt.util.complement(parts[0]) : cxt.util.swapLeftRight(parts[0]))
            return value.replace(this.match(cxt), function () { return parts.shift() })
          }
          return value
        },
        'action': function (prop, value, cxt) {
          var newValue = this.saveOthers(value)
          var tokens = cxt.util.saveFunctions(newValue)
          var parts = tokens.value.split(',')
          if (prop.toLowerCase() !== 'background-image') {
            for (var x = 0; x < parts.length; x++) {
              parts[x] = this.flip(parts[x], cxt)
            }
          }
          tokens.value = parts.join(',')
          newValue = cxt.util.restoreFunctions(tokens)
          return { 'prop': prop, 'value': this.restoreOthers(newValue, cxt) }
        }
      },
      {
        'name': 'keyword',
        'expr': /float|clear|text-align/i,
        'action': function (prop, value, cxt) {
          return { 'prop': prop, 'value': cxt.util.swapLeftRight(value) }
        }
      },
      {
        'name': 'cursor',
        'expr': /cursor/i,
        'replace': /\b([news]{1,4})-resize/ig,
        'other': /url\(.*?\)/ig,
        'others': [],
        'saveOthers': function (value) {
          var self = this
          return value.replace(this.other, function (m) { self.others.push(m); return 'temp' })
        },
        'restoreOthers': function (value, cxt) {
          var self = this
          return value.replace(/temp/ig, function () {
            var item = self.others.shift()

            if (item.match(/^url/i)) {
              item = cxt.util.applyStringMap(item, false, true)
            }

            return item
          })
        },
        'flip': function (value) {
          return value.replace(this.replace, function (s, m) { return s.replace(m, m.replace(/e/i, '*').replace(/w/i, 'e').replace(/\*/i, 'w')) })
        },
        'action': function (prop, value, cxt) {
          var newValue = this.saveOthers(value)
          var parts = newValue.split(',')
          for (var x = 0; x < parts.length; x++) {
            parts[x] = this.flip(parts[x])
          }
          newValue = this.restoreOthers(parts.join(','), cxt)
          return { 'prop': prop, 'value': newValue }
        }
      }
    ],
    'value': [
      {
        'name': 'ignore',
        'expr': /(?:[^]*)(?:\/\*(?:!)?rtl:ignore)([^]*?)(?:\*\/)/img,
        'action': function (decl, cxt) {
          if (!cxt.config.preserveDirectives) {
            decl.raws.value.raw = decl.raws.value.raw.replace(/\/\*(?:!)?rtl:[^]*?\*\//img, '')
          }
          return true
        }
      },
      {
        'name': 'prepend',
        'expr': /(?:[^]*)(?:\/\*(?:!)?rtl:prepend:)([^]*?)(?:\*\/)/img,
        'replace': /\/\*(?:!)?rtl:[^]*?\*\//img,
        'action': function (decl, cxt) {
          this.expr.lastIndex = 0
          var newValue = this.expr.exec(decl.raws.value.raw)[1]
          if (cxt.config.preserveComments) {
            decl.raws.value.raw = newValue + (cxt.config.preserveDirectives ? decl.raws.value.raw : decl.raws.value.raw.replace(this.replace, ''))
          } else {
            decl.value = newValue + decl.value
          }
          return true
        }
      },
      {
        'name': 'append',
        'expr': /(?:[^]*)(?:\/\*(?:!)?rtl:append:)([^]*?)(?:\*\/)/img,
        'replace': /\/\*(?:!)?rtl:[^]*?\*\/(?:\s*)/img,
        'action': function (decl, cxt) {
          this.expr.lastIndex = 0
          var newValue = this.expr.exec(decl.raws.value.raw)[1]
          if (cxt.config.preserveComments) {
            decl.raws.value.raw = (cxt.config.preserveDirectives ? decl.raws.value.raw : decl.raws.value.raw.replace(this.replace, '')) + newValue
          } else {
            decl.value += newValue
          }
          return true
        }
      },
      {
        'name': 'insert',
        'expr': /(?:\/\*(?:!)?rtl:insert:)([^]*?)(?:\*\/)/img,
        'replace': /\/\*(?:!)?rtl:[^]*?\*\//img,
        'action': function (decl, cxt) {
          this.expr.lastIndex = 0
          var result = this.expr.exec(decl.raws.value.raw)
          var directive = result[0]
          var newValue = result[1]
          if (cxt.config.preserveComments) {
            decl.raws.value.raw = decl.raws.value.raw.replace(this.replace, newValue + (cxt.config.preserveDirectives ? directive : ''))
          } else {
            decl.value = decl.raws.value.raw.replace(this.replace, newValue)
          }
          return true
        }
      },
      {
        'name': 'replace',
        'expr': /(?:\/\*(?:!)?rtl:)([^]*?)(?:\*\/)/img,
        'action': function (decl, cxt) {
          this.expr.lastIndex = 0
          var result = this.expr.exec(decl.raws.value.raw)
          var directive = result[0]
          var newValue = result[1]
          decl.value = newValue + (cxt.config.preserveDirectives ? directive : '')
          return true
        }
      }
    ]
  }
})()
