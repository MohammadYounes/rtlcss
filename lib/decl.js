function main(configuration) {
  var config = configuration;
  var declarations =
  [
    {
      "name": "ignore",
      "expr": /(?:[^]*)(?:\/\*(?:!)?rtl:ignore)([^]*?)(?:\*\/)/img,
      "action": function (decl) {
        if (!config.preserveDirectives)
          decl.raws.value.raw = decl.raws.value.raw.replace(/\/\*(?:!)?rtl:[^]*?\*\//img, "");
        return true;
      }
    },
    {
      "name": "prepend",
      "expr": /(?:[^]*)(?:\/\*(?:!)?rtl:prepend:)([^]*?)(?:\*\/)/img,
      "replace": /\/\*(?:!)?rtl:[^]*?\*\//img,
      "action": function (decl) {
        this.expr.lastIndex = 0;
        var newValue = this.expr.exec(decl.raws.value.raw)[1];
        if (config.preserveComments)
          decl.raws.value.raw = newValue + (config.preserveDirectives ? decl.raws.value.raw : decl.raws.value.raw.replace(this.replace, ""));
        else
          decl.value = newValue + decl.value;
        return true;
      }
    },
    {
      "name": "append",
      "expr": /(?:[^]*)(?:\/\*(?:!)?rtl:append:)([^]*?)(?:\*\/)/img,
      "replace": /\/\*(?:!)?rtl:[^]*?\*\/(?:\s*)/img,
      "action": function (decl) {
        this.expr.lastIndex = 0;
        var newValue = this.expr.exec(decl.raws.value.raw)[1];
        if (config.preserveComments)
          decl.raws.value.raw = (config.preserveDirectives ? decl.raws.value.raw : decl.raws.value.raw.replace(this.replace, "")) + newValue;
        else
          decl.value += newValue;
        return true;
      }
    },
    {
      "name": "insert",
      "expr": /(?:\/\*(?:!)?rtl:insert:)([^]*?)(?:\*\/)/img,
      "replace": /\/\*(?:!)?rtl:[^]*?\*\//img,
      "action": function (decl) {
        this.expr.lastIndex = 0;
        var result = this.expr.exec(decl.raws.value.raw);
        var directive = result[0];
        var newValue = result[1];
        if (config.preserveComments)
          decl.raws.value.raw = decl.raws.value.raw.replace(this.replace, newValue + (config.preserveDirectives ? directive : ""));
        else
          decl.value = decl.raws.value.raw.replace(this.replace, newValue);
        return true;
      }
    },
    {
      "name": "replace",
      "expr": /(?:\/\*(?:!)?rtl:)([^]*?)(?:\*\/)/img,
      "action": function (decl) {
        this.expr.lastIndex = 0;
        var result = this.expr.exec(decl.raws.value.raw);
        var directive = result[0];
        var newValue = result[1];
        decl.value = newValue + (config.preserveDirectives ? directive : "");
        return true;
      }
    }
  ];
  return declarations;
}
module.exports.configure = main;
