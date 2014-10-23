function main(configuration) {
  var config = configuration;
  var instructions =
  {
    'rules': require('./rules.js').configure(config),
    'declarations': require('./decl.js').configure(config),
    'properties': require('./prop.js').configure(config)
  };
  return instructions;
}
module.exports.configure = main;
