(function() {
"use strict";
var config,util,postcss;

var RTLCSS = (function() {
  function RTLCSS(options, rules, declarations, properties) {
    postcss = require('postcss');
    config  = require('./config.js').configure(options, rules, declarations, properties);
    util    = require('./util.js').configure(config);
  }
  RTLCSS.prototype.process = function(css, options) {
    return postcss(this.postcss).process(css,options);
  };   
  RTLCSS.prototype.postcss = function (css) {
    css.eachRule(function (rule, idx) {
      var previousComment = { 'text': '', removeSelf: function () { } };
      if (idx > 0 && rule.parent.rules[idx - 1].type == 'comment')
        previousComment = rule.parent.rules[idx - 1];

      //processing instruction at rule level
      for (var x = 0; x < config.instructions.rules.length; x++) {
        var pi = config.instructions.rules[x];
        if (("/*" + previousComment.text + "*/").match(pi.expr) && pi.action(rule)) {
          util.logRuleAction(rule, pi);
          if(!config.preserveDirectives)
            previousComment.removeSelf();
          return;
        }
      }

      var flipped = 0;
      rule.eachDecl(function (decl, index) {
        if (decl.type == "comment")
          return;

        //processing instruction at declaration level
        for (var x = 0; x < config.instructions.declarations.length; x++) {
          var pi = config.instructions.declarations[x];
          if (decl._value && decl._value.raw && decl._value.raw.match(pi.expr) && pi.action(decl)) {
            util.logDeclAction(decl, pi);
            return;
          }
        }

        //processing instruction at property level
        for (var x = 0; x < config.instructions.properties.length; x++) {
          var pi = config.instructions.properties[x];
          if (decl.prop.match(pi.expr)) {
            var rawValue = config.preserveComments && decl._value && decl._value.raw ? decl._value.raw : decl.value;
            var result;
            if (config.preserveComments) {
              var commentsLessRawValue = util.saveComments(rawValue);
              result = pi.action(decl.prop, commentsLessRawValue);
              result.value = util.restoreComments(result.value);
            }
            else
              result = pi.action(decl.prop, rawValue);

            if (result.prop != decl.prop || result.value != rawValue) {
              flipped++;
              util.logPropAction(decl, result, pi);
              decl.prop = result.prop;
              decl.value = result.value;
            }
            break;
          }
        }
      });

      if (config.autoRename && flipped == 0)
        rule.selector = util.swapLeftRight(util.swapLtrRtl(util.swapWestEast(rule.selector)));      
      return;
    });
    if (config.minify) {
      css.eachDecl(function (decl) {
        decl.before = '';
        decl.between = ':';
        if (decl._value.raw)
          decl._value.raw = decl.value;
      });
      css.eachRule(function (rule) {
        rule.before = '';
        rule.between = '';
        rule.after = '';
      });
      css.eachAtRule(function (atRule) {
        atRule.before = '';
        atRule.between = '';
        atRule.after = '';
      });
      css.eachComment(function (comment) {
        comment.removeSelf();
      });
    }
  };
  return RTLCSS;
})();

var rtlcss = function(options, rules, declarations, properties) {
  return new RTLCSS(options, rules, declarations, properties);
};
  
rtlcss.process = function(css, options, rules, declarations, properties){
  return new RTLCSS(options, rules, declarations, properties).process(css).css;
}

module.exports = rtlcss;
  
}).call(this);