function main(options, rules, declarations, properties) {

  if (!options)
    options = {};

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
  addKey('stringMap', []);
  addKey('greedy', false);
  addKey('minify', false);

  //default strings map
  //backward comptabile
  var urlFlag = optionOrDefault('swapLeftRightInUrl', true);
  if (!config.stringMap.some(function (map) { return map.name == 'left-right'; }))
    config.stringMap.push({
      'name': 'left-right',
      'search': ['left', 'Left', 'LEFT'],
      'replace': ['right', 'Right', 'RIGHT'],
      options: { scope: urlFlag ? '*' : 'selector', ignoreCase: false }
    });

  urlFlag = optionOrDefault('swapLtrRtlInUrl', true);
  if (!config.stringMap.some(function (map) { return map.name == 'ltr-rtl'; }))
    config.stringMap.push({
      'name': 'ltr-rtl',
      'search': ['ltr', 'Ltr', 'LTR'],
      'replace': ['rtl', 'Rtl', 'RTL'],
      options: { scope: urlFlag ? '*' : 'selector', ignoreCase: false }
    });

  urlFlag = optionOrDefault('swapWestEastInUrl', true);
  if (!config.stringMap.some(function (map) { return map.name == 'west-east'; }))
    config.stringMap.push({
      'name': 'west-east',
      'search': ['west', 'West', 'WEST'],
      'replace': ['east', 'East', 'EAST'],
      options: { scope: urlFlag ? '*' : 'selector', ignoreCase: false }
    });

  if (config.minify)
    config.preserveComments = config.preserveDirectives = false;

  var instructions = require('./instructions.js');
  config.instructions = instructions.configure(config);

  if (rules != null && rules.length)
    for (var x = 0; x < rules.length; x++) {
      var rule = rules[x];
      if (rule.important)
        config.instructions.rules.unshift(rule);
      else
        config.instructions.rules.push(rule)
    }

  if (declarations != null && declarations.length)
    for (var x = 0; x < declarations.length; x++) {
      var decl = declarations[x];
      if (decl.important)
        config.instructions.declarations.unshift(decl);
      else
        config.instructions.declarations.push(decl);
    }

  if (properties != null && properties.length)
    for (var x = 0; x < properties.length; x++) {
      var prop = properties[x];
      if (prop.important)
        config.instructions.properties.unshift(prop);
      else
        config.instructions.properties.push(prop);
    }

  return config;

}
module.exports.configure = main;
