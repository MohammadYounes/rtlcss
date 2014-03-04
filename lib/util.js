function main(configuration) {

  var config = configuration;
  var chalk = require('chalk');
  var success = chalk.green;
  var info = chalk.yellow;
  var REPLACEMENT_CHARACTER = '\uFFFD';
  var REGEX_COMMENT = /\/\*(.|\s)*?\*\//gm;

  var util = 
  {
    log: function () {
      if (config.enableLogging)
        console.log.apply(this, this.log.arguments);
    },
    logRuleAction: function (rule, pi) {
      this.log("Rule:\t%s",
           info(rule.selector));
      this.log("Action:\t%s",
          success(pi.name));
      this.logSource(rule.source);
    },
    logDeclAction: function (decl, pi) {
      this.log("Decl:\t%s",
           info(decl.prop));
      this.log("Action:\t%s",
          success(pi.name));
      this.logSource(decl.source);
    },
    logPropAction: function (decl, result, pi) {
      this.log("Prop:\t%s",
           info(decl.prop));
      this.log("Action:\t%s",
          success("flip " + pi.name));
      this.logSource(decl.source);
    },
    logSource: function (source) {
      this.log("Source:\t%s\t%s:%s",
        info(source.file),
        info(source.start.line),
        info(source.start.column));
    },
    swap: function (value, a, b) {
      var expr = a + "|" + b;
      if (!config.greedy)
        expr = "\\b(" + expr + ")\\b";
      return value.replace(new RegExp(expr, "img"), function (m) { return m.toLowerCase() == a ? b : a; });
    },
    swapLeftRight: function (value) {
      return this.swap(value, "left", "right");
    },
    swapLtrRtl: function (value) {
      return this.swap(value, "ltr", "rtl");
    },
    swapWestEast: function (value) {
      return this.swap(value, "west", "east");
    },
    comments: [],
    saveComments: function (value) {
      var self = this;
      return value.replace(REGEX_COMMENT, function (c) { self.comments.push(c); return REPLACEMENT_CHARACTER; });
    },
    restoreComments: function (value) {
      var self = this;
      return value.replace(new RegExp(REPLACEMENT_CHARACTER, 'g'), function () { return self.comments.shift(); });
    },
    negate: function (value) {
      return value.replace(/(\-?(\d?\.\d+|\d+))/i, function (num) {
        return parseFloat(num, 10) * -1;
      });
    },
    complement: function (value) {
      return value.replace(/(\-?(\d?\.\d+|\d+))/i, function (num) {
        return 100 - parseFloat(num, 10);
      });
    }
  }
  return util;
}
module.exports.configure = main;

