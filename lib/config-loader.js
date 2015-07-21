var fs = require('fs'),
    path = require('path'),
    findup = require('findup'),
    stripJSONComments = require('strip-json-comments');

var configSources = ['package.json', '.rtlcssrc', '.rtlcss.json'];

function loadConfig(dir) {

  for (var x = 0; x < configSources.length; x++) {
    var found, source = configSources[x];
    try {
      found = findup.sync(dir, source);
    }
    catch (e) {
      continue;
    }

    if (found) {
      var configFilePath = path.normalize(path.join(found, source));
      try {
        config = JSON.parse(
                  stripJSONComments(
                    fs.readFileSync(configFilePath, 'utf-8').trim()));
      } catch (e) {
        throw new Error(e + ' ' + configFilePath);
      }

      if (source == 'package.json') {
        config = config.rtlcssConfig;
      }

      if (config)
        return config;
    }
  }
}

function override(to, from) {
  if (to && from) {
    for (var p in from) {
      if (typeof to[p] === 'object') {
        override(to[p], from[p]);
      } else {
        to[p] = from[p];
      }
    }
  }
  return to;
}

module.exports.load = function (configFilePath, cwd, overrides) {

  if (configFilePath) {
    return override(
            JSON.parse(
              stripJSONComments(
                fs.readFileSync(configFilePath, 'utf-8').trim())), overrides);
  }

  var directory = cwd || process.cwd();
  var config = loadConfig(directory);
  if (!config) {
    var evns = [process.env.USERPROFILE, process.env.HOMEPATH, process.env.HOME];
    for (var x = 0; x < evns.length; x++) {
      if (!evns[x]) {
        continue;
      }
      config = loadConfig(evns[x]);
      if (config) {
        break;
      }
    }
  }

  if (config) {
    override(config, overrides);
  }
  return config;
};
