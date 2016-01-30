RTLCSS Plugins
======

Add more functionality to RTLCSS, or even change it's entire behavior. RTLCSS core functionailty is written as a plugin, and it can be replaced by adding your own plugin with the same name.

A plugin is a javascript object consiting of :

|   Property        |   Type    |   Description
|:------------------|:----------|:--------------
|   **`name`**      | `string`  | Name of the plugin.
|   **`priority`**  | `number`  | Used to sort the plugins array before processing the CSS, the core RTLCSS plugin has a priority value of `100`.
|   **`control`**   | `object`  | Object literal containing [control directives](#control directives).
|   **`property`**  | `array`   | Array containing [property directives](#property directives).
|   **`value`**     | `array`   | Array containing [value directives](#value directives).


### Control Directives

Control directives are triggered by CSS comments and they consist of the following:

|   Property    |   Type    |   Description
|:--------------|:----------|:--------------
|   **`expect`**| `object`  | An object containing the node types this directive is able to process, for more info on nodes types see [PostCSS] [API] documentation.
|   **`begin`** | `function`| The function to be called when a comment triggers the start of the directive, it will be passed a `node`, [`metadata`] and a [`context`]. the functions is expected to return a boolean, `true` to stop further processing of the node, otherwise `false`.
|   **`end`**   | `function`| The function to be called when a comment triggers the end of the directive, it will be passed a `node`, [`metadata`] and a [`context`]. the functions is expected to return a boolean, `true` to indicate if it has finished, otherwise `false`.

##### Example

```javascript
// RTLCSS control directive
'ignore': {
  'expect': { 'atrule': true, 'comment': true, 'decl': true, 'rule': true },
  'begin': function (node, metadata, context) {
    var prevent = true
    if (node.type === 'comment' && (node.text === '!rtl:end:ignore' || node.text === 'rtl:end:ignore')) {
      prevent = false
    }
    return prevent
  },
  'end': function (node, metadata, context) {
    // end if triggered by comment or last declaration is reached
    if (node.type === 'comment' || node.type === 'decl' && context.util.isLastOfType(node)) {
      return true
    }
    return false
  }
}
```

### Value Directives
Control directives are triggered by CSS comments inside a delcaration value. The directive definition is as follows:

|   Property        | Type       |   Description
|:------------------|:----------:|:--------------
|   **`name`**      | `string`   | Name of the directive (used in logging).
|   **`expr`**      | `RegExp`   | Regular expression that will be matched against the declaration raw value.
|   **`action`**    | `function` | The action to be called when a match is found, and it will be passed a [`decl`] node and a [`context`]. The functions is expected to return a boolean, `true` to stop further processing of the declaration, otherwise `false`.

##### Example

```javascript
{
  'name': 'ignore',
  'expr': /(?:[^]*)(?:\/\*(?:!)?rtl:ignore)([^]*?)(?:\*\/)/img,
  'action': function (decl, context) {
    if (!context.config.preserveDirectives) {
      decl.raws.value.raw = decl.raws.value.raw.replace(/\/\*(?:!)?rtl:[^]*?\*\//img, '')
    }
    return true
  }
}
```

### Property Directives

Property directives are triggered by CSS properties. The directive definition is as follows:

|   Property    |   Type    |   Description
|:--------------|:---------:|:--------------
|   **`name`**  | `string`  | Name of the directive (used in logging).
|   **`expr`**  | `RegExp`  | Regular expression that will be matched against the declaration property name.
|   **`action`**| `function`| The action to be called when a match is found, it will be passed a `prop` (string holding the CSS property name), `value` (string holding the CSS property raw value) and a [`context`]. If `options.preserveComments == true`, comments in the raw value will be replaced by the Unicode Character 'REPLACEMENT CHARACTER' (U+FFFD) &#xfffd; (this is to simplify pattern matching). The function is expected to return an object containing the modified version of the property and its value.


##### Example

```javascript
{
  'name': 'direction',
  'expr': /direction/im,
  'action': function (prop, value, context) {
    return { 'prop': prop, 'value': context.util.swapLtrRtl(value) }
  }
}
```


### Context

All directives will be passed a context object, this object provides access to [postcss], current configuration and internal utilities.

```javascript
context = {
  // provides access to postcss
  'postcss': postcss,
  // provides access to the current configuration
  'config': configuration,
  // provides access to utilities object
  'util': util.configure(configuration)
}
```

### Metadata

Control directives will be passed a metadata object containing directive related information.

|   Property    |   Type        |   Description
|:--------------|:-------------:|:--------------
| **`source`**  | `comment Node`| Postcss [`comment`] node that triggered the directive.
| **`name`**    | `string`      | The directive name, for example 'ignore' in `/*rtl:ignore*/`.
| **`param`**   | `string`      | The directive paramter, for example '{}' in `/*rtl:options:{}*/`.
| **`begin`**   | `boolean`     | Indicates the start of the directive scope.
| **`end`**     | `boolean`     | Indicates the end of the directive scope.


[`context`]: #Context
[`metadata`]: #Metadata

[PostCSS]: https://github.com/postcss/postcss
[API]: https://github.com/postcss/postcss/blob/master/docs/api.md
[`atrule`]: https://github.com/postcss/postcss/blob/master/docs/api.md#atrule-node
[`rule`]: https://github.com/postcss/postcss/blob/master/docs/api.md#rule-node
[`decl`]: https://github.com/postcss/postcss/blob/master/docs/api.md#decl-node
[`comment`]: https://github.com/postcss/postcss/blob/master/docs/api.md#comment-node



