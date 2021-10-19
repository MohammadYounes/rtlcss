/* eslint-env mocha */

'use strict'

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
  '# Regression': require('./data/regression.js')
}
for (const key in tests) {
  if (Object.prototype.hasOwnProperty.call(tests, key)) {
    const group = tests[key]
    describe(key, () => {
      for (const item of group) {
        ((test) => {
          it(test.should, (done) => {
            assert.equal(rtlcss.process(test.input, test.options, test.plugins, test.hooks), test.expected)
            done()
          })
        })(item)

        if (item.reversable) {
          ((test) => {
            it(`${test.should} <REVERSED>`, (done) => {
              assert.equal(rtlcss.process(test.expected, test.options, test.plugins, test.hooks), test.input)
              done()
            })
          })(item)
        }
      }
    })
  }
}
