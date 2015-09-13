function main(configuration) {
  var config = configuration;
  var util = require('./util.js').configure(config);
  var list = require('postcss').list;
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
      "action": function (prop, value) {
        var result = list.space(value);
        if (result && result.length == 4 && result[1] !== result[3]) {
          value = [result[0], result[3], result[2], result[1]].join(' ');
        }
        return { 'prop': prop, 'value': value };
      }
    },
    {
      "name": "border radius",
      "expr": /border-radius/ig,
      "flip": function (value) {
        var parts = list.space(value);
        if (parts)
          switch (parts.length) {
            case 2:
              if (parts[0] != parts[1])
                return parts[1] + ' ' + parts[0];
              break;
            case 3:
              return parts[1] + ' ' + value;
            case 4:
              if (parts[0] != parts[1] || parts[2] != parts[3])
                return [parts[1], parts[0], parts[3], parts[2]].join(' ');
          }
        return value;
      },
      "action": function (prop, value) {
        var parts = list.split(value, ['/']); // TODO: this is an undocumented API. should do a pull request to postcss.
        for (var x = 0; x < parts.length; x++)
          parts[x] = this.flip(parts[x]);
        return { 'prop': prop, 'value': parts.join("/") };
      }
    },
    {
      "name": "shadow",
      "expr": /(:?box|text)-shadow/ig,
      "firstWord": /^[-a-z#]*/,
      "action": function (prop, value) {
        var parts = list.comma(value);
        for (var x = 0; x < parts.length; x++) {
          var subparts = list.space(parts[x]);
          if (subparts.length > 1) {
            var firstword = this.firstWord.exec(subparts[0])[0];

            // box-shadow might have the keyword 'inset' in first position
            // text-shadow might have a color in first position
            var leftposition = firstword.indexOf('inset') !== -1 || firstword[0] === '#' || firstword.indexOf('rgb') !== -1 || firstword.indexOf('hsl') !== -1 || firstword.length === subparts[0].length ? 1 : 0;

            // util.negate doesn't handle calc yet
            if (subparts[leftposition].indexOf('calc') === -1) {
              subparts[leftposition] = util.negate(subparts[leftposition]);
              parts[x] = subparts.join(' ');
            }
          }
        }
        return { 'prop': prop, 'value': parts.join(",") };
      }
    },
    {
      "name": "transform origin",
      "expr": /transform-origin/ig,
      "percent": /%/,
      "xKeyword": /(left|right)/i,
      "yKeyword": /(center|top|bottom)/i,
      "match": /(\-?(\d*?\.\d+|\d+)%)|(\-?(\d*?\.\d+|\d+))(?:ex|ch|r?em|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc)?/g,
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
          var parts = value.match(this.match);
          if (parts && parts.length > 0) {
            parts[0] = this.flip(parts[0]);
            newValue = value.replace(this.match, function () { return parts.shift(); })
          }
        }
        return { 'prop': prop, 'value': newValue };
      }
    },
    {
      "name": "transform",
      "expr": /^(?!text\-).*?transform$/ig,
      "match": /((translate)(x|3d)?|skew(x|y)?|rotate(z|3d)?|matrix(3d)?)\((.|\s)*?\)/ig,
      "matrix": /matrix\(/i,
      "flipMatrix": function (value) {
        var i = 0;
        return value.replace(/(\-?(\d*?\.\d+|\d+))/ig, function (num) {
          if (++i == 2 || i == 3 || i == 5)
            return parseFloat(num, 10) * -1;
          return num
        });
      },
      "matrix3D": /matrix3d\(/i,
      "flipMatrix3D": function(value){
        var i = 0;
        return value.replace(/(\-?(\d*?\.\d+|\d+))(?!d\()/ig, function (num) {
          if (++i == 2 || i == 4 || i == 5 || i == 13)
            return parseFloat(num, 10) * -1;
          return num
        });
      },
      "rotate3D": /rotate3d\(/i,
      "flipRotate3D": function (value) {
        var i = 0;
        return value.replace(/(\-?(\d*?\.\d+|\d+))(?!d\()/ig, function (num) {
          if (++i == 2 || i == 4)
            return parseFloat(num, 10) * -1;
          return num
        });
      },
      "skewXY": /skew(x|y)?/i,
      "action": function (prop, value) {
        var parts = value.match(this.match);
        for (var x = 0; parts && x < parts.length; x++) {
          if (parts[x].match(this.matrix3D))
            parts[x] = this.flipMatrix3D(parts[x]);
          else if (parts[x].match(this.matrix))
            parts[x] = this.flipMatrix(parts[x]);
          else if (parts[x].match(this.rotate3D))
            parts[x] = this.flipRotate3D(parts[x]);
          else if (parts[x].match(this.skewXY))
            parts[x] = util.negateAll(parts[x]);
          else
            parts[x] = util.negate(parts[x]);
        }
        return { 'prop': prop, 'value': value.replace(this.match, function () { return parts.shift(); }) };
      }
    },
    {
      "name": "transition",
      "expr": /transition(-property)?$/i,
      "action": function (prop, value) {
        var parts = list.comma(value);
        for (var x = 0; x < parts.length; x++)
          parts[x] = util.swapLeftRight(parts[x]);
        return { 'prop': prop, 'value': parts.join(',') };
      }
    },
    {
      "name": "background",
      "expr": /background(-position(-x)?|-image)?$/i,
      "match": /left|center|right|top|bottom|(?:\-?(?:\d*?\.\d+|\d+)%)|(?:\-?(?:\d*?\.\d+|\d+))(?:ex|ch|r?em|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc)?/i,
      "percent": /%/,
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
        var parts = newValue.split(",");
        if (prop.toLowerCase() != "background-image")
          for (var x = 0; x < parts.length; x++)
            parts[x] = this.flip(parts[x]);
        newValue = this.restoreOthers(parts.join(","));
        return { 'prop': prop, 'value': newValue };
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
      "match": /(?:\-?(?:\d*?\.\d+|\d+))|(?:\-?(?:\d*?\.\d+|\d+))(?:ex|ch|r?em|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc)?/i,
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
