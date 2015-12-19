/*
 * RTLCSS 2.0.0 https://github.com/MohammadYounes/rtlcss
 * Framework for transforming Cascading Style Sheets (CSS) from Left-To-Right (LTR) to Right-To-Left (RTL).
 * Copyright 2016 Mohammad Younes.
 * Licensed under MIT <http://opensource.org/licenses/mit-license.php>
 * */
;(function () {
  'use strict'
  var RTLCSS = (function () {
    var config, util, postcss, directiveParser
    function RTLCSS (options, plugins) {
      postcss = require('postcss')
      config = require('./config.js').configure(options, plugins)
      util = require('./util.js').configure(config)
      directiveParser = require('./directive-parser.js')
    }
    RTLCSS.prototype.process = function (css, options) {
      return postcss(this.postcss).process(css, options)
    }
    RTLCSS.prototype.postcss = function (css) {
      var directive, plugin
      var flipped = 0
      var context = {
        'postcss': postcss,
        'config': config,
        'util': util,
        'meta': null,
        'comment': null,
        'lockContainer': function () {
          this.locked = true
        },
        'unlockContainer': function () {
          this.locked = false
        },
        'isContainerLocked': function () {
          return this.locked === true
        }
      }
      css.walk(function (node) {
        if (node.type !== 'comment' && directive && directive.expect[node.type] && directive.begin(node, context)) {
          context.util.logAtRuleAction(node, directive)
          if (context.meta && context.meta.end && directive.end && directive.end(node, context)) {
            directive = null
          }
        } else {
          switch (node.type) {
            case 'comment':
              context.meta = directiveParser(node.text)
              if (context.meta) {
                context.comment = node
                for (var c = 0; c < config.plugins.length; c++) {
                  directive = config.plugins[c].control[context.meta.option]
                  if (directive) {
                    break
                  }
                }
                if (!context.meta.begin && context.meta.end) {
                  directive.end && directive.end(node, context)
                  directive = null
                } else if (directive && directive.expect[node.type] && directive.begin(node, context)) {
                  context.util.logRuleAction(node, directive)
                  if (context.meta && context.meta.end) {
                    directive = null
                  }
                }
              }
              break
            case 'atrule':
              node.params = context.util.applyStringMap(node.params, false, true)
              break
            case 'decl':
              if (!context.isContainerLocked()) {
                var localDirective, brk
                for (var vp = 0; vp < config.plugins.length; vp++) {
                  plugin = config.plugins[vp]
                  for (var v = 0; v < plugin.values.length; v++) {
                    localDirective = plugin.values[v]
                    if (node.raws.value && node.raws.value.raw && node.raws.value.raw.match(localDirective.expr) && localDirective.action(node, context)) {
                      flipped++
                      context.util.logDeclAction(node, localDirective)
                      brk = true
                      break
                    }
                  }
                  if (brk) break
                }
                if (brk) break
                for (var pp = 0; pp < config.plugins.length; pp++) {
                  plugin = config.plugins[pp]
                  for (var p = 0; p < plugin.properties.length; p++) {
                    localDirective = plugin.properties[p]
                    if (node.prop.match(localDirective.expr)) {
                      var rawValue = context.config.preserveComments && node.raws.value && node.raws.value.raw ? node.raws.value.raw : node.value
                      var result
                      if (context.config.preserveComments) {
                        var commentsLessRawValue = context.util.saveComments(rawValue)
                        result = localDirective.action(node.prop, commentsLessRawValue, context)
                        result.value = context.util.restoreComments(result.value)
                      } else {
                        result = localDirective.action(node.prop, rawValue, context)
                      }

                      if (result.prop !== node.prop || result.value !== rawValue) {
                        flipped++
                        context.util.logPropAction(node, result, localDirective)
                        node.prop = result.prop
                        node.value = result.value
                      }
                      brk = true
                      break
                    }
                  }
                  if (brk) break
                }
                if (context.config.autoRename && context.util.isLastDecl(node)) {
                  if (flipped === 0) {
                    node.parent.selector = context.util.applyStringMap(node.parent.selector, true, false)
                  }
                  flipped = 0
                }
              }
              break
            case 'rule':
              break
          }
        }
        if (context.comment && !config.preserveDirectives) {
          context.comment.remove()
        }
      })
    }
    return RTLCSS
  })()

  /**
   * Creates a new RTLCSS instance.
   *
   * @options       {Object}  An object containing RTLCSS settings.
   * @plugins       {Array or Object} An array containing a list of RTLCSS plugins or a single RTLCSS plugin.
   *
   * @return {Object} new RTLCSS instance.
   */
  var exports = function (options, plugins) {
    return new RTLCSS(options, plugins)
  }

  /**
   * Creates a new RTLCSS instance, process the input and return its result.
   *
   * @css           {String}  A string containing input CSS.
   * @options       {Object}  An object containing RTLCSS settings.
   * @plugins       {Array or Object} An array containing a list of RTLCSS plugins or a single RTLCSS plugin.
   *
   * @return	{String}	A string contining the RTLed css.
   */
  exports.process = function (css, options, plugins) {
    return new RTLCSS(options, plugins).process(css).css
  }

  /**
   * Creates a new instance of RTLCSS using the passed configuration object
   *
   * @config  {Object}  An object containing RTLCSS options and plugins.
   *
   * @return  {Object}  A new RTLCSS instance.
   */
  exports.configure = function (config) {
    config = config || {}
    return new RTLCSS(config.options, config.plugins)
  }

  module.exports = exports
}).call(this)
