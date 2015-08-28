(function () {
  "use strict";
  var config, util, postcss;

  var RTLCSS = (function () {
    function RTLCSS(options, rules, declarations, properties) {
      postcss = require('postcss');
      config = require('./config.js').configure(options, rules, declarations, properties);
      util = require('./util.js').configure(config);
    }
    RTLCSS.prototype.process = function (css, options) {
      return postcss(this.postcss).process(css, options);
    };
    RTLCSS.prototype.postcss = function (css) {
      css.walkRules(function (rule, idx) {
        var previousComment = { 'text': '', removeSelf: function () { } };
        if (idx > 0 && rule.parent.nodes[idx - 1].type == 'comment')
          previousComment = rule.parent.nodes[idx - 1];

        //processing instruction at rule level
        for (var x = 0; x < config.instructions.rules.length; x++) {
          var pi = config.instructions.rules[x];
          if (("/*" + previousComment.text + "*/").match(pi.expr) && pi.action(rule)) {
            util.logRuleAction(rule, pi);
            if (!config.preserveDirectives)
              previousComment.remove();
            return;
          }
        }

        var flipped = 0;
        rule.walkDecls(function (decl, index) {
          if (decl.type == "comment")
            return;

          //processing instruction at declaration level
          for (var x = 0; x < config.instructions.declarations.length; x++) {
            var pi = config.instructions.declarations[x];
            //console.log('raws', decl.raws, '_value', decl._value);
            if (decl.raws.value && decl.raws.value.raw && decl.raws.value.raw.match(pi.expr) && pi.action(decl)) {
              util.logDeclAction(decl, pi);
              return;
            }
          }

          //processing instruction at property level
          for (var x = 0; x < config.instructions.properties.length; x++) {
            var pi = config.instructions.properties[x];
            if (decl.prop.match(pi.expr)) {
              var rawValue = config.preserveComments && decl.raws.value && decl.raws.value.raw ? decl.raws.value.raw : decl.value;
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

        if (config.autoRename && flipped == 0) {
          rule.selector = util.applyStringMap(rule.selector, true, false);
        }
      });

      //loop @ rules
      css.walkAtRules(function (atRule) {
        atRule.params = util.applyStringMap(atRule.params, false, true);
        if (config.minify) {
          atRule.before = '';
          atRule.between = '';
          atRule.after = '';
        }
      });

      if (config.minify) {
        css.walkDecls(function (decl) {
          decl.raws.before = '';
          decl.raws.between = ':';
        });
        css.walkRules(function (rule) {
          rule.raws.before = '';
          rule.raws.between = '';
          rule.raws.after = '';
        });
        css.walkComments(function (comment) {
          comment.remove();
        });
      }

    };
    return RTLCSS;
  })();

  /**
   * Creates a new RTLCSS instance.
   *
   * @options       {Object}  An object containing RTLCSS settings.
   * @rules         {Object}  An object containing RTLCSS rule level processing directives.
   * @declarations  {Object}  An object containing RTLCSS declaration level processing directives.
   * @properties    {Object}  An object containing RTLCSS property level processing directives.
   *
   * @return {Object} new RTLCSS instance.
   */
  var exports = function (options, rules, declarations, properties) {
    return new RTLCSS(options, rules, declarations, properties);
  };


  /**
   * Creates a new RTLCSS instance, process the input and return its result.
   *
   * @css           {String}  A string containing input CSS.
   * @options       {Object}  An object containing RTLCSS settings.
   * @rules         {Object}  An object containing RTLCSS rule level processing directives.
   * @declarations  {Object}  An object containing RTLCSS declaration level processing directives.
   * @properties    {Object}  An object containing RTLCSS property level processing directives.
   *
   * @return	{String}	A string contining the RTLed css.
   */
  exports.process = function (css, options, rules, declarations, properties) {
    return new RTLCSS(options, rules, declarations, properties).process(css).css;
  };

  /**
   * Creates a new instance of RTLCSS using the passed configuration object
   *
   * @config  {Object}  An object containing RTLCSS options, rules, declarations and properties processing directives.
   *
   * @return  {Object}  A new RTLCSS instance.
   */
  exports.configure = function (config) {
    config = config || {};
    return new RTLCSS(config.options, config.rules, config.declarations, config.properties);
  };

  module.exports = exports;

}).call(this);
