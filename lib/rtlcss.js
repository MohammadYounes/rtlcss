/*
 * RTLCSS 2.0.0 https://github.com/MohammadYounes/rtlcss
 * Framework for transforming Cascading Style Sheets (CSS) from Left-To-Right (LTR) to Right-To-Left (RTL).
 * Copyright 2016 Mohammad Younes.
 * Licensed under MIT <http://opensource.org/licenses/mit-license.php>
 * */
'use strict'
var postcss = require('postcss')
// var directiveParser = require('./directive-parser.js')
var state = require('./state.js')
var config = require('./config.js')
var util = require('./util.js')

module.exports = postcss.plugin('rtlcss', function (options, plugins) {
  var configuration = config.configure(options, plugins)
  var context = {
    // provides access to postcss
    'postcss': postcss,
    // provides access to the current configuration
    'config': configuration,
    // provides access to utilities object
    'util': util.configure(configuration)
  }
  return function (css, result) {
    var flipped = 0
    css.walk(function (node) {
      var prevent = false
      state.walk(function (current) {
        // check if current directive is expecting this node
        if (current.directive.expect[node.type]) {
          // perform action and prevent further processing if result equals true
          if (current.directive.begin(node, current.metadata, context)) {
            prevent = true
          }
          context.util.logAtRuleAction(node, current.directive)
          // if should end? end it.
          if (current.metadata.end && current.directive.end(node, current.metadata, context)) {
            state.pop(current)
          }
        }
      })

      if (prevent === false) {
        switch (node.type) {
          case 'atrule':
            if (context.config.processUrls === true || context.config.processUrls.atrule === true) {
              node.params = context.util.applyStringMap(node.params, true)
            }
            break
          case 'comment':
            state.parse(node, function (current) {
              var push = true
              if (current.directive === null) {
                current.preserve = context.config.preserveDirectives
                for (var c = 0; c < context.config.plugins.length; c++) {
                  current.directive = context.config.plugins[c].control[current.metadata.option]
                  if (current.directive) {
                    break
                  }
                }
              }
              if (current.directive) {
                if (!current.metadata.begin && current.metadata.end) {
                  if (current.directive.end(node, current.metadata, context)) {
                    state.pop(current)
                  }
                  push = false
                } else if (current.directive.expect.self && current.directive.begin(node, current.metadata, context)) {
                  context.util.logRuleAction(node, current.directive)
                  if (current.metadata.end) {
                    current.directive.end(node, current.metadata, context)
                    push = false
                  }
                }
              }
              return push
            })
            break
          case 'decl':
            var local, brk, plugin
            for (var vp = 0; vp < context.config.plugins.length; vp++) {
              plugin = context.config.plugins[vp]
              for (var v = 0; v < plugin.value.length; v++) {
                local = plugin.value[v]
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
            for (var pp = 0; pp < context.config.plugins.length; pp++) {
              plugin = context.config.plugins[pp]
              for (var p = 0; p < plugin.property.length; p++) {
                local = plugin.property[p]
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
    })
  }
})

/**
 * Creates a new RTLCSS instance, process the input and return its result.
 *
 * @css           {String}  A string containing input CSS.
 * @options       {Object}  An object containing RTLCSS settings.
 * @plugins       {Array or Object} An array containing a list of RTLCSS plugins or a single RTLCSS plugin.
 *
 * @return	{String}	A string contining the RTLed css.
 */
module.exports.process = function (css, options, plugins) {
  return postcss([this(options, plugins)]).process(css).css
}

/**
 * Creates a new instance of RTLCSS using the passed configuration object
 *
 * @config  {Object}  An object containing RTLCSS options and plugins.
 *
 * @return  {Object}  A new RTLCSS instance.
 */
module.exports.configure = function (config) {
  config = config || {}
  return postcss([this(config.options, config.plugins)])
}
