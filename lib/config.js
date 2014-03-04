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

  var instructions = require('./instructions.js');
  config.instructions = instructions.configure(config);

  if(rules != null && rules.length)
    for(var x=0;x<rules.length;x++)
      config.instructions.rules.splice(0, 0, rules[x]);

  if (declarations != null && declarations.length)
    for (var x = 0; x < declarations.length; x++)
      config.instructions.declarations.splice(0, 0, declarations[x]);

  if (instructions != null && instructions.length)
    for (var x = 0; x < properties.length; x++)
      config.instructions.properties.splice(0, 0, properties[x]);

  return config;
  
}
module.exports.configure = main;