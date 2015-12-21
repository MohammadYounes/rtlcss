module.exports = (function () {
  return {
    'name': 'rtl',
    'priority': 100,
    'control': {
      'ignore': {
        'expect': {'rule': true, 'decl': true},
        'begin': function (node, context) {
          context.skip = {'rule': true, 'decl': true}
          return true
        },
        'end': function (node, context) {
          // end if triggered by comment or last declaration is reached
          if (node.type === 'comment' || node.type === 'decl' && context.util.isLastOfType(node)) {
            context.skip = {}
            return true
          }
          return false
        }
      },
      'rename': {
        'expect': {'rule': true},
        'begin': function (node, context) {
          var renamed = context.util.applyStringMap(node.selector, true, false)
          if (renamed !== node.selector) {
            node.selector = renamed
          }
          return false
        },
        'end': function (node, context) {
          return true
        }
      },
      'raw': {
        'expect': {'comment': true},
        'begin': function (node, context) {
          var nodes = context.postcss.parse(context.directive.param)
          node.parent.insertBefore(node, nodes)
          return true
        },
        'end': function (node, context) {
          return true
        }
      },
      'remove': {
        'expect': {'rule': true, 'decl': true},
        'begin': function (node, context) {
          context.skip = {'rule': true, 'decl': true}
          node.remove()
          return true
        },
        'end': function (node, context) {
          context.skip = {}
          return true
        }
      },
      'options': {
        'expect': {'comment': true},
        'stack': [],
        'begin': function (node, context) {
          this.stack.push({ config: context.config, util: context.util })
          var options = JSON.parse(context.directive.param)
          context.config = require('./config.js').configure(options, context.config.plugins)
          context.util = require('./util.js').configure(context.config)
          return true
        },
        'end': function (node, context) {
          var item = this.stack.pop()
          if (item) {
            context.config = item.config
            context.util = item.util
          }
          return true
        }
      }

    },
    'property': [
      {
        'name': 'direction',
        'expr': /direction/im,
        'action': function (prop, value, context) {
          return { 'prop': prop, 'value': context.util.swapLtrRtl(value) }
        }
      },
      {
        'name': 'left',
        'expr': /left/im,
        'action': function (prop, value, context) {
          return { 'prop': prop.replace(this.expr, function () { return 'right' }), 'value': value }
        }
      },
      {
        'name': 'right',
        'expr': /right/im,
        'action': function (prop, value, context) {
          return { 'prop': prop.replace(this.expr, function () { return 'left' }), 'value': value }
        }
      },
      {
        'name': 'four-value syntax',
        'expr': /^(margin|padding|border-(color|style|width))$/ig,
        'match': /[^\s\uFFFD]+/g,
        'action': function (prop, value, context) {
          var tokens = context.util.saveFunctions(value)
          var result = tokens.value.match(this.match)
          if (result && result.length === 4 && (tokens.store.length > 0 || result[1] !== result[3])) {
            var i = 0
            tokens.value = tokens.value.replace(this.match, function () {
              return result[(4 - i++) % 4]
            })
          }
          return { 'prop': prop, 'value': context.util.restoreFunctions(tokens) }
        }
      },
      {
        'name': 'border radius',
        'expr': /border-radius/ig,
        'match': /[^\s\uFFFD]+/g,
        'slash': /[^\/]+/g,
        'white': /(^\s*)/,
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
                return value.replace(this.white, function (m) {
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
        'action': function (prop, value, context) {
          var self = this
          var tokens = context.util.saveFunctions(value)
          tokens.value = tokens.value.replace(this.slash, function (m) {
            return self.flip(m)
          })
          return { 'prop': prop, 'value': context.util.restoreFunctions(tokens) }
        }
      },
      {
        'name': 'shadow',
        'expr': /shadow/ig,
        'replace': /[^,]+/g,
        'action': function (prop, value, context) {
          var colorSafe = context.util.saveHexColors(value)
          var funcSafe = context.util.saveFunctions(colorSafe.value)
          funcSafe.value = funcSafe.value.replace(this.replace, function (m) { return context.util.negate(m) })
          colorSafe.value = context.util.restoreFunctions(funcSafe)
          return { 'prop': prop, 'value': context.util.restoreHexColors(colorSafe) }
        }
      },
      {
        'name': 'transform origin',
        'expr': /transform-origin/ig,
        'percent': /calc|%/i,
        'xKeyword': /(left|right)/i,
        'match': function (context) { return context.util.regex(['calc', 'percent', 'length'], 'g') },
        'flip': function (value, context) {
          if (value === '0') {
            return '100%'
          } else if (value.match(this.percent)) {
            return context.util.complement(value)
          }
          return value
        },
        'action': function (prop, value, context) {
          var newValue = value
          if (value.match(this.xKeyword)) {
            newValue = context.util.swapLeftRight(value)
          } else {
            var tokens = context.util.saveFunctions(value)
            var parts = tokens.value.match(this.match(context))
            if (parts && parts.length > 0) {
              parts[0] = this.flip(parts[0], context)
              tokens.value = tokens.value.replace(this.match(context), function () { return parts.shift() })
              newValue = context.util.restoreFunctions(tokens)
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
        'unit': null,
        'replace': /([^\(]*)(?:\()(.*)(?:\))/i,
        'flip': function (value, process, context) {
          if (this.unit === null) {
            this.unit = context.util.regex(['calc', 'number'], 'g')
          }
          var i = 0
          return value.replace(this.unit, function (num) {
            return process(++i, num)
          })
        },
        'flipMatrix': function (value, context) {
          return this.flip(value, function (i, num) {
            if (i === 2 || i === 3 || i === 5) {
              return context.util.negate(num)
            }
            return num
          }, context)
        },
        'matrix3D': /matrix3d/i,
        'flipMatrix3D': function (value, context) {
          return this.flip(value, function (i, num) {
            if (i === 2 || i === 4 || i === 5 || i === 13) {
              return context.util.negate(num)
            }
            return num
          }, context)
        },
        'rotate3D': /rotate3d/i,
        'flipRotate3D': function (value, context) {
          return this.flip(value, function (i, num) {
            if (i === 2 || i === 4) {
              return context.util.negate(num)
            }
            return num
          }, context)
        },
        'skewXY': /skew(x|y)?/i,
        'action': function (prop, value, context) {
          var self = this
          var parts = value.match(this.match)
          for (var x = 0; parts && x < parts.length; x++) {
            parts[x] = parts[x].replace(this.replace, function (m, $1, $2) {
              var tokens = context.util.saveFunctions($2)
              if ($1.match(self.matrix3D)) {
                tokens.value = self.flipMatrix3D(tokens.value, context)
              } else if ($1.match(self.matrix)) {
                tokens.value = self.flipMatrix(tokens.value, context)
              } else if ($1.match(self.rotate3D)) {
                tokens.value = self.flipRotate3D(tokens.value, context)
              } else if ($1.match(self.skewXY)) {
                tokens.value = context.util.negateAll(tokens.value)
              } else {
                tokens.value = context.util.negate(tokens.value)
              }
              return $1 + '(' + context.util.restoreFunctions(tokens) + ')'
            })
          }
          return { 'prop': prop, 'value': value.replace(this.match, function () { return parts.shift() }) }
        }
      },
      {
        'name': 'transition',
        'expr': /transition(-property)?$/i,
        'action': function (prop, value, context) {
          return { 'prop': prop, 'value': context.util.swapLeftRight(value) }
        }
      },
      {
        'name': 'background',
        'expr': /background(-position(-x)?|-image)?$/i,
        'match': function (context) { return context.util.regex(['position', 'percent', 'length', 'calc'], 'i') },
        'percent': /calc|%/,
        'other': /url\([^]*?\)|#[0-9a-f]{3,6}|hsl(a?)\([^]*?\)|rgb(a?)\([^]*?\)|color-stop\([^]*?\)|\b.*?gradient\([^]*\)/ig,
        'others': [],
        'saveOthers': function (value) {
          var self = this
          return value.replace(this.other, function (m) { self.others.push(m); return 'temp' })
        },
        'restoreOthers': function (value, context) {
          var self = this
          return value.replace(/temp/ig, function () {
            var item = self.others.shift()
            if (item.match(/.*?gradient/)) {
              item = context.util.swapLeftRight(item)
              if (item.match(/\d+(deg|g?rad|turn)/i)) {
                item = context.util.negate(item)
              }
            } else if (context.config.processUrls === true && item.match(/^url/i)) {
              item = context.util.applyStringMap(item, true)
            }
            return item
          })
        },
        'flip': function (value, context) {
          var parts = value.match(this.match(context))
          if (parts && parts.length > 0) {
            parts[0] = parts[0] === '0' ? '100%' : (parts[0].match(this.percent) ? context.util.complement(parts[0]) : context.util.swapLeftRight(parts[0]))
            return value.replace(this.match(context), function () { return parts.shift() })
          }
          return value
        },
        'action': function (prop, value, context) {
          var newValue = this.saveOthers(value)
          var tokens = context.util.saveFunctions(newValue)
          var parts = tokens.value.split(',')
          if (prop.toLowerCase() !== 'background-image') {
            for (var x = 0; x < parts.length; x++) {
              parts[x] = this.flip(parts[x], context)
            }
          }
          tokens.value = parts.join(',')
          newValue = context.util.restoreFunctions(tokens)
          return { 'prop': prop, 'value': this.restoreOthers(newValue, context) }
        }
      },
      {
        'name': 'keyword',
        'expr': /float|clear|text-align/i,
        'action': function (prop, value, context) {
          return { 'prop': prop, 'value': context.util.swapLeftRight(value) }
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
        'restoreOthers': function (value, context) {
          var self = this
          return value.replace(/temp/ig, function () {
            var item = self.others.shift()

            if (context.config.processUrls === true && item.match(/^url/i)) {
              item = context.util.applyStringMap(item, true)
            }

            return item
          })
        },
        'flip': function (value) {
          return value.replace(this.replace, function (s, m) { return s.replace(m, m.replace(/e/i, '*').replace(/w/i, 'e').replace(/\*/i, 'w')) })
        },
        'action': function (prop, value, context) {
          var newValue = this.saveOthers(value)
          var parts = newValue.split(',')
          for (var x = 0; x < parts.length; x++) {
            parts[x] = this.flip(parts[x])
          }
          newValue = this.restoreOthers(parts.join(','), context)
          return { 'prop': prop, 'value': newValue }
        }
      }
    ],
    'value': [
      {
        'name': 'ignore',
        'expr': /(?:[^]*)(?:\/\*(?:!)?rtl:ignore)([^]*?)(?:\*\/)/img,
        'action': function (decl, context) {
          if (!context.config.preserveDirectives) {
            decl.raws.value.raw = decl.raws.value.raw.replace(/\/\*(?:!)?rtl:[^]*?\*\//img, '')
          }
          return true
        }
      },
      {
        'name': 'prepend',
        'expr': /(?:[^]*)(?:\/\*(?:!)?rtl:prepend:)([^]*?)(?:\*\/)/img,
        'replace': /\/\*(?:!)?rtl:[^]*?\*\//img,
        'action': function (decl, context) {
          this.expr.lastIndex = 0
          var newValue = this.expr.exec(decl.raws.value.raw)[1]
          if (context.config.preserveComments) {
            decl.raws.value.raw = newValue + (context.config.preserveDirectives ? decl.raws.value.raw : decl.raws.value.raw.replace(this.replace, ''))
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
        'action': function (decl, context) {
          this.expr.lastIndex = 0
          var newValue = this.expr.exec(decl.raws.value.raw)[1]
          if (context.config.preserveComments) {
            decl.raws.value.raw = (context.config.preserveDirectives ? decl.raws.value.raw : decl.raws.value.raw.replace(this.replace, '')) + newValue
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
        'action': function (decl, context) {
          this.expr.lastIndex = 0
          var result = this.expr.exec(decl.raws.value.raw)
          var directive = result[0]
          var newValue = result[1]
          if (context.config.preserveComments) {
            decl.raws.value.raw = decl.raws.value.raw.replace(this.replace, newValue + (context.config.preserveDirectives ? directive : ''))
          } else {
            decl.value = decl.raws.value.raw.replace(this.replace, newValue)
          }
          return true
        }
      },
      {
        'name': 'replace',
        'expr': /(?:\/\*(?:!)?rtl:)([^]*?)(?:\*\/)/img,
        'action': function (decl, context) {
          this.expr.lastIndex = 0
          var result = this.expr.exec(decl.raws.value.raw)
          var directive = result[0]
          var newValue = result[1]
          decl.value = newValue + (context.config.preserveDirectives ? directive : '')
          return true
        }
      }
    ]
  }
})()
