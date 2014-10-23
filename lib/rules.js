function main(configuration) {
  var config = configuration;
  var util = require('./util.js').configure(config);
  var rules =
  [
    {
      "name": "ignore",
      "expr": /(?:[^]*)(?:\/\*(!)?rtl:ignore)([^]*?)(?:\*\/)/img,
      "action": function (rule) {
        return true;
      }
    },
    {
      "name": "rename",
      "expr": /(?:[^]*)(?:\/\*(!)?rtl:rename)([^]*?)(?:\*\/)/img,
      "action": function (rule) {
        var renamed = util.applyStringMap(rule.selector, true, false);
        if (renamed != rule.selector) {
          rule.selector = renamed;
          return true;
        }
        return false;
      }
    }
  ];
  return rules;
}
module.exports.configure = main;
