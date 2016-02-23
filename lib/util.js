function main(configuration) {
  var config = configuration,
      chalk = require('chalk'),
      success = chalk.green,
      info = chalk.cyan,
      REPLACEMENT_CHARACTER = '\uFFFD',
      TOKEN_CHARACTER = '\u00A7',
      REGEX_COMMENT = /\/\*(.|\s)*?\*\//gm,
      REGEX_FUNCTION = /\([^\(\)]+\)/i,
      REGEX_TOKEN = new RegExp(TOKEN_CHARACTER + '(\\d+)', 'i'),
      REGEX_COMPLEMENT = new RegExp('(calc' + TOKEN_CHARACTER + '\\d+)|(\\-?(\\d*?\\.\\d+|\\d+))(?!d\\()' ,'i'),
      REGEX_NEGATE_ONE = new RegExp('(calc' + TOKEN_CHARACTER + '\\d+)|(\\-?(\\d*?\\.\\d+|\\d+))(?!d\\()' ,'i'),
      REGEX_NEGATE_ALL = new RegExp('(calc' + TOKEN_CHARACTER + '\\d+)|(\\-?(\\d*?\\.\\d+|\\d+))(?!d\\()' ,'ig'),
      DEFAULT_STRING_MAP_OPTIONS = { scope: '*', ignoreCase: true },
      compare = function (what, to, ignoreCase) {
        if (ignoreCase) {
          return what.toLowerCase() === to.toLowerCase();
        }
        return what === to;
      },
      extend = function (dest, src) {
        if (typeof dest === 'undefined' || typeof dest !== 'object') {
          dest = {};
        }
        for (var prop in src) {
          if (!dest.hasOwnProperty(prop)) {
            dest[prop] = src[prop];
          }
        }
        return dest;
      },
      escapeRegExp = function(string){
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
  ;
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
      if(source != undefined){
        this.log("Source:\t%s\t%s:%s",
          info(source.file),
          info(source.start.line),
          info(source.start.column));
      }
    },
    swap: function (value, a, b, options) {
      var expr = escapeRegExp(a) + "|" + escapeRegExp(b);
      options = options || DEFAULT_STRING_MAP_OPTIONS;
      var greedy = options.hasOwnProperty('greedy') ? options.greedy : config.greedy;
      if (!greedy) {
        expr = "\\b(" + expr + ")\\b";
      }
      var flags = options.ignoreCase ? "img" : "mg";
      return value.replace(new RegExp(expr, flags), function (m) { return compare(m, a, options.ignoreCase) ? b : a; });
    },
    swapLeftRight: function (value) {
      return this.swap(value, "left", "right");
    },
    swapLtrRtl: function (value) {
      return this.swap(value, "ltr", "rtl");
    },
    applyStringMap: function (value, inSelector, inUrl) {
      var result = value;
      for (var x = 0; x < config.stringMap.length; x++) {
        var map = config.stringMap[x];
        var options = extend(map.options, DEFAULT_STRING_MAP_OPTIONS);
        if (options.scope === '*' || (inSelector && options.scope == 'selector') || (inUrl && options.scope == 'url')) {
          this.log(info('Applying string map: ' + (map.name || "<unknown>") + '.'));
          if (map.search instanceof Array && map.replace instanceof Array) {
            for (var mapIndex = 0; mapIndex < map.search.length; mapIndex++) {
              result = util.swap(result, map.search[mapIndex], map.replace[mapIndex % map.search.length], options);
            }
          } else {
            result = util.swap(result, map.search, map.replace, options);
          }
        }
      }
      return result;
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
      return value.replace(REGEX_NEGATE_ONE, function (num) {
        return REGEX_TOKEN.test(num) ? num.replace(REGEX_TOKEN, function(m){ return '(-1*'+ m + ')';}) : parseFloat(num, 10) * -1;
      });
    },
    negateAll: function (value) {
      return value.replace(REGEX_NEGATE_ALL, function (num) {
        return REGEX_TOKEN.test(num) ? num.replace(REGEX_TOKEN, function(m){ return '(-1*'+ m + ')';}) : parseFloat(num, 10) * -1;
      });
    },
    complement: function (value) {
      return value.replace(REGEX_COMPLEMENT, function (num) {
        return REGEX_TOKEN.test(num) ? num.replace(REGEX_TOKEN, function(m){ return '(100%-'+ m + ')';}) : 100 - parseFloat(num, 10);
      });
    },
    saveFunctions: function (value) {
      var store = [];
      while(REGEX_FUNCTION.test(value))
        value = value.replace(REGEX_FUNCTION, function (m) { store.push(m); return TOKEN_CHARACTER + store.length; });
      return { store: store, value: value };
    },
    restoreFunctions:function (result, callback) {
      var detokenizer = new RegExp('(\\w*?)' + TOKEN_CHARACTER + '(\\d+)', 'i')
      while (detokenizer.test(result.value))
        result.value = result.value.replace(detokenizer, function (m, n, i) { 
          var v = result.store[i - 1]
          if (typeof callback === 'function') {
            return n + callback(v, n)
          }
          return n + v
        });
      return result.value
    },
    regex:function(what, options){
      what = what || [];
      var expressions = [];
      for(var x=0;x<what.length;x++){
        switch(what[x]){
          case 'percent':
            expressions.push('(\\-?(\\d*?\\.\\d+|\\d+)%)');
            break;
          case 'length':
            expressions.push('(\\-?(\\d*?\\.\\d+|\\d+))(?:ex|ch|r?em|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc)?');
            break;
          case 'number':
            expressions.push('(\\-?(\\d*?\\.\\d+|\\d+))');
            break;
          case 'position':
            expressions.push('(left|center|right|top|bottom)');
            break;
          case 'calc':
            expressions.push('(calc' + TOKEN_CHARACTER + '\\d+)');
            break;
        }
      }
      return new RegExp(expressions.join('|'), options);
    },
  };
  return util;
}
module.exports.configure = main;
