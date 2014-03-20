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
      "expr": /^(margin|padding|border-width)$/ig,
      "match": /(\-?(\d?\.\d+|\d+))(:?ex|ch|r?em|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc|%)?/ig,
      "action": function (prop, value) {
        var newValue = value;
        var result = value.match(this.match);
        if (result && result.length == 4 && result[1] != result[3]) {
          var i = 0;
          newValue = value.replace(this.match, function () { return result[(4 - i++) % 4]; });
        }
        return { 'prop': prop, 'value': newValue };
      }
    },
    {
      "name": "border radius",
      "expr": /border-radius/ig,
      "match": /(\-?(\d?\.\d+|\d+))(:?ex|ch|r?em|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc|%)?/ig,
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
              return parts[1] + ' ' + value;
            case 4:
              i = 0;
              if (parts[0] != parts[1] || parts[2] != parts[3])
                return value.replace(this.match, function () { return parts[(5 - i++) % 4]; });
          }
        return value;
      },
      "action": function (prop, value) {
        var parts = value.split("/");
        for (var x = 0; x < parts.length; x++)
          parts[x] = this.flip(parts[x]);
        return { 'prop': prop, 'value': parts.join("/") };
      }
    },
    {
      "name": "shadow",
      "expr": /shadow/ig,
      "replace": /(\-?(\d?\.\d+|\d+))/i,
      "other": /#[^\s]*|hsl(a?)\(.*?\)|rgb(a?)\(.*?\)/ig,
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
        var parts = this.saveOthers(value).split(",");;
        for (var x = 0; x < parts.length; x++)
          parts[x] = util.negate(parts[x]);
        return { 'prop': prop, 'value': this.restoreOthers(parts.join(",")) };
      }
    },
    {
      "name": "transform origin",
      "expr": /transform-origin/ig,
      "number": /(\-?(\d?\.\d+|\d+))/,
      "percent": /%/,
      "xKeyword": /(left|right)/i,
      "match": /(center|top|bottom)|(\-?(\d?\.\d+|\d+)%)|(\-?(\d?\.\d+|\d+))(?:ex|ch|r?em|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc)?/g,
      "flip": function (value) {
        if (value.match(this.percent))
          return util.complement(value);
        else if (value.match(this.number))
          return util.negate(value);
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
      "match": /((translate|skew)(x|3d)?|rotate(3d)?|matrix)\((.|\s)*?\)/ig,
      "matrix": /matrix(.|\s)*?\(/g,
      "flipMatrix": function (value) {
        var i = 0;
        return value.replace(/(\-?(\d?\.\d+|\d+))/ig, function (num) {
          if (++i == 2 || i == 3 || i == 5)
            return parseFloat(num, 10) * -1;
          return num
        });
      },
      "rotate3D": /rotate3d(.|\s)*?\(/g,
      "flipRotate3D": function (value) {
        var i = 0;
        return value.replace(/(\-?(\d?\.\d+|\d+))(?!d\()/ig, function (num) {
          if (++i == 2 || i == 5)
            return parseFloat(num, 10) * -1;
          return num
        });
      },
      "action": function (prop, value) {
        var parts = value.match(this.match);
        for (var x = 0; parts && x < parts.length; x++) {
          if (parts[x].match(this.matrix))
            parts[x] = this.flipMatrix(parts[x]);
          else if (parts[x].match(this.rotate3D))
            parts[x] = this.flipRotate3D(parts[x]);
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
        var parts = value.split(/,(?![^\)]*?\))/ig);
        for (var x = 0; x < parts.length; x++)
          parts[x] = util.swapLeftRight(parts[x]);
        return { 'prop': prop, 'value': parts.join(',') };
      }
    },
    {
      "name": "background",
      "expr": /background(-position|-image)?$/i,
      "match": /left|center|right|top|bottom|(?:\-?(?:\d?\.\d+|\d+)%)|(?:\-?(?:\d?\.\d+|\d+))(?:ex|ch|r?em|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc)?/i,
      "percent": /%/,
      "other": /url\([^]*?\)|#[^\s]*|hsl(a?)\([^]*?\)|rgb(a?)\([^]*?\)|color-stop\([^]*?\)|\b.*?gradient\([^]*\)/ig,
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
            if (item.match(/deg|g?rad|turn/i))
              item = util.negate(item);
          }
          else if (item.match(/^url/i)) {
            if (config.swapLeftRightInUrl)
              item = util.swapLeftRight(item);
            if (config.swapLtrRtlInUrl)
              item = util.swapLtrRtl(item);
            if (config.swapWestEastInUrl)
              item = util.swapWestEast(item);
          }

          return item;
        });
      },
      "flip": function (value) {
        var parts = value.match(this.match);
        if (parts && parts.length > 0) {
          parts[0] = parts[0].match(this.percent) ? util.complement(parts[0]) : util.swapLeftRight(parts[0]);
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
      "match": /(?:\-?(?:\d?\.\d+|\d+))|(?:\-?(?:\d?\.\d+|\d+))(?:ex|ch|r?em|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc)?/i,
      "replace": /\b[news]{1,4}-resize/ig,
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
            if (config.swapLeftRightInUrl)
              item = util.swapLeftRight(item);
            if (config.swapLtrRtlInUrl)
              item = util.swapLtrRtl(item);
            if (config.swapWestEastInUrl)
              item = util.swapWestEast(item);
          }

          return item;
        });
      },
      "flip": function (value) {
        return value.replace(this.replace, function (m) { return m.replace(/e/i, "*").replace(/w/i, "e").replace(/\*/i, "w"); });
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