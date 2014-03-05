RTLCSS
======
RTLCSS is a framework for transforming cascading style sheets (CSS) from left-to-right (LTR) to right-to-left (RTL). 

> #### CSS Syntax
> A CSS rule has two main parts: a selector, and one or more declarations : 

> ![CSS Syntax](http://www.w3schools.com/css/selector.gif "CSS Syntax")

> The selector is normally the HTML element you want to style. Each declaration consists of a property and a value. The property is the style attribute you want to change. Each property has a value. 

## Install
    npm install rtlcss
## Basic usage
```javascript
var rtlcss = require('rtlcss');
var result = rtlcss.process("body { direction:ltr; }");
//result == body { direction:rtl; }
```
## Supported CSS Properties (A-Z)
`background-image` `background-position` `background` `border-bottom-left-radius` `border-bottom-right-radius` `border-left-color` `border-left-style` `border-left-width` `border-left` `border-radius` `border-right-color` `border-right-style` `border-right-width` `border-right` `border-top-left-radius` `border-top-right-radius` `border-width` `box-shadow` `clear` `cursor`, `direction` `float` `margin-left` `margin` `nav-left` `nav-right` `padding-left` `padding-right` `padding` `right` `text-align` `text-shadow` `transform-origin` `transform` `transition-property` `transition` `left` `margin-right`

## Advanced usage
```javascript
rtlcss.process(css [, options , rules, declarations, properties]);
```
##### options (object)


|    Option    |    Default |   Description
|:--------------|:------------|:--------------
|**`preserveComments`** | `true`  | Preserves original input comments as much as possible.
|**`preserveDirectives`** | `false`  | Preserve original input processing directives.
|**`swapLeftRightInUrl`** | `true`  | Swaps ***left*** and ***right*** in URLs.
|**`swapLtrRtlInUrl`** | `true`  | Swaps ***ltr*** and ***rtl*** in URLs.
|**`swapWestEastInUrl`** | `true`  | Swaps ***west*** and ***east*** in URLs.
|**`autoRename`** | `true`  | Applies to CSS rules containing no directional properties, it will update the selector by swapping ***left***, ***right***, ***ltr***, ***rtl***, ***west*** and ***east***.
|**`greedy`** | `false`  | When set to `true`, ignores word boundary when renaming a selector or updating a url, for example:`.ultra{url(content/bright.png)}` becomes `.urtla{(content/bleft.png)}`
|**`enableLogging`** | `false`  | Outputs information about mirrored declarations to the console.

##### rules (array)
    TBD
##### declarations (array)
    TBD
##### properties (array)
    TBD
## Features
    TBD
