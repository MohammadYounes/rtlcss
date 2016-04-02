# RTLCSS

<img style="margin:15px" title="RTL CSS" src="https://cloud.githubusercontent.com/assets/4712046/5889219/190f366a-a425-11e4-8ef5-8b5f60a9e903.png" align="right"/>

[![GitHub version](https://badge.fury.io/gh/MohammadYounes%2Frtlcss.svg)](http://badge.fury.io/gh/MohammadYounes%2Frtlcss)
[![NPM version](https://badge.fury.io/js/rtlcss.svg)](http://badge.fury.io/js/rtlcss)
[![Build Status](https://travis-ci.org/MohammadYounes/rtlcss.svg?branch=master)](https://travis-ci.org/MohammadYounes/rtlcss)
[![DEPENDENCIES](https://david-dm.org/MohammadYounes/rtlcss.svg)](https://david-dm.org/MohammadYounes/rtlcss)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-blue.svg)](http://standardjs.com/)
[![editor](https://img.shields.io/badge/editor-vscode-blue.svg)](https://code.visualstudio.com/)
[![Twitter](https://img.shields.io/badge/follow-%40rtlcss-blue.svg)](https://twitter.com/rtlcss)

RTLCSS is a framework for converting Left-To-Right (LTR) Cascading Style Sheets(CSS) to Right-To-Left (RTL).

---
| [Why RTLCSS](#why-rtlcss) | [Install](#install) | [Basic Usage](#basic-usage) | [CLI](#cli) | [Advanced Usage](#advanced-usage) | [Options](#options-object) | [:coffee::satisfied:](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YC28CZLKL4LMC)|
|---------------------------|---------------------|-----------------------------|-------------|-----------------------------------|----------------------------|-----------------------------------------------------------------------------------------------------------------------|
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

* [AlertifyJS] a javascript framework for developing pretty browser dialogs and notifications.
* [GlobaLeaks] a whistleblowing framework built using AngularJS, Bootstrap and Twisted.
* [Semantic] a UI component library implemented using a set of specifications designed around natural language.
* [WebEssentials2013] Web Essentials extends Visual Studio with a lot of new features that web developers have been missing for many years.
* [WordPress] WordPress is web software you can use to create a beautiful website or blog.

[AlertifyJS]:http://www.alertifyjs.com/
[GlobaLeaks]:https://github.com/globaleaks/GlobaLeaks
[Semantic]:http://www.semantic-ui.com/
[WebEssentials2013]:http://vswebessentials.com
[WordPress]:https://wordpress.org/


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


### Supported CSS Properties
|                             |                             |                        |
|:----------------------------|:----------------------------|:-----------------------|
| `background`                | `border-right-color`        | `margin`               |
| `background-image`          | `border-right-style`        | `margin-left`          |
| `background-position`       | `border-right-width`        | `margin-right`         |
| `background-position-x`     | `border-style`              | `padding`              |
| `border-bottom-left-radius` | `border-top-left-radius`    | `padding-left`         |
| `border-bottom-right-radius`| `border-top-right-radius`   | `padding-right`        |
| `border-color`              | `border-width`              | `right`                |
| `border-left`               | `box-shadow`                | `text-align`           |
| `border-left-color`         | `clear`                     | `text-shadow`          | 
| `border-left-style`         | `cursor`                    | `transform`            |
| `border-left-width`         | `direction`                 | `transform-origin`     |
| `border-radius`             | `float`                     | `transition`           |
| `border-right`              | `left`                      | `transition-property`  |
  
### Supported Directives

When RTLing a CSS document, there are cases where it's impossible to know whether to mirror a property value, whether to change a rule selector, or whether to update a non-directional property. In such cases, RTLCSS provides processing directives in the form of CSS comments.
Both standard ```/*rtl:...*/``` and special/important ```/*!rtl:...*/``` notations are supported. 

Two sets of directives are available. **Control** and **Value**.

#### Control Directives:

Control directives are placed between declarations or statements (rules and at-rules), They can target one node (self-closing) or a set of nodes (block-syntax).

* Self-closing
```css
.code {
  /*rtl:ignore*/
  direction:ltr;
  /*rtl:ignore*/
  text-align:left;
}
```
* Block-syntax
```css
.code {
  /*rtl:begin:ignore*/
  direction:ltr;
  text-align:left;
  /*rtl:end:ignore*/
}
```

**Available Control Directives:**

|  Name        | Syntax                    | Description
|:-------------|:--------------------------|:-----------
|  Ignore      | `/*rtl:ignore*/`          | Ignores processing of the following node (self-closing) or nodes within scope (block-syntax).
|  Config      | `/*rtl:config:{OBJECT}*/` | Evaluates the `{OBJECT}` parameter and updates current RTLCSS config<sup>*1</sup>.
|  Options     | `/*rtl:options:{JSON}*/`  | Parses the `{JSON}` parameter and updates current RTLCSS options<sup>*2</sup>.
|  Raw         | `/*rtl:raw:{CSS}*/`       | Parses the `{CSS}` parameter and inserts it before the comment node that triggered the directive<sup>*3</sup>.
|  Remove      | `/*rtl:remove*/`          | Removes the following node (self-closing) or nodes within scope (block-syntax).
|  Rename      | `/*rtl:rename*/`          | Renames the selector of the following rule (self-closing) or rules within scope (block-syntax) by applying [String Maps](#stringmap-array).

#### Remarks

 * **<sup>1</sup>** Config is evaluated using `eval`, and it can be disabled by adding it to the `blacklist`. 
 * **<sup>2</sup>** Options parsing is done via `JSON.parse`, and requires a valid json. The new options will override the defaults (not the current context). Plugins will be carried over from the current context.
 * **<sup>3</sup>** Due to the nature of *RAW* directive, block-syntax is not supported.

**Example**

```css
/*rtl:begin:options:
{
  "autoRename": true,
  "stringMap":[
    {
      "name"    : "prev-next",
      "search"  : ["prev", "Prev", "PREV"],
      "replace" : ["next", "Next", "NEXT"],
      "options" : {"ignoreCase":false}
    }]
}*/
.demo-prev, .demo-Prev, .demo-PREV { content: 'p'; }
.demo-next, .demo-Next, .demo-NEXT { content: 'n'; }
/*rtl:end:options*/
```

**Output**

```css
.demo-next, .demo-Next, .demo-NEXT { content: 'p'; }
.demo-prev, .demo-Prev, .demo-PREV { content: 'n'; }
```

#### Value Directives:

Value directives are placed any where inside the declaration value. They target the containing declaration node.

**Available Value Directives:**

|  Name        |    Syntax                   |   Description
|:-------------|:----------------------------|:-----------------------
| Append       |   `/*rtl:append:{value}*/`  |   Appends `{value}` to the end of the declaration value.
| Ignore       |   `/*rtl:ignore*/`          |   Ignores processing of this declaration.
| Insert       |   `/*rtl:insert:{value}*/`  |   Inserts `{value}` to where the directive is located inside the declaration value.
| Prepend      |   `/*rtl:prepend:{value}*/` |   Prepends `{value}` to the begining of the declaration value.
| Replace      |   `/*rtl:{value}*/`         |   Replaces the declaration value with `{value}`.

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

Convert LTR CSS files to RTL using the command line. For usage and available options see [CLI documentaion].

```
$ rtlcss input.css output.rtl.css
```

## Task Runners
 * **Grunt**: [grunt-rtlcss](https://github.com/MohammadYounes/grunt-rtlcss)
 * **Gulp**: [gulp-rtlcss](https://github.com/jjlharrison/gulp-rtlcss)

---
## Advanced usage

```javascript
// directly processes css and return a string containing the processed css
output = rtlcss.process(css [, options , plugins]);
output // processed CSS

// you can also group all configuration settings into a single object
result = rtlcss.configure(config).process(css, postcssOptions);
result.css // Processed CSS
result.map // Source map
```

Built on top of [PostCSS], an awesome framework, providing you with the power of manipulating CSS via a JS API.

It can be combined with other processors, such as autoprefixer:

```javascript
var result = postcss().use(rtlcss([options , plugins]))
                      .use(autoprefixer())
                      .process(css);
```

### options (object)

| Option                  | Type                 | Default  | Description
|:------------------------|:--------------------:|:--------:|:--------------
|**`autoRename`**         | `boolean`            | `false`  | Applies to CSS rules containing no directional properties, it will update the selector by applying [String Maps](#stringmap-array).(See [Why Auto-Rename?](https://github.com/MohammadYounes/rtlcss/wiki/Why-Auto-Rename%3F))
|**`autoRenameStrict`**   | `boolean`            | `false`  | Ensures `autoRename` is applied only if pair exists.
|**`blacklist`**          | `object`             | `{}`     | An object map of disabled plugins directives, where keys are plugin names and value are object hash of disabled directives. e.g. `{'rtlcss':{'config':true}}`.
|**`clean`**              | `boolean`            | `true`   | Removes directives comments from output CSS.
|**`greedy`**             | `boolean`            | `false`  | Fallback value for [String Maps](#stringmap-array) options.
|**`processUrls`**        | `boolean` or `object`| `false`  | Applies [String Maps](#stringmap-array) to URLs. You can also target specific node types using an object literal. e.g. `{'atrule': true, 'decl': false}`.
|**`stringMap`**          | `array`              |          | The default array of [String Maps](#stringmap-array).


### stringMap (Array)

String map is a collection of map objects, where each defines a mapping between directional strings. It is used in renaming selectors and URL updates.

The following is the default string map:
```javascript
[
  {
    'name'    : 'left-right',
    'priority': 100,
    'search'  : ['left', 'Left', 'LEFT'],
    'replace' : ['right', 'Right', 'RIGHT'],
    'options' : {
        'scope' : '*',
        'ignoreCase' : false
      }
  },
  {
    'name'    : 'ltr-rtl',
    'priority': 100,
    'search'  : ['ltr', 'Ltr', 'LTR'],
    'replace' : ['rtl', 'Rtl', 'RTL'],
    'options' :	{
        'scope' : '*',
        'ignoreCase' : false
      }
  }
]
```
To override any of the default maps, just add your own with the same name. A map object consists of the following:

|  Property        |  Type     |  Description
|:-----------------|:----------|:--------------
|   **`name`**     | `string`  | Name of the map object
|   **`priority`** | `number`  | Maps are sorted according to prioirity.
|   **`exclusive`**| `boolean` | When enabled, prevents applying the remaining maps.
|   **`search`**   | `string` or `Array`  | The string or list of strings to search for or replace with.
|   **`replace`**  | `string` or `Array`  | The string or list of strings to search for or replace with.
|   **`options`**  | `object`  | Defines map options.

The map `options` attribute is optional, and consists of the following:

|  Property           |  Type     |  Default  |  Description
|:--------------------|:----------|:----------|:--------------
|   **`scope`**       | `string`  | `*`       | Defines the scope in which this map is allowed, `'selector'` for selector renaming, `'url'` for url updates and `'*'` for both.
|   **`ignoreCase`**  | `boolean` | `true`    | Indicates if the search is case-insensitive or not.
|   **`greedy`**      | `boolean` | `options.greedy`   | When enabled, string replacement will NOT respect word boundaries. i.e. `.ultra { ...}` will be changed to `.urtla {...}`



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

Array of plugins to add more functionality to RTLCSS, or even change it's entire behavior. See [Writing an RTLCSS Plugin].

---
## Bugs and Issues

Have a bug or a feature request? please feel free to [open a new issue](https://github.com/MohammadYounes/rtlcss/issues/new) .

## Release Notes

To view changes in recent versions, see the [CHANGELOG](CHANGELOG.md).

[PostCSS]: https://github.com/postcss/postcss
[CLI documentaion]: docs/CLI.md
[Writing an RTLCSS Plugin]: docs/writing-a-plugin.md
