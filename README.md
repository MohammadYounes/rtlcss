# RTLCSS
[![GitHub version](https://badge.fury.io/gh/MohammadYounes%2Frtlcss.svg)](http://badge.fury.io/gh/MohammadYounes%2Frtlcss) [![NPM version](https://badge.fury.io/js/rtlcss.svg)](http://badge.fury.io/js/rtlcss) [![Build Status](https://travis-ci.org/MohammadYounes/rtlcss.svg?branch=master)](https://travis-ci.org/MohammadYounes/rtlcss) [![DEPENDENCIES](https://david-dm.org/MohammadYounes/rtlcss.svg)](https://david-dm.org/MohammadYounes/rtlcss) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-blue.svg)](http://standardjs.com/) [![Twitter](https://img.shields.io/badge/follow-%40rtlcss-blue.svg)](https://twitter.com/rtlcss)


<img style="margin:15px" title="RTL CSS" src="https://cloud.githubusercontent.com/assets/4712046/5889219/190f366a-a425-11e4-8ef5-8b5f60a9e903.png" align="right"/>

RTLCSS is a framework for converting Left-To-Right (LTR) Cascading Style Sheets(CSS) to Right-To-Left (RTL).

---
| [Why RTLCSS](#why-rtlcss) | [Install](#install) | [Basic Usage](#basic-usage) | [CLI](#cli) | [Advanced Usage](#advanced-usage) | [Options](#options-object)
| --- | --- | --- | --- | --- | --- |
---
## Introduction

In a right-to-left, top-to-bottom script (commonly shortened to **right to left** or abbreviated **RTL**), writing starts from the right of the page and continues to the left. For example [Arabic script](http://en.wikipedia.org/wiki/Arabic_script) (the most widespread RTL writing system in modern times ).

Web development depends heavily on CSS to create visually engaging webpages, user interfaces for web applications, and user interfaces for many mobile applications. CSS defines how HTML elements are to be displayed via Positioning, Box model, Typographic and Visual properties, such as `left:10px`, `padding-left:1em`, `text-align:right`, ... etc.

Browsers will apply these properties AS IS regardless of the document language direction. This means in order for an international website to support RTL languages, it should adjust the entire CSS to render from right to left.

For example, this is how different github would be if it was to be viewed in an RTL language:

<img width="320" src="https://cloud.githubusercontent.com/assets/4712046/7550690/463dd410-f674-11e4-8a4a-7b26025b79b5.png" align="right"/>

<img width="320" src="https://cloud.githubusercontent.com/assets/4712046/7550689/463a6550-f674-11e4-9f7b-e2d43bf72f1b.png" />

Just like a mirror, where everything gets flipped.

## Why RTLCSS

Instead of authoring two sets of CSS files, one for each language direction. Now you can author the LTR version and RTLCSS will automatically create the RTL counterpart for you!

```CSS
.example {
  display:inline-block;
  padding:5px 10px 15px 20px;
  margin:5px 10px 15px 20px;
  border-style:dotted dashed double solid;
  border-width:1px 2px 3px 4px;
  border-color:red green blue black;
  box-shadow: -1em 0 0.4em gray, 3px 3px 30px black;
}
```

Will be transformed into:

```CSS
.example {
  display:inline-block;
  padding:5px 20px 15px 10px;
  margin:5px 20px 15px 10px;
  border-style:dotted solid double dashed;
  border-width:1px 4px 3px 2px;
  border-color:red black blue green;
  box-shadow: 1em 0 0.4em gray, -3px 3px 30px black;
}
```


## Who's using RTLCSS

* [AlertifyJS]  a javascript framework for developing pretty browser dialogs and notifications.
* [Semantic] a UI component library implemented using a set of specifications designed around natural language.
* [WebEssentials2013] Web Essentials extends Visual Studio with a lot of new features that web developers have been missing for many years.
* [WordPress] WordPress is web software you can use to create a beautiful website or blog.

[Semantic]:http://www.semantic-ui.com/
[AlertifyJS]:http://www.alertifyjs.com/
[WebEssentials2013]:http://vswebessentials.com
[WordPress]:http://wordpress.org/


# Install
    npm install rtlcss

## Basic usage

```javascript
var rtlcss = require('rtlcss');
var result = rtlcss.process("body { direction:ltr; }");
//result == body { direction:rtl; }
```

RTLCSS preserves original input formatting and indentations.

> #### CSS Syntax
> A CSS rule has two main parts: a selector, and one or more declarations:

> ![CSS Syntax](http://www.w3schools.com/css/selector.gif "CSS Syntax")


### Supported CSS Properties (a-z)

`background`
`background-image`
`background-position`
`background-position-x`
`border-bottom-left-radius`
`border-bottom-right-radius`
`border-color`
`border-left`
`border-left-color`
`border-left-style`
`border-left-width`
`border-radius`
`border-right`
`border-right-color`
`border-right-style`
`border-right-width`
`border-style`
`border-top-left-radius`
`border-top-right-radius`
`border-width`
`box-shadow`
`clear`
`cursor`
`direction`
`float`
`left`
`margin`
`margin-left`
`margin-right`
`padding`
`padding-left`
`padding-right`
`right`
`text-align`
`text-shadow`
`transform`
`transform-origin`
`transition`
`transition-property`

### Supported Processing Directives

When RTLing a CSS document, there are cases where it's impossible to know whether to mirror a property value, whether to change a rule selector, or whether to update a non-directional property. In such cases, RTLCSS provides processing directives in the form of CSS comments.
Both standard ```/*rtl:...*/``` and special/important ```/*!rtl:...*/``` notations are supported. Two sets of processing directives are available. **Control** and **Value**.

##### Control Directives:

Control directives are placed before the CSS rule or declaration, such as:
```css
/*rtl:ignore*/
.code{
  direction:ltr;
  text-align:left;
}
```
Or using block style :
```css
/*rtl:begin:ignore*/
.code{
  direction:ltr;
  text-align:left;
}
/*rtl:end:ignore*/
```
Most Control directives support block style with some exceptions due to the nature of the directive.

**Available Control Directives:**

| Directive          |  Block Style | Target   | Description
|:-------------------|:------------:|:------------:|:-------------
| `/*rtl:ignore*/`          |  Yes         | `rule`,`decl`| Ignores processing of the target rule(s) or declaration(s).
| `/*rtl:rename*/`          |  Yes         | `rule`       | Forces selector renaming by applying [String Map](#stringmap-array).
| `/*rtl:raw:{CSS}*/`       |  No          | N/A          | Parses the `{CSS}` parameter and inserts it before the directive.
| `/*rtl:remove*/`          |  Yes         | `rule`,`decl`| Removes the target rule(s) or declaration(s).
| `/*rtl:options:{JSON}*/`  |  Yes         | N/A          | Parses the `{JSON}` parameter and updates RTLCSS options.

   **Example**

```css
/*rtl:begin:options:
{
  "preserveComments": false
}
*/
/* Example CSS */
.example{
  direction:ltr;
}

/*rtl:end:options*/
```

   **Output**

```css
.example{
  direction:rtl;
}
```

##### Value Directives:

Value directives are placed any where inside the declaration value.

**Available Value Directives:**

|   Directive                 |   Description
|:----------------------------|:-----------------------
|   `/*rtl:ignore*/`          |   Ignores processing of this declaration.
|   `/*rtl:{value}*/`         |   Replaces the declaration value with `{value}`.
|   `/*rtl:append:{value}*/`  |   Appends `{value}` to the end of the declaration value.
|   `/*rtl:prepend:{value}*/` |   Prepends `{value}` to the begining of the declaration value.
|   `/*rtl:insert:{value}*/`  |   Inserts `{value}` to where the directive is located inside the declaration value.

   **Example**

```css
body{
  font-family:"Droid Sans", "Helvetica Neue", Arial/*rtl:prepend:"Droid Arabic Kufi", */;
  font-size:16px/*rtl:14px*/;
}
```

   **Output**

```css
body{
  font-family:"Droid Arabic Kufi", "Droid Sans", "Helvetica Neue", Arial;
  font-size:14px;
}
```

## CLI

Convert LTR CSS files to RTL using the command line.

```
$ rtlcss input.css output.rtl.css
```

For usage and available options see [CLI documentaion](https://github.com/MohammadYounes/rtlcss/blob/master/CLI.md).


---
## Advanced usage

```javascript
// directly processes css and return a string containing the processed css
output = rtlcss.process(css [, options , rules, declarations, properties]);
output // processed CSS

// create a new RTLCSS instance, then process css with postcss options (such as source map)
result = rtlcss([options , rules, declarations, properties]).process(css, postcssOptions);
result.css // Processed CSS
result.map // Source map

// you can also group all configuration settings into a single object
result = rtlcss.configure(config).process(css, postcssOptions);
result.css // Processed CSS
result.map // Source map
```

Built on top of [PostCSS], an awesome framework, providing you with the power of manipulating CSS via a JS API.

It can be combined with other processors, such as autoprefixer:

```javascript
var processed = postcss()
  .use(rtlcss([options , rules, declarations, properties]).postcss)
  .use(autoprefixer().postcss)
  .process(css);
```

### options (object)

| Option                  | Default | Description
|:------------------------|:------------|:--------------
|**`autoRename`**         | `true`  | Applies to CSS rules containing no directional properties, it will update the selector by applying [String Map](#stringmap-array).(See [Why Auto-Rename?](https://github.com/MohammadYounes/rtlcss/wiki/Why-Auto-Rename%3F))
|**`greedy`**             | `false` | A `false` value forces selector renaming and url updates to respect word boundaries, for example: `.ultra { ...}` will not be changed to `.urtla {...}`
|**`log`**                | `false` | Outputs information about processed CSS to the console.
|**`preserveComments`**   | `true`  | Preserves modified declarations comments as much as possible.
|**`preserveDirectives`** | `false` | Preserves processing directives.
|**`processUrls`**        | `false` | Applies [String Map](#stringmap-array) to processed URLs.
|**`stringMap`**          | see [String Map](#stringmap-array)  | Applies to string replacement in renamed selectors and updated URLs


### stringMap (Array)

String map is a collection of map objects, where each defines a mapping between directional strings. It is used in  renaming selectors and URL updates. The following is the default string map:
```javascript
[
  {
    'name'    :	'left-right',
    'search'  :	['left', 'Left', 'LEFT'],
    'replace' :	['right', 'Right', 'RIGHT'],
    'options' : {
        'scope': options.processUrls ? '*' : 'selector',
        'ignoreCase': false
      }
  },
  {
    'name'    : 'ltr-rtl',
    'search'  : ['ltr', 'Ltr', 'LTR'],
    'replace' : ['rtl', 'Rtl', 'RTL'],
    'options' :	{
        'scope': options.processUrls ? '*' : 'selector',
        'ignoreCase': false
      }
  }
]
```
To override any of the default maps, just add your own with the same name. A map object consists of the following:

|  Property       |  Type     |  Description
|:----------------|:----------|:--------------
|   **`name`**    | `string`  | Name of the map object
|   **`search`**  | `string` or `Array`  | The string or list of strings to search for or replace with.
|   **`replace`** | `string` or `Array`  | The string or list of strings to search for or replace with.
|   **`options`** | `object`  | Defines map options.

The map `options` is optional, and consists of the following:

|  Property           |  Type     |  Default  |  Description
|:--------------------|:----------|:----------|:--------------
|   **`scope`**       | `string`  | `*`       | Defines the scope in which this map is allowed, `'selector'` for selector renaming, `'url'` for url updates and `'*'` for both.
|   **`ignoreCase`**  | `Boolean` | `true`    | Indicates if the search is case-insensitive or not.
|   **`greedy`**      | `Boolean` | reverts to `options.greedy`  | A `false` value forces selector renaming and url updates to respect word boundaries.

   **Example**

```javascript

// a simple map, for swapping "prev" with "next" and vice versa.
{
  "name"    : "prev-next",
  "search"  : "prev",
  "replace" : "next"
}

// a more detailed version, considering the convention used in the authored CSS document.
{
  "name"    : "prev-next",
  "search"  : ["prev", "Prev", "PREV"],
  "replace" : ["next", "Next", "NEXT"],
  options   : {"ignoreCase":false}
}

```

### plugins (array)

Array of plugins to add more functionality to RTLCSS, or even change it's entire behavior. A plugin is a javascript object consiting of :

|   Property        |   Type    |   Description
|:------------------|:----------|:--------------
|   **`name`**      | `string`  | Name of the plugin.
|   **`priority`**  | `number`  | Used to sort the plugins array before processing the CSS.
|   **`control`**   | `object`  | Object containing control directives.
|   **`property`**  | `array`   | Array containing properties processing directives.
|   **`value`**     | `array`   | Array containing value processing directives.


RTLCSS core functionailty is written as a plugin, and it can be replaced by adding your own with the same name.

### control directive

Control directives are triggered by CSS comments and they consist of the following:

|   Property    |   Type    |   Description
|:--------------|:----------|:--------------
|   **`expect`**| `object`  | an object containing the node types this directive is able to process.
|   **`begin`** | `function`| The function to be called when a comment triggers the start of the directive, it will be passed a `node` and a `context` parameters. the functions is expected to return a boolean, `true` to stop further processing of the rule, otherwise `false`.
|   **`end`**   | `function`| The function to be called when a comment triggers the end of the directive, it will be passed a `node` and a `context` parameters. the functions is expected to return a boolean, `true` to indicate if it has finished, otherwise `false`.

Visit [PostCSS] to find out more about [`rule`](https://github.com/postcss/postcss/blob/master/docs/api.md#rule-node) and  [`decl`](https://github.com/postcss/postcss/blob/master/docs/api.md#decl-node) nodes.

##### **Example**

```javascript
// RTLCSS control directive
'ignore': {
  'expect': {'rule': true, 'decl': true},
  'begin': function (node, cxt) {
    cxt.lockContainer()
    return true
  },
  'end': function (node, cxt) {
    if (cxt.meta.begin !== cxt.meta.end && cxt.util.isLastDecl(node)) {
      cxt.unlockContainer()
      return true
    }
    return false
  }
}
```

### declarations (array)

Array of RTLCSS declaration Processing Instructions (PI), these are applied on the CSS declaration level:

|   Property    |   Type    |   Description
|:--------------|:----------|:--------------
|   **`name`**  | `string`  | Name of the PI (used in logging).
|   **`expr`**  | `RegExp`  | Regular expression object that will be matched against the declaration raw value.
|   **`important`** | `boolean` |   Controls whether to insert the PI at the start or end of the declarations PIs list.
|   **`action`**    | `function`    | The action to be called when a match is found, and it will be passed a `decl` node. the functions is expected to return a boolean, `true` to stop further processing of the declaration, otherwise `false`.

Visit [PostCSS] to find out more about [`decl`](https://github.com/postcss/postcss/blob/master/docs/api.md#declaration-node) node.

##### **Example**

```javascript
// RTLCSS declaration processing instruction
{
    "name"      : "ignore",
    "expr"      : /(?:[^]*)(?:\/\*rtl:ignore)([^]*?)(?:\*\/)/img,
    "important" : true,
    "action"    : function (decl) {
                    if (!config.preserveDirectives)
                        decl._value.raw = decl._value.raw.replace(/\/\*rtl:[^]*?\*\//img, "");
                    return true;
                  }
},
```

### properties (array)

Array of RTLCSS properties Processing Instructions (PI), these are applied on the CSS property level:

|   Property    |   Type    |   Description
|:--------------|:----------|:--------------
|   **`name`**  | `string`  | Name of the PI (used in logging).
|   **`expr`**  | `RegExp`  | Regular expression object that will be matched against the declaration property name.
|   **`important`** | `boolean` |   Controls whether to insert the PI at the start or end of the declarations PIs list.
|   **`action`**    | `function`    | The action to be called when a match is found, it will be passed a `prop` (string holding the CSS property name) and `value` (string holding the CSS property raw value). If `options.preserveComments == true`, comments in the raw value will be replaced by the Unicode Character 'REPLACEMENT CHARACTER' (U+FFFD) &#xfffd; (this is to simplify pattern matching). The function is expected to return an object containing the modified version of the property and its value.

##### **Example**

```javascript
// RTLCSS property processing instruction
{
    "name"      : "direction",
    "expr"      : /direction/im,
    "important" : true,
    "action"    : function (prop, value) {
                    return { 'prop': prop, 'value': util.swapLtrRtl(value) };
                  }
}
```

---
## Bugs and Issues

Have a bug or a feature request? please feel free to [open a new issue](https://github.com/MohammadYounes/rtlcss/issues/new) .



[PostCSS]: https://github.com/postcss/postcss
