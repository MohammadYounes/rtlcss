/* eslint-env mocha */

'use strict'

const postcss = require('postcss')
const assert = require('assert').strict
const rtlcss = require('..')

const tests = {
  '# Background:': require('./data/background.js'),
  '# Background Image:': require('./data/background-image.js'),
  '# Background Position:': require('./data/background-position.js'),
  '# Object Position:': require('./data/object-position.js'),
  '# Properties:': require('./data/properties.js'),
  '# Values:': require('./data/values.js'),
  '# Values (N Value Syntax):': require('./data/values-n-syntax.js'),
  '# Transforms:': require('./data/transforms.js'),
  '# Transform Origin:': require('./data/transform-origin.js'),
  '# Perspective Origin:': require('./data/perspective-origin.js'),
  '# RTLCSS (Options):': require('./data/rtlcss-options.js'),
  '# RTLCSS (Directives):': require('./data/rtlcss-directives.js'),
  '# RTLCSS (String Map):': require('./data/rtlcss-stringMap.js'),
  '# RTLCSS (Plugins):': require('./data/rtlcss-plugins.js'),
  '# RTLCSS (Hooks):': require('./data/rtlcss-hooks.js'),
  '# Special:': require('./data/special.js'),
  '# Variables:': require('./data/variables.js'),
  '# Regression:': require('./data/regression.js'),
  '# Running RTLCSS as a postcss plugin after other plugins': require('./data/rtlcss-with-external-postcss-plugins.js')
}
for (const [key, group] of Object.entries(tests)) {
  describe(key, () => {
    for (const item of group) {
      ((test) => {
        it(test.should, (done) => {
          const inputProcessed = postcss(
            [
              ...(test.postcssPlugin ? [test.postcssPlugin] : []),
              rtlcss(test.options, test.plugins, test.hooks)
            ]
          ).process(test.input).css
          assert.equal(inputProcessed, test.expected)
          done()
        })
      })(item)

      if (item.reversable) {
        ((test) => {
          it(`${test.should} <REVERSED>`, (done) => {
            const inputProcessed = postcss(
              [
                ...(test.postcssPlugin ? [test.postcssPlugin] : []),
                rtlcss(test.options, test.plugins, test.hooks)
              ]
            ).process(test.expected).css
            assert.equal(inputProcessed, test.input)
            done()
          })
        })(item)
      }
    }
  })
}
