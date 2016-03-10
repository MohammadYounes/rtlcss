Writing an RTLCSS Plugin
=====

Add more functionality to RTLCSS, or even change it's entire behavior. In fact, RTLCSS core functionailty is written as a plugin, and it can be replaced by adding your own plugin with the same name.


## Plugin Definition Object

A plugin is an object, that defines the plugin properties :

```js
// minimal plugin definition
{
  'name': 'sample plugin',
  'priority': 100,
  'directives': {
    'control': {},
    'value': []
  },
  'processors': []
}
```
The attributes are:

* `name` `{string}`

  Name of the plugin

* `priority` `{number}`

  The priority is used to sort the plugins array before processing input CSS, the core RTLCSS plugin has a priority value of `100`.


* `directives` `{object}`

  The object holding both [control](#control-directives) & [value](#value-directives) directives.

    * `control` `{object}`

    An object map of [control directives](#control-directives) where keys are the names and values are the [control directives definition object](#control-directive-defintion-object).

    The key itself act as the trigger of the directive.
    ```js
    'control': {
      // triggered via /*rtl:custom*/ or /*rtl:begin:custom*/ ... /*rtl:end:custom*/
      'custom': {
          ...
        }
      }
    ```
    
    * `value` `{array}`

    An array of [value directives](#value-directives) where items are [value directive definition object](#value-directive-defintion-object).

    The name itself act as the trigger of the directive.

    ```js
    'value': [
        {
          // triggered via /*rtl:custom*/ inside declaration values
          'name': 'custom',
          'action': function (decl, expr, context) { ... }
        }
    ]
    ```

* `processors` `{array}`

 An array of [declaration processors](#declaration-processors) where items are [declaration processor definition object](#declaration-processor-definition-object).

 These are triggered by matching CSS properties against processor `expr` attribute.
 ```js
 'processors': [
    {
      // triggered via content property
      'expr': /content/i,
      'action': function (prop, value, context) { ... }
    }
 ]
 ```

    

## Control Directives

Control directives are triggered by CSS comments found between declarations or statements (rules and at-rules). They support processing any node type and can target one node (self-closing) or a set of nodes (block-syntax).

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

**Important**: Control directives are NOT triggered by comments inside selectors, at-rule parameters, or declaration values.

### Control directive defintion object

The definition of a control directive has the following attributes:

* `expect` `{object}`

  An **object hash** defining the node types this directive is excpected to process, where keys are strings of node types and values are booleans.
    * `atrule`: At-rule node.
    * `comment`: Comment node.
    * `decl`: Declaration node.
    * `rule`: Rule node.
    * `self`: Comment node that triggred the directive.
    > Find out more about node types at [PostCSS API] documentation.
      
  **Note**: Omitted keys are considred to have a `false` value.
    ```js
    "expect": { "rule" : true, "self" : true }
    ```

* `begin` `{function}`

  The begin function is responsible for processing nodes of the expected types. It is executed each time a node with the excpected type is encountered.
  ```js
  'begin': function (node, metadata, context) { ... }
  ```
    * `node` `{node}`: [PostCSS] node to be processed.
    * `metadata` `{metadata}`: The [metadata object](#metadata-object) associated with the directive.
    * `context` `{context}`: The current RTLCSS [context object](#context-object).

 It must return a `boolean` value to indicate if it is allowed to process this node by other directives or not.
    * `true`: prevent further processing.
    * `false`: allow further processing.

* `end` `{function}`

  The end function is responsible for cleanup and deactivation. It is executed after processing the expected node (if it was self-closing) or when the directive end statement (block-syntax) is encountred.
  ```js
  'end': function (node, metadata, context) { ... }
  ```
    * `node` `{node}`: [PostCSS] node to be processed.
    * `metadata` `{metadata}`: The [metadata object](#metadata-object) associated with the directive.
    * `context` `{context}`: The current RTLCSS [context object](#context-object).

 It must return a `boolean` value to indicate if the directive has finished and should be deactivated or not.
    * `true`: deactivate.
    * `false`: keep active.

#### Example
```js
 // a control directive definition to ignore processing one node or a set of nodes.
 // triggered via: /*rtl:ignore*/ or /*rtl:begin:ignore*/
'ignore': {
  // the expected node types
  'expect': { 'atrule': true, 'comment': true, 'decl': true, 'rule': true },
  // prevent processing of all nodes except comments indicating the end of this directive
  'begin': function (node, metadata, context) {
    var prevent = true
    if (node.type === 'comment' &&
       (node.text === '!rtl:end:ignore' || node.text === 'rtl:end:ignore')) {
      prevent = false
    }
    return prevent
  },
  // deactivate the directive:
  // 1. triggered by comment (rtl:end:ignore), since other comments are already ignored.
  // 2. last declaration is reached (rule level self-closing)
  'end': function (node, metadata, context) {
    if (node.type === 'comment' || node.type === 'decl' && context.util.isLastOfType(node)) {
      return true
    }
    return false
  }
}
```

## Value Directives

Value directives are triggered by CSS comments found inside delcaration values and can be placed any where inside the declaration value. 
They are either named `/*rtl:{name}:{value}*/` or nameless `/*rtl:{value}*/`.
```css
body {
  font-family:"Droid Sans", Tahoma/*rtl:prepend:"Droid Arabic Kufi",*/;
  font-size:14px/*rtl:16px*/;
}
```

### Value directive defintion object

The definition of a value directive has the following attributes:

* `name` `{string}`

  The directive name, which also happens to be the actual name used to trigger the directive. (i.e `/*rtl:custom*/` will trigger the directive named "custom").
  ```js
  // triggered via /*rtl:ignore*/
  "name": "ignore"
  ```  
  If left empty, it will be match any comment starting with `/*rtl:...`
  ```js
  // triggered via /*rtl:....*/
  "name": ""
  ```
  **Important**: Value directives are matched one by one according to their order in the containing array, place the generic ones at the end.

* `action` `{function}`

  The action function is responsible for processing the declaration value, It is executed each time a matching comment is found inside the declaration value.
  ```js
  'action': function (decl, expr, context) { ... }
  ```
    * `decl` `{node}`: [PostCSS `decl`] node to be processed.
    * `expr` `{RegExp}`: The constructed regular expression used to match the directive, it has one capturing group matching the value of the directive.
    
    ```js
    {
        'name': 'custom',
        'action': function (decl, expr, context) {
            //assuming raw value === "a /*rtl:custom:data*/ b"
            decl.raws.value.raw.replace(expr, function(match, value, index, string){            
                //match  => "/*rtl:custom:data*/"
                //value  => "data"
                //index  => 2
                //string => "a /*rtl:custom:data*/ b"
            }
        }
    }
    ```
    * `context` `{context}`: The current RTLCSS [context object](#context-object).

  It must return a `boolean` value to indicate if it is allowed to process this `decl` by other directives or not.
    * `true`: prevent further processing.
    * `false`: allow further processing.

#### Example
```js
// a value directive definition to replace the declaration value
// triggered via: /*rtl: ... */
{
  // expected to match any comment starting with "rtl:"
  'name': '', 
  'action': function (decl, expr, context) {
    decl.raws.value.raw.replace(expr, function (match, value) {
      decl.raws.value.raw = value + match
    })
    //prevent further processing of this node
    return true
  }
}
```
#### Remarks
You might wonder why such difference exists between [control](#control-directives) and [value](#value-directives) directives. Well, This is due to:

1. Backward compatibility, I wanted users to be able to upgrade to v2 without having to revisit their CSS files, they only need to change RTLCSS configuration. 
So, In order to support the "Replace" directive `/*rtl:{value}*/`, all directives names need to be known in advance.
2. [PostCSS] does not treat CSS comments found inside delcaration values as nodes.


## Declaration Processors

Declaration processors are triggered by CSS property names

### Declaration processor definition object

The definition of a property processor has the following attributes:

* `expr` `{RegExp}`

  A Regular expression object that will be matched against the declaration property name.

  ```js
  // match content property
  'expr': /content/i
  ```
* `action` `{function}`

  The action function is responsible for processing the declaration. It is executed each time a match is found.
  ```js
  'action': function (prop, value, context) { ... }
  ```
    * `prop` `{string}`: The CSS property name.
    * `value` `{string}`: The CSS property raw value, Note that comments in the raw value will be replaced by the Unicode Character `'REPLACEMENT CHARACTER' (U+FFFD) �` (this is to preserve original formatting and simplify pattern matching).
    * `context` `{context}`: The current RTLCSS [context object](#context-object).

  It must return an object containing two keys (`prop` and `value`).
  ```js
  return { 'prop': prop, 'value': value }
  ```

#### Example
```js
{
  // match any CSS property ending in 'transition' or 'transition-property'
  'expr': /transition(-property)?$/i,
  // simply swap left/right
  'action': function (prop, value, context) {
    return { 'prop': prop, 'value': context.util.swapLeftRight(value) }
  }
}
```


----------------
## Metadata object

The metadata object provides access to directive related information.

|   Property    |   Type        |   Description
|:--------------|:-------------:|:--------------
| **`source`**  | `node`        | Postcss [PostCSS `comment`] node that triggered the directive.
| **`name`**    | `string`      | The directive name, e.g. `ignore` in `/*rtl:ignore*/`.
| **`param`**   | `string`      | The directive paramter, e.g. `{"clean":false}` in `/*rtl:options:{"clean":false}*/`.
| **`begin`**   | `boolean`     | Indicates the start of the directive scope*<sup>1</sup>.
| **`end`**     | `boolean`     | Indicates the end of the directive scope*<sup>1</sup>.

#### Remarks
  *<sup>1</sup> Self-closing [control directives](#control-directives) will have both `begin` and `end` set to `true`.
  
## Context object

The context object provides access to [postcss], current configuration and internal utilities.

```js
context = {
  // provides access to postcss
  'postcss': postcss,
  // provides access to the current configuration
  'config': configuration,
  // provides access to utilities object
  'util': util.configure(configuration)
}
```

[PostCSS]: https://github.com/postcss/postcss
[PostCSS API]: https://github.com/postcss/postcss/blob/master/docs/api.md
[PostCSS `atrule`]: https://github.com/postcss/postcss/blob/master/docs/api.md#atrule-node
[PostCSS `rule`]: https://github.com/postcss/postcss/blob/master/docs/api.md#rule-node
[PostCSS `decl`]: https://github.com/postcss/postcss/blob/master/docs/api.md#decl-node
[PostCSS `comment`]: https://github.com/postcss/postcss/blob/master/docs/api.md#comment-node
