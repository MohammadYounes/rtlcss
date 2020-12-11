'use strict'
const pkg = require('../../package.json')

module.exports = [
  {
    should: 'Should support hooks (pre)',
    expected: '.float-left { float: left; }',
    input: '.float-right { float: right; }',
    reversable: true,
    hooks: {
      pre: function (css, postcss) {
        css.insertBefore(css.nodes[0], postcss.comment({ text: 'rtl:begin:rename' }))
        css.insertAfter(css.nodes[css.nodes.length - 1], postcss.comment({ text: 'rtl:end:rename' }))
      }
    }
  },
  {
    should: 'Should support hooks (post)',
    expected: `/* Generated by RTLCSS v${pkg.version} */\n.float-right { float: left; }`,
    input: '.float-right { float: right; }',
    reversable: false,
    hooks: {
      post: function (css, postcss) {
        css.insertBefore(css.nodes[0], postcss.comment({ text: `Generated by RTLCSS v${pkg.version}` }))
      }
    }
  }
]
