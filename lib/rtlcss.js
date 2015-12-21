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
      var flipped = 0
      var control = null
      var context = {
        // provides access to postcss
        'postcss': postcss,
        // provides access to the current configuration
        'config': config,
        // provides access to utilities object
        'util': util,
        // holds the current plugin
        'plugin': null,
        // holds the current directive
        'directive': null,
        // defines node types to skip.
        'skip': {}
      }
      css.walk(function (node) {
        if (node.type !== 'comment' && control && control.expect[node.type] && control.begin(node, context)) {
          context.util.logAtRuleAction(node, control)
          if (context.directive && context.directive.end && control.end && control.end(node, context)) {
            control = null
          }
        } else if (context.skip[node.type] !== true) {
          switch (node.type) {
            case 'atrule':
              if (context.config.processUrls === true) {
                node.params = context.util.applyStringMap(node.params, true)
              }
              break
            case 'comment':
              context.directive = directiveParser(node)
              if (context.directive) {
                context.comment = node
                for (var c = 0; c < config.plugins.length; c++) {
                  control = config.plugins[c].control[context.directive.option]
                  if (control) {
                    break
                  }
                }
                if (!context.directive.begin && context.directive.end) {
                  control.end && control.end(node, context)
                  control = null
                } else if (control && control.expect[node.type] && control.begin(node, context)) {
                  context.util.logRuleAction(node, control)
                  if (context.directive && context.directive.end) {
                    control = null
                  }
                }
              }
              break
            case 'decl':
              var local, brk
              for (var vp = 0; vp < config.plugins.length; vp++) {
                context.plugin = config.plugins[vp]
                for (var v = 0; v < context.plugin.value.length; v++) {
                  local = context.plugin.value[v]
                  if (node.raws.value && node.raws.value.raw && node.raws.value.raw.match(local.expr) && local.action(node, context)) {
                    flipped++
                    context.util.logDeclAction(node, local)
                    brk = true
                    break
                  }
                }
                if (brk) break
              }
              if (brk) break
              for (var pp = 0; pp < config.plugins.length; pp++) {
                context.plugin = config.plugins[pp]
                for (var p = 0; p < context.plugin.property.length; p++) {
                  local = context.plugin.property[p]
                  if (node.prop.match(local.expr)) {
                    var rawValue = context.config.preserveComments && node.raws.value && node.raws.value.raw ? node.raws.value.raw : node.value
                    var result
                    if (context.config.preserveComments) {
                      var commentsLessRawValue = context.util.saveComments(rawValue)
                      result = local.action(node.prop, commentsLessRawValue, context)
                      result.value = context.util.restoreComments(result.value)
                    } else {
                      result = local.action(node.prop, rawValue, context)
                    }

                    if (result.prop !== node.prop || result.value !== rawValue) {
                      flipped++
                      context.util.logPropAction(node, result, local)
                      node.prop = result.prop
                      node.value = result.value
                    }
                    brk = true
                    break
                  }
                }
                if (brk) break
              }
              if (context.util.isLastOfType(node)) {
                if (context.config.autoRename && !flipped) {
                  node.parent.selector = context.util.applyStringMap(node.parent.selector)
                }
                flipped = 0
              }
              break
            case 'rule':
              break
          }
        }
        if (!config.preserveDirectives && context.directive && context.directive.source) {
          context.directive.source.remove()
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
