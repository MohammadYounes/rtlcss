'use strict'

const importantPlugin = {
  postcssPlugin: 'make-declarations-important',
  Declaration (decl) {
    if (decl.important) return
    decl.important = true
  }
}

module.exports = [
  {
    should: 'Should append directive value if decl.important has been set in true by a postcss plugin',
    expected: '.test { transform: rotate(45deg) scaleX(-1) !important; }',
    input: '.test { transform: rotate(45deg) /*rtl:append:scaleX(-1)*/; }',
    postcssPlugin: importantPlugin
  },
  {
    should: 'Should insert directive value if decl.important has been set in true by a postcss plugin',
    expected: '.test { margin: 1px 2px 3px !important; }',
    input: '.test { margin: 1px /*rtl:insert:2px*/ 3px; }',
    postcssPlugin: importantPlugin
  },
  {
    should: 'Should prepend directive value if decl.important has been set in true by a postcss plugin',
    expected: '.test { font-family: "Droid Arabic Kufi","Droid Sans" !important; }',
    input: '.test { font-family: "Droid Sans"/*rtl:prepend:"Droid Arabic Kufi",*/; }',
    postcssPlugin: importantPlugin
  },
  {
    should: 'Should replace directive value if decl.important has been set in true by a postcss plugin',
    expected: '.test { color: #00F !important; }',
    input: '.test { color: #F00 /*rtl:#00F*/; }',
    postcssPlugin: importantPlugin
  }
]
