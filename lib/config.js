function main(options, rules, declarations, properties) {

  if (!options)
    options = {}

  function optionOrDefault(option, def) {
    return option in options ? options[option] : def;
  }

  var config = {};
  function addKey(key, def) {
    config[key] = optionOrDefault(key, def);
  }

  addKey('enableLogging', false);
  addKey('preserveComments', true);
  addKey('preserveDirectives', false);
  addKey('autoRename', true);
  addKey('swapLeftRightInUrl', true);
  addKey('swapLtrRtlInUrl', true);
  addKey('swapWestEastInUrl', true);
  addKey('greedy', false);
  addKey('minify', false);
  addKey('postcssOptions', {});

  if (config.minify)
    config.preserveComments  = config.preserveDirectives = false;
  
  var instructions = require('./instructions.js');
  config.instructions = instructions.configure(config);

  if(rules != null && rules.length)
    for (var x = 0; x < rules.length; x++) {
      var rule = rules[x];
      if(rule.important)
        config.instructions.rules.splice(0, 0, rule);
      else
        config.instructions.rules.push(rule)
    }

  if (declarations != null && declarations.length)
    for (var x = 0; x < declarations.length; x++) {
      var decl = declarations[x];
      if(decl.important)
        config.instructions.declarations.splice(0, 0, decl);
      else
        config.instructions.declarations.push(decl);
    }

  if (properties != null && properties.length)
    for (var x = 0; x < properties.length; x++) {
      var prop = properties[x];
      if (prop.important)
        config.instructions.properties.splice(0, 0, prop);
      else
        config.instructions.properties.push(prop);
    }

  return config;
  
}
module.exports.configure = main;