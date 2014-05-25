[![GitHub version](https://badge.fury.io/gh/MohammadYounes%2Frtlcss.svg)](http://badge.fury.io/gh/MohammadYounes%2Frtlcss)
[![Build Status](https://travis-ci.org/MohammadYounes/rtlcss.svg?branch=master)](https://travis-ci.org/MohammadYounes/rtlcss)
[![NPM version](https://badge.fury.io/js/rtlcss.svg)](http://badge.fury.io/js/rtlcss)
<img title="RTL CSS" width="72" src="https://cloud.githubusercontent.com/assets/4712046/2626144/fdcdec7c-bdbe-11e3-8e3a-c88b6d8a7dfe.png" align="right">

RTLCSS
======
RTLCSS is a framework for converting LTR CSS to RTL.
> #### CSS Syntax
> A CSS rule has two main parts: a selector, and one or more declarations : 

> ![CSS Syntax](http://www.w3schools.com/css/selector.gif "CSS Syntax")

> The selector is normally the HTML element you want to style. Each declaration consists of a property and a value. The property is the style attribute you want to change. Each property has a value. 

### Powered by RTLCSS

* [Semantic] a UI library implemented using a set of specifications designed around natural language.
[Semantic]:http://www.semantic-ui.com


## Install
    npm install rtlcss
## Basic usage
```javascript
var rtlcss = require('rtlcss');
var result = rtlcss.process("body { direction:ltr; }");
//result == body { direction:rtl; }
```

> RTLCSS preserves original input formatting and indentations.


### Supported CSS Properties (a-z)

`background-image` `background-position` `background` `border-bottom-left-radius` `border-bottom-right-radius` `border-left-color` `border-left-style` `border-left-width` `border-left` `border-radius` `border-right-color` `border-right-style` `border-right-width` `border-right` `border-top-left-radius` `border-top-right-radius` `border-width` `box-shadow` `clear` `cursor` `direction` `float` `margin-left` `margin` `nav-left` `nav-right` `padding-left` `padding-right` `padding` `right` `text-align` `text-shadow` `transform-origin` `transform` `transition-property` `transition` `left` `margin-right`

### Supported Processing Directives

When RTLing a CSS document, there are cases where its impossible to know if the property value should be mirrored or not! If the rule selector need to be changed! Or a none directional property have to be updated. In such cases, RTLCSS provides processing directives in the form of CSS comments ```/*rtl:...*/```:

Two sets of processing directives are available, on Rule and Declaration level.


##### Rule Level Directives:
> Rule level directives are placed before the CSS rule.

|   Directive   |   Description
|:--------------|:-----------------------
|   `/*rtl:ignore*/`    |   Ignores processing of this rule.
|   `/*rtl:rename*/`    |   Forces selector renaming by swapping ***left***, ***right***, ***ltr***, ***rtl***, ***west*** and ***east***.



   **Example**
```CSS
/*rtl:ignore*/
.code{
  direction:ltr;
  text-align:left;
}
```
   **Output**
```CSS
.code{
  direction:ltr;
  text-align:left;
}
```

##### Declaration Level Directives:
> Declaration level directives are  placed any where inside the declaration value.
   
|   Directive   |   Description
|:--------------|:-----------------------
|   `/*rtl:ignore*/`    |   Ignores processing of this declaration.
|   `/*rtl:{value}*/`    |   Replaces the declaration value with `{value}`.
|   `/*rtl:append:{value}*/`    |   Appends `{value}` to the end of the declaration value.
|   `/*rtl:prepend:{value}*/`    |   Prepends `{value}` to the begining of the declaration value.
|   `/*rtl:insert:{value}*/`    |   Inserts `{value}` to where the directive is located inside the declaration value.

   **Example**

```CSS
body{
  font-family:"Droid Sans", "Helvetica Neue", Arial/*rtl:prepend:"Droid Arabic Kufi", */;
  font-size:16px/*rtl:14px*/;
}
```
   **Output**
```CSS
body{
  font-family:"Droid Arabic Kufi", "Droid Sans", "Helvetica Neue", Arial;
  font-size:14px;
}
```
---
## Advanced usage

```javascript
rtlcss.process(css [, options , rules, declarations, properties]);
```
> Built on top of [PostCSS], an awesome framework, providing you with the power of manipulating CSS via a JS API.

> It can be combined with other processors, such as autoprefixer:
```javascript
var processed = postcss()
  .use(rtlcss(/* options , rules, declarations, properties*/).postcss)
  .use(autoprefixer().postcss)
  .process(css);
```

### options (object)


|    Option    |    Default |   Description
|:--------------|:------------|:--------------
|**`preserveComments`** | `true`  | Preserves modified declarations comments as much as possible.
|**`preserveDirectives`** | `false`  | Preserves processing directives.
|**`swapLeftRightInUrl`** | `true`  | Swaps ***left*** and ***right*** in URLs.
|**`swapLtrRtlInUrl`** | `true`  | Swaps ***ltr*** and ***rtl*** in URLs.
|**`swapWestEastInUrl`** | `true`  | Swaps ***west*** and ***east*** in URLs.
|**`autoRename`** | `true`  | Applies to CSS rules containing no directional properties, it will update the selector by swapping ***left***, ***right***, ***ltr***, ***rtl***, ***west*** and ***east***.([more info](https://github.com/MohammadYounes/rtlcss/wiki/Why-Auto-Rename%3F))
|**`greedy`** | `false`  | Forces selector renaming and url updates to respect word boundaries, for example: `.ultra { ...}` will not be changed to `.urtla {...}` 
|**`enableLogging`** | `false`  | Outputs information about mirrored declarations to the console.
|**`minify`** | `false`  | Minifies output CSS, when set to `true` both `preserveDirectives` and `preserveComments` will be set to `false` .
|**`postcssOptions`** | `{}`  | POSTCSS options object.

### rules (array)
Array of RTLCSS rule Processing Instructions (PI), these are applied on the CSS rule level:

|   Property    |   Type    |   Description
|:--------------|:----------|:--------------
|   **`name`**  | `string`  | Name of the PI (used in logging).
|   **`expr`**  | `RegExp`  | Regular expression object that will be matched against the comment preceeding the rule.
|   **`important`** | `boolean` |   Controls whether to insert the PI at the start or end of the rules PIs list.
|   **`action`**    | `function`    | The action to be called when a match is found, and it will be passed a `rule` node. the functions is expected to return a boolean, `true` to stop further processing of the rule, otherwise `false`.

> Visit [PostCSS] to find out more about [`rule`](https://github.com/ai/postcss#rule-node) node.

##### **Example**
``` JAVASCRIPT
//RTLCSS rule processing instruction
{
  "name"        : "ignore",
  "expr"        : /\/\*rtl:ignore\*\//img,
  "important"   : true,
  "action"      : function (rule) {
                    return  true;
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

> Visit [PostCSS] to find out more about [`decl`](https://github.com/ai/postcss#declaration-node) node.

##### **Example**

``` JAVASCRIPT
//RTLCSS declaration processing instruction
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
|   **`expr`**  | `RegExp`  | Regular expression object that will be matched against the declaration raw value.
|   **`important`** | `boolean` |   Controls whether to insert the PI at the start or end of the declarations PIs list.
|   **`action`**    | `function`    | The action to be called when a match is found, it will be passed a `prop` (string holding the CSS property name) and `value` (string holding the CSS property raw value). If `options.preserveComments == true`, comments in the raw value will be replaced by the Unicode Character 'REPLACEMENT CHARACTER' (U+FFFD) &#xfffd; to simplify pattern matching. The functions is expected to return an object containing the modified version of the property and its value.



##### **Example**
``` JAVASCRIPT
//RTLCSS property processing instruction
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


## Release Notes
* **v0.4.0** [5 Apr. 2014]
  * Fix flipping transform-origin.
  * Update autoRename to search for all swappable words.
  
* **v0.3.0** [5 Apr. 2014]
  * Support flipping rotateZ.
  * Fix flipping rotate3d.
  * Fix flipping skew, skewX and skewY.
  * Fix flipping cursor value.
  * Fix flipping translate3d.  
  * Update flipping background horizontal position to treat 0 as 0%
  
* **v0.2.1** [20 Mar. 2014]
  * Upgrade to [POSTCSS] v0.3.4
  
* **v0.2.0** [20 Mar. 2014]
  * Support combining with other processors.
  * Support rad, grad & turn angle units when flipping linear-gradient
  * Fix typo in config.js
  
* **v0.1.3** [7 Mar. 2014]
  * Fix missing include in rules.js

* **v0.1.2** [5 Mar. 2014]
  * New option: minify output CSS. 
  * Updated README.md

* **v0.1.1** [4 Mar. 2014]
  * Initial commit.
 
[PostCSS]: https://github.com/ai/postcss
