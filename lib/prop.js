function main(configuration) {
  var config = configuration;
  var util = require('./util.js').configure(config);
  var properties =
  [
    {
      "name": "direction",
      "expr": /direction/im,
      "action": function (prop, value) {
        return { 'prop': prop, 'value': util.swapLtrRtl(value) };
      }
    },
    {
      "name": "left",
      "expr": /left/im,
      "action": function (prop, value) {
        return { 'prop': prop.replace(this.expr, function () { return "right"; }), 'value': value };
      }
    },
    {
      "name": "right",
      "expr": /right/im,
      "action": function (prop, value) {
        return { 'prop': prop.replace(this.expr, function () { return "left"; }), 'value': value };
      }
    },
    {
      "name": "four-value syntax",
      "expr": /^(margin|padding|border-(color|style|width))$/ig,
      "match": /[^\s]+/g,
      "action": function (prop, value) {
        var tokens = util.saveFunctions(value);
        var result = tokens.value.match(this.match);
        if (result && result.length == 4 && (tokens.store.length > 0 || result[1] != result[3])) {
          var i = 0;
          tokens.value = tokens.value.replace(this.match, function () { return result[(4 - i++) % 4]; });
        }
        return { 'prop': prop, 'value': util.restoreFunctions(tokens) };
      }
    },
    {
      "name": "border radius",
      "expr": /border-radius/ig,
      "match": /[^\s]+/g,
      "slash": /[^\/]+/g,
      "flip": function (value) {
        var parts = value.match(this.match);
        var i;
        if (parts)
          switch (parts.length) {
            case 2:
              i = 1;
              if (parts[0] != parts[1])
                return value.replace(this.match, function () { return parts[i--]; });
              break;
            case 3:
              //preserve leading whitespace.
              return value.replace(/(^\s*)/, function(m){ return m + parts[1] + ' ';});
            case 4:
              i = 0;
              if (parts[0] != parts[1] || parts[2] != parts[3])
                return value.replace(this.match, function () { return parts[(5 - i++) % 4]; });
          }
        return value;
      },
      "action": function (prop, value) {
        var self = this;
        var tokens = util.saveFunctions(value);
        tokens.value = tokens.value.replace(this.slash, function(m){
          return self.flip(m);
        });
        return { 'prop': prop, 'value': util.restoreFunctions(tokens)};
      }
    },
    {
      "name": "shadow",
      "expr": /shadow/ig,
      "replace": /(\-?(\d*?\.\d+|\d+))/i,
      "other": /#[a-f0-9]{3,6}/ig,
      "others": [],
      "saveOthers": function (value) {
        var self = this;
        return value.replace(this.other, function (m) { self.others.push(m); return "temp" });
      },
      "restoreOthers": function (value) {
        var self = this;
        return value.replace(/temp/ig, function () { return self.others.shift(); });
      },
      "action": function (prop, value) {
        var tokens = util.saveFunctions(this.saveOthers(value));
        tokens.value = tokens.value.replace(/[^,]+/g, function(m){
          return util.negate(m);
        });
        return { 'prop': prop, 'value': this.restoreOthers(util.restoreFunctions(tokens)) };
      }
    },
    {
      "name": "transform origin",
      "expr": /transform-origin/ig,
      "percent": /calc|%/,
      "xKeyword": /(left|right)/i,
      "yKeyword": /(center|top|bottom)/i,
      "match": util.regex(['calc','percent','length'],'g'),
      "flip": function (value) {
        if (value == "0")
          return "100%";
        else if (value.match(this.percent))
          return util.complement(value);
        return value;
      },
      "action": function (prop, value) {
        var newValue = value;
        if (value.match(this.xKeyword))
          newValue = util.swapLeftRight(value);
        else {
          var tokens = util.saveFunctions(value);
          var parts = tokens.value.match(this.match);
          if (parts && parts.length > 0) {
            parts[0] = this.flip(parts[0]);
            tokens.value = tokens.value.replace(this.match, function () { return parts.shift(); })
            newValue = util.restoreFunctions(tokens);
          }
        }
        return { 'prop': prop, 'value': newValue };
      }
    },
    {
      "name": "transform",
      "expr": /^(?!text\-).*?transform$/ig,
      "match": /((translate)(x|3d)?|skew(x|y)?|rotate(z|3d)?|matrix(3d)?)\((.|\s)*\)/ig,
      "matrix": /matrix/i,
      "flip": function(value, process){
        var replace = util.regex(['calc', 'number'], 'ig');
        var i = 0;
        return value.replace(replace, function (num) {
            return process(++i, num);
        });
      },
      "flipMatrix": function (value) {
        return this.flip(value, function(i, num){
          if (i == 2 || i == 3 || i == 5)
            return util.negate(num);
          return num
        });
      },
      "matrix3D": /matrix3d/i,
      "flipMatrix3D": function(value){
        return this.flip(value, function(i, num){
          if (i == 2 || i == 4 || i == 5 || i == 13)
            return util.negate(num);
          return num
        });
      },
      "rotate3D": /rotate3d/i,
      "flipRotate3D": function (value) {
        return this.flip(value, function(i, num){
          if (i == 2 || i == 4)
            return util.negate(num);
          return num
        });
      },
      "skewXY": /skew(x|y)?/i,
      "action": function (prop, value) {
        var self = this;
        var parts = value.match(this.match);
        for (var x = 0; parts && x < parts.length; x++) {
          parts[x] = parts[x].replace(/([^\(]*)(?:\()(.*)(?:\))/i, function(m, $1, $2){
            var tokens = util.saveFunctions($2);
            
            if ($1.match(self.matrix3D))
              tokens.value = self.flipMatrix3D(tokens.value);
            else if ($1.match(self.matrix))
              tokens.value = self.flipMatrix(tokens.value);
            else if ($1.match(self.rotate3D))
              tokens.value = self.flipRotate3D(tokens.value);
            else if ($1.match(self.skewXY))
              tokens.value = util.negateAll(tokens.value);
            else
              tokens.value = util.negate(tokens.value);            
            return $1 + "(" + util.restoreFunctions(tokens) + ")";
          });
        }
        return { 'prop': prop, 'value': value.replace(this.match, function () { return parts.shift(); }) };
      }
    },
    {
      "name": "transition",
      "expr": /transition(-property)?$/i,
      "action": function (prop, value) {
        return { 'prop': prop, 'value':  util.swapLeftRight(value)};
      }
    },
    {
      "name": "background",
      "expr": /background(-position(-x)?|-image)?$/i,
      "match": util.regex(['position','percent','length', 'calc'],'i'),
      "percent": /calc|%/,
      "other": /url\([^]*?\)|#[0-9a-f]{3,6}|hsl(a?)\([^]*?\)|rgb(a?)\([^]*?\)|color-stop\([^]*?\)|\b.*?gradient\([^]*\)/ig,
      "others": [],
      "saveOthers": function (value) {
        var self = this;
        return value.replace(this.other, function (m) { self.others.push(m); return "temp" });
      },
      "restoreOthers": function (value) {
        var self = this;
        return value.replace(/temp/ig, function () {
          var item = self.others.shift();
          if (item.match(/.*?gradient/)) {
            item = util.swapLeftRight(item);
            if (item.match(/\d+(deg|g?rad|turn)/i))
              item = util.negate(item);
          }
          else if (item.match(/^url/i)) {
            item = util.applyStringMap(item, false, true);
          }

          return item;
        });
      },
      "flip": function (value) {
        var parts = value.match(this.match);
        if (parts && parts.length > 0) {
          parts[0] = parts[0] == "0" ? "100%" : (parts[0].match(this.percent) ? util.complement(parts[0]) : util.swapLeftRight(parts[0]));
          return value.replace(this.match, function () { return parts.shift(); });
        }
        return value;
      },
      "action": function (prop, value) {
        var newValue = this.saveOthers(value);
        var tokens = util.saveFunctions(newValue);
        var parts = tokens.value.split(",");
        if (prop.toLowerCase() != "background-image")
          for (var x = 0; x < parts.length; x++)
            parts[x] = this.flip(parts[x]);
        tokens.value = parts.join(",");          
        newValue = util.restoreFunctions(tokens);
        return { 'prop': prop, 'value':this.restoreOthers(newValue)};
      }
    },
    {
      "name": "keyword",
      "expr": /float|clear|text-align/i,
      "action": function (prop, value) {
        return { 'prop': prop, 'value': util.swapLeftRight(value) };
      }
    },
    {
      "name": "cursor",
      "expr": /cursor/i,
      "replace": /\b([news]{1,4})-resize/ig,
      "other": /url\(.*?\)/ig,
      "others": [],
      "saveOthers": function (value) {
        var self = this;
        return value.replace(this.other, function (m) { self.others.push(m); return "temp" });
      },
      "restoreOthers": function (value) {
        var self = this;
        return value.replace(/temp/ig, function () {

          var item = self.others.shift();

          if (item.match(/^url/i)) {
            item = util.applyStringMap(item, false, true);
          }

          return item;
        });
      },
      "flip": function (value) {
        return value.replace(this.replace, function (s, m) { return s.replace(m, m.replace(/e/i, "*").replace(/w/i, "e").replace(/\*/i, "w")); });
      },
      "action": function (prop, value) {
        var newValue = this.saveOthers(value);
        var parts = newValue.split(",");
        for (var x = 0; x < parts.length; x++)
          parts[x] = this.flip(parts[x]);
        newValue = this.restoreOthers(parts.join(","));
        return { 'prop': prop, 'value': newValue };
      }
    }
  ];
  return properties;
}
module.exports.configure = main;
