var assert = require("assert");
var rtlcss = require("../lib/rtlcss.js");
var tests = {
  'Background:': [
      {
        'should': 'Should treat 0 as 0%',
        'expected': '.banner { background: 100% top url(topbanner.png) #00D repeat-y fixed; }',
        'input': '.banner { background: 0 top url(topbanner.png) #00D repeat-y fixed; }',
        'reversable': false
      },
      {
        'should': 'Should complement percentage horizontal position',
        'expected': '.banner { background: 81% top url(topbanner.png) #00D repeat-y fixed; }',
        'input': '.banner { background: 19% top url(topbanner.png) #00D repeat-y fixed; }',
        'reversable': true
      },
      {
        'should': 'Should complement calc horizontal position',
        'expected': '.banner { background: calc(100%-(19% + 2px)) top url(topbanner.png) #00D repeat-y fixed; }',
        'input': '.banner { background: calc(19% + 2px) top url(topbanner.png) #00D repeat-y fixed; }',
        'reversable': false
      },
      {
        'should': 'Should mirror keyword horizontal position',
        'expected': '.banner { background: right top url(topbanner.png) #00D repeat-y fixed; }',
        'input': '.banner { background: left top url(topbanner.png) #00D repeat-y fixed; }',
        'reversable': true
      },
      {
        'should': 'Should swap left with right in url',
        'expected': '.banner { background: 10px top url(top-left-banner.png) #00D repeat-y fixed; }',
        'input': '.banner { background: 10px top url(top-right-banner.png) #00D repeat-y fixed; }',
        'reversable': true
      },
      {
        'should': 'Should swap ltr with rtl in url',
        'expected': '.banner { background: 10px top url(rtl-banner.png) #00D repeat-y fixed; }',
        'input': '.banner { background: 10px top url(ltr-banner.png) #00D repeat-y fixed; }',
        'reversable': true
      },
      {
        'should': 'Should swap west with east in url',
        'expected': '.banner { background: 10px top url(east-banner.png) #00D repeat-y fixed; }',
        'input': '.banner { background: 10px top url(west-banner.png) #00D repeat-y fixed; }',
        'reversable': true
      },
      {
        'should': 'Should not swap bright:bleft, ultra:urtla, westing:easting',
        'expected': '.banner { background: 10px top url(ultra/westing/bright.png) #00D repeat-y fixed; }',
        'input': '.banner { background: 10px top url(ultra/westing/bright.png) #00D repeat-y fixed; }',
        'reversable': true
      },
      {
        'should': 'Should swap bright:bleft, ultra:urtla, westing:easting (greedy)',
        'expected': '.banner { background: 10px top url(urtla/easting/bleft.png) #00D repeat-y fixed; }',
        'input': '.banner { background: 10px top url(ultra/westing/bright.png) #00D repeat-y fixed; }',
        'reversable': true,
        'options': { 'greedy': true }
      }
  ],
  'Background Image:': [
      {
        'should': 'Should swap left with right in url',
        'expected': 'div { background-image: url(images/left.png), url(images/right.png);}',
        'input': 'div { background-image: url(images/right.png), url(images/left.png);}',
        'reversable': true
      },
      {
        'should': 'Should swap ltr with rtl in url',
        'expected': 'div { background-image: url(images/ltr.png), url(images/rtl.png);}',
        'input': 'div { background-image: url(images/rtl.png), url(images/ltr.png);}',
        'reversable': true
      },
      {
        'should': 'Should swap west with east in url',
        'expected': 'div { background-image: url(images/west.png), url(images/east.png);}',
        'input': 'div { background-image: url(images/east.png), url(images/west.png);}',
        'reversable': true
      },
      {
        'should': 'Should not negate color value for linear gradient',
        'expected': 'div { background-image: linear-gradient(rgba(255, 255, 255, 0.3) 0%, #ff8 100%);}',
        'input': 'div { background-image: linear-gradient(rgba(255, 255, 255, 0.3) 0%, #ff8 100%);}',
        'reversable': true
      },
      {
        'should': 'Should not negate color value for linear gradient with calc',
        'expected': 'div { background-image: linear-gradient(rgba(255, 255, calc((125 * 2) + 5), 0.3) 0%, #ff8 100%);}',
        'input': 'div { background-image: linear-gradient(rgba(255, 255, calc((125 * 2) + 5), 0.3) 0%, #ff8 100%);}',
        'reversable': true
      },
      {
        'should': 'Should negate angle value for linear gradient',
        'expected': 'div { background-image: linear-gradient(13.25deg, rgba(255, 255, 255, .15) 25%, transparent 25%);}',
        'input': 'div { background-image: linear-gradient(-13.25deg, rgba(255, 255, 255, .15) 25%, transparent 25%);}',
        'reversable': true
      }
  ],
  'Background Position:': [
      {
        'should': 'Should complement percentage horizontal position ',
        'expected': 'div {background-position:100% 75%;}',
        'input': 'div {background-position:0 75%;}',
        'reversable': false
      },
      {
        'should': 'Should complement percentage horizontal position with calc',
        'expected': 'div {background-position:calc(100%-(30% + 50px)) 75%;}',
        'input': 'div {background-position:calc(30% + 50px) 75%;}',
        'reversable': false
      },
      {
        'should': 'Should complement percentage horizontal position ',
        'expected': 'div {background-position:81.25% 75%, 10.75% top;}',
        'input': 'div {background-position:18.75% 75%, 89.25% top;}',
        'reversable': true
      },
      {
        'should': 'Should complement percentage horizontal position with calc',
        'expected': 'div {background-position:calc(100%-(30% + 50px)) calc(30% + 50px), 10.75% top;}',
        'input': 'div {background-position:calc(30% + 50px) calc(30% + 50px), 89.25% top;}',
        'reversable': false
      },
      {
        'should': 'Should swap left with right',
        'expected': 'div {background-position:right 75%, left top;}',
        'input': 'div {background-position:left 75%, right top;}',
        'reversable': true
      },
      {
        'should': 'Should swap left with right wit calc',
        'expected': 'div {background-position:right -ms-calc(30% + 50px), left top;}',
        'input': 'div {background-position:left -ms-calc(30% + 50px), right top;}',
        'reversable': true
      },
      {
        'should': 'Should complement percentage: position-x (treat 0 as 0%)',
        'expected': 'div {background-position-x:100%, 0%;}',
        'input': 'div {background-position-x:0, 100%;}',
        'reversable': false
      },
      {
        'should': 'Should complement percentage: position-x',
        'expected': 'div {background-position-x:81.75%, 11%;}',
        'input': 'div {background-position-x:18.25%, 89%;}',
        'reversable': true
      },
      {
        'should': 'Should complement percentage with calc: position-x',
        'expected': 'div {background-position-x:calc(100%-(30% + 50px)), -webkit-calc(100%-(30% + 50px));}',
        'input': 'div {background-position-x:calc(30% + 50px), -webkit-calc(30% + 50px);}',
        'reversable': false
      },
      {
        'should': 'Should swap left with right: position-x',
        'expected': 'div {background-position-x:right, left;}',
        'input': 'div {background-position-x:left, right;}',
        'reversable': true
      },
      {
        'should': 'Should keep as is: position-x',
        'expected': 'div {background-position-x:100px, 0px;}',
        'input': 'div {background-position-x:100px, 0px;}',
        'reversable': true
      }
  ],
  'Mirrored Properties:': [
      {
        'should': 'Should mirror property name: border-top-right-radius',
        'expected': 'div { border-top-left-radius:15px; }',
        'input': 'div { border-top-right-radius:15px; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property name: border-bottom-right-radius',
        'expected': 'div { border-bottom-left-radius:15px; }',
        'input': 'div { border-bottom-right-radius:15px; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property name: border-left',
        'expected': 'div { border-right:1px solid black; }',
        'input': 'div { border-left:1px solid black; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property name: border-left-color',
        'expected': 'div { border-right-color:black; }',
        'input': 'div { border-left-color:black; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property name: border-left-style',
        'expected': 'div { border-right-style:solid; }',
        'input': 'div { border-left-style:solid; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property name: border-left-width',
        'expected': 'div { border-right-width:1em; }',
        'input': 'div { border-left-width:1em; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property name: left',
        'expected': 'div { right:auto; }',
        'input': 'div { left:auto; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property name: margin-left',
        'expected': 'div { margin-right:2em; }',
        'input': 'div { margin-left:2em; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property name: padding-left',
        'expected': 'div { padding-right:2em; }',
        'input': 'div { padding-left:2em; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property name: nav-left',
        'expected': 'div { nav-right:#b4; }',
        'input': 'div { nav-left:#b4; }',
        'reversable': true
      }
  ],
  'Mirrored Values:': [
      {
        'should': 'Should mirror property value: clear',
        'expected': 'div { clear:right; }',
        'input': 'div { clear:left; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property value: direction',
        'expected': 'div { direction:ltr; }',
        'input': 'div { direction:rtl; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property value: float',
        'expected': 'div { float:right; }',
        'input': 'div { float:left; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property value: text-align',
        'expected': 'div { text-align:right; }',
        'input': 'div { text-align:left; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property value: cursor nw',
        'expected': 'div { cursor:nw-resize; }',
        'input': 'div { cursor:ne-resize; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property value: cursor sw',
        'expected': 'div { cursor:sw-resize; }',
        'input': 'div { cursor:se-resize; }',
        'reversable': true
      },
      {
        'should': 'Should mirror property value: cursor nesw',
        'expected': 'div { cursor:nesw-resize; }',
        'input': 'div { cursor:nwse-resize; }',
        'reversable': true
      },
      {
        'should': 'Should keep property value as is: cursor ns',
        'expected': 'div { cursor:ns-resize; }',
        'input': 'div { cursor:ns-resize; }',
        'reversable': false
      },
      {
        'should': 'Should swap left,ltr,west in url: cursor',
        'expected': '.foo { cursor: url(right.cur), url(rtl.cur), url(east.cur), se-resize, auto }',
        'input': '.foo { cursor: url(left.cur), url(ltr.cur), url(west.cur), sw-resize, auto }',
        'reversable': true
      },
      {
        'should': 'Should mirror property value: transition',
        'expected': '.foo { transition: right .3s ease .1s, left .3s ease .1s, margin-right .3s ease, margin-left .3s ease, padding-right .3s ease, padding-left .3s ease}',
        'input': '.foo { transition: left .3s ease .1s, right .3s ease .1s, margin-left .3s ease, margin-right .3s ease, padding-left .3s ease, padding-right .3s ease}',
        'reversable': true
      },
      {
        'should': 'Should mirror property value: transition-property',
        'expected': '.foo { transition-property: right; }',
        'input': '.foo { transition-property: left; }',
        'reversable': true
      }
  ],
  'Mirrored Values (N Value Syntax):': [
       {
         'should': 'Should mirror property value: border-radius (4 values)',
         'expected': 'div { border-radius: 40.25px 10.5px /*comment*/ 10.75px 40.3px; }',
         'input': 'div { border-radius: 10.5px 40.25px /*comment*/ 40.3px 10.75px; }',
         'reversable': true
       },
       {
         'should': 'Should mirror property value: border-radius (3 values)',
         'expected': 'div { border-radius: 40.75px 10.75px 40.75px 40.3px; }',
         'input': 'div { border-radius: 10.75px 40.75px 40.3px; }',
         'reversable': false
       },
       {
         'should': 'Should mirror property value: border-radius (2 values)',
         'expected': 'div { border-radius: 40.25px 10.75px; }',
         'input': 'div { border-radius: 10.75px 40.25px; }',
         'reversable': true
       },
       {
         'should': 'Should mirror property value: border-radius (4 values - double)',
         'expected': 'div { border-radius: 40.25px 10.75px .5px 40.75px /*comment*/ / /*comment*/ .4em 1em 1em 4.5em; }',
         'input': 'div { border-radius: 10.75px 40.25px 40.75px .5px /*comment*/ / /*comment*/ 1em .4em 4.5em 1em; }',
         'reversable': true
       },
       {
         'should': 'Should mirror property value: border-radius (3 values - double)',
         'expected': 'div { border-radius: .40px 10.5px .40px 40px / 4em 1em 4em 3em; }',
         'input': 'div { border-radius: 10.5px .40px 40px / 1em 4em 3em; }',
         'reversable': false
       },
       {
         'should': 'Should mirror property value: border-radius (2 values- double)',
         'expected': 'div { border-radius: 40px 10px / 2.5em .75em; }',
         'input': 'div { border-radius: 10px 40px / .75em 2.5em; }',
         'reversable': true
       },
       {
         'should': 'Should mirror property value: border-width',
         'expected': 'div { border-width: 1px 4px .3em 2.5em; }',
         'input': 'div { border-width: 1px 2.5em .3em 4px; }',
         'reversable': true
       },
       {
         'should': 'Should mirror property value: border-width (none length)',
         'expected': 'div { border-width: thin medium thick none; }',
         'input': 'div { border-width: thin none thick medium; }',
         'reversable': true
       },
       {
         'should': 'Should mirror property value: border-style (4 values)',
         'expected': 'div { border-style: none dashed dotted solid; }',
         'input': 'div { border-style: none solid dotted dashed; }',
         'reversable': true
       },
       {
         'should': 'Should mirror property value: border-color (4 values)',
         'expected': 'div { border-color: rgba(255, 255, 255, 1) rgb( 0, 0, 0) #000 hsla(0, 100%, 50%, 1); }',
         'input': 'div { border-color: rgba(255, 255, 255, 1) hsla(0, 100%, 50%, 1) #000 rgb( 0, 0, 0); }',
         'reversable': true
       },
       {
         'should': 'Should not mirror property value: border-color (3 values)',
         'expected': 'div { border-color: #000 rgb( 0, 0, 0) hsla(0, 100%, 50%, 1); }',
         'input': 'div { border-color: #000 rgb( 0, 0, 0) hsla(0, 100%, 50%, 1); }',
         'reversable': false
       },
       {
         'should': 'Should not mirror property value: border-color (2 values)',
         'expected': 'div { border-color:rgb( 0, 0, 0) hsla(0, 100%, 50%, 1); }',
         'input': 'div { border-color:rgb( 0, 0, 0) hsla(0, 100%, 50%, 1); }',
         'reversable': false
       },
       {
         'should': 'Should mirror property value: margin',
         'expected': 'div { margin: .1em auto 3.5rem 2px; }',
         'input': 'div { margin: .1em 2px 3.5rem auto; }',
         'reversable': true
       },
       {
         'should': 'Should mirror property value: padding',
         'expected': 'div { padding: 1px 4px .3rem 2.5em; }',
         'input': 'div { padding: 1px 2.5em .3rem 4px; }',
         'reversable': true
       },
       {
         'should': 'Should mirror property value: box-shadow',
         'expected': 'div { box-shadow: -60px -16px rgba(0, 128, 128, 0.98), -10.25px 5px 5px #ff0, inset -0.5em 1em 0 white; }',
         'input': 'div { box-shadow: 60px -16px rgba(0, 128, 128, 0.98), 10.25px 5px 5px #ff0, inset 0.5em 1em 0 white; }',
         'reversable': true
       },
       {
         'should': 'Should mirror property value: text-shadow',
         'expected': 'div { text-shadow: -60px -16px rgba(0, 128, 128, 0.98), -10.25px 5px 5px #ff0, inset -0.5em 1em 0 white; }',
         'input': 'div { text-shadow: 60px -16px rgba(0, 128, 128, 0.98), 10.25px 5px 5px #ff0, inset 0.5em 1em 0 white; }',
         'reversable': true
       },
       {
         'should': 'Should mirror property value (no digit before the dot): box-shadow, text-shadow',
         'expected': 'div { box-shadow: inset -0.5em 1em 0 white; text-shadow: inset -0.5em 1em 0 white; }',
         'input': 'div { box-shadow: inset .5em 1em 0 white; text-shadow: inset .5em 1em 0 white; }',
         'reversable': false
       }
  ],
  'Transform Origin:': [
       {
         'should': 'Should mirror (x-offset: 0 means 0%)',
         'expected': 'div { transform-origin:100%; }',
         'input': 'div { transform-origin:0; }',
         'reversable': false
       },
       {
         'should': 'Should mirror (x-offset)',
         'expected': 'div { transform-origin:90.25%; }',
         'input': 'div { transform-origin:9.75%; }',
         'reversable': true
       },
       {
         'should': 'Should mirror calc (x-offset)',
         'expected': 'div { transform-origin: -moz-calc(100%-(((25%/2) * 10px))) ; }',
         'input': 'div { transform-origin: -moz-calc(((25%/2) * 10px)) ; }',
         'reversable': false
       },
       {
         'should': 'Should not mirror (x-offset: not percent, not calc)',
         'expected': 'div { transform-origin:10.75px; }',
         'input': 'div { transform-origin:10.75px; }',
         'reversable': false
       },
       {
         'should': 'Should mirror (offset-keyword)',
         'expected': 'div { transform-origin:right; }',
         'input': 'div { transform-origin:left; }',
         'reversable': true
       },
       {
         'should': 'Should mirror (x-offset y-offset: 0 means 0%)',
         'expected': 'div { transform-origin:100% 0; }',
         'input': 'div { transform-origin:0 0; }',
         'reversable': false
       },
       {
         'should': 'Should mirror with y being calc (x-offset y-offset: 0 means 0%)',
         'expected': 'div { transform-origin:100% -webkit-calc(15% * (3/2)); }',
         'input': 'div { transform-origin:0 -webkit-calc(15% * (3/2)); }',
         'reversable': false
       },
       {
         'should': 'Should mirror percent (x-offset y-offset)',
         'expected': 'div { transform-origin:30.25% 10%; }',
         'input': 'div { transform-origin:69.75% 10%; }',
         'reversable': true
       },
       {
         'should': 'Should mirror with x being calc (x-offset y-offset)',
         'expected': 'div { transform-origin: -webkit-calc(100%-(15% * (3/2))) 30.25% ; }',
         'input': 'div { transform-origin: -webkit-calc(15% * (3/2)) 30.25% ; }',
         'reversable': false
       },
       {
         'should': 'Should mirror with y being calc (x-offset y-offset)',
         'expected': 'div { transform-origin:30.25% calc(15% * (3/2)); }',
         'input': 'div { transform-origin:69.75% calc(15% * (3/2)); }',
         'reversable': true
       },
       {
         'should': 'Should mirror (y-offset x-offset-keyword)',
         'expected': 'div { transform-origin:70% right; }',
         'input': 'div { transform-origin:70% left; }',
         'reversable': true
       },
       {
         'should': 'Should mirror with calc (y-offset x-offset-keyword)',
         'expected': 'div { transform-origin:-ms-calc(140%/2) right; }',
         'input': 'div { transform-origin:-ms-calc(140%/2) left; }',
         'reversable': true
       },
       {
         'should': 'Should mirror (x-offset-keyword y-offset)',
         'expected': 'div { transform-origin:right 70%; }',
         'input': 'div { transform-origin:left 70%; }',
         'reversable': true
       },
       {
         'should': 'Should mirror with calc (x-offset-keyword y-offset)',
         'expected': 'div { transform-origin:right -moz-calc(((140%/2))); }',
         'input': 'div { transform-origin:left -moz-calc(((140%/2))); }',
         'reversable': true
       },
       {
         'should': 'Should mirror (y-offset-keyword x-offset)',
         'expected': 'div { transform-origin:top 30.25%; }',
         'input': 'div { transform-origin:top 69.75%; }',
         'reversable': true
       },
       {
         'should': 'Should not mirror with x being calc (y-offset-keyword x-offset)',
         'expected': 'div { transform-origin:top calc(100%-(((140%/2)))); }',
         'input': 'div { transform-origin:top calc(((140%/2))); }',
         'reversable': false
       },
       {
         'should': 'Should mirror (x-offset-keyword y-offset-keyword)',
         'expected': 'div { transform-origin:right top; }',
         'input': 'div { transform-origin:left top; }',
         'reversable': true
       },
       {
         'should': 'Should mirror (y-offset-keyword x-offset-keyword)',
         'expected': 'div { transform-origin:top right; }',
         'input': 'div { transform-origin:top left; }',
         'reversable': true
       },
       {
         'should': 'Should mirror (x-offset y-offset z-offset)',
         'expected': 'div { transform-origin:80.25% 30% 10%; }',
         'input': 'div { transform-origin:19.75% 30% 10%; }',
         'reversable': true
       },
       {
         'should': 'Should mirror with x being calc (x-offset y-offset z-offset)',
         'expected': 'div { transform-origin: calc(100%-(25% * 3 + 20px)) 30% 10%; }',
         'input': 'div { transform-origin: calc(25% * 3 + 20px) 30% 10%; }',
         'reversable': false
       },
       {
         'should': 'Should mirror (y-offset x-offset-keyword z-offset)',
         'expected': 'div { transform-origin:20% right 10%; }',
         'input': 'div { transform-origin:20% left 10%; }',
         'reversable': true
       },
       {
         'should': 'Should mirror (x-offset-keyword y-offset z-offset)',
         'expected': 'div { transform-origin:left 20% 10%; }',
         'input': 'div { transform-origin:right 20% 10%; }',
         'reversable': true
       },
       {
         'should': 'Should mirror (x-offset-keyword y-offset-keyword z-offset)',
         'expected': 'div { transform-origin:left bottom 10%; }',
         'input': 'div { transform-origin:right bottom 10%; }',
         'reversable': true
       },
       {
         'should': 'Should mirror (y-offset-keyword x-offset-keyword z-offset)',
         'expected': 'div { transform-origin:bottom left 10%; }',
         'input': 'div { transform-origin:bottom right 10%; }',
         'reversable': true
       }
  ],
  'Transforms:': [
       {
         'should': 'Should mirror transform : matrix',
         'expected': 'div { transform: matrix(2, 0.1, 20.75, 2, 2, 2); }',
         'input': 'div { transform: matrix(2, -0.1, -20.75, 2, -2, 2); }',
         'reversable': true
       },
       {
         'should': 'Should mirror transform (with no digits before dot): matrix',
         'expected': 'div { transform: matrix(2, 0.1, 0.75, 2, 2, 2); }',
         'input': 'div { transform: matrix(2, -0.1, -.75, 2, -2, 2); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform with calc: matrix',
         'expected': 'div { transform: matrix( -moz-calc(((25%/2) * 10px)), calc(-1*(((25%/2) * 10px))), 20.75, 2, 2, 2 ); }',
         'input': 'div { transform: matrix( -moz-calc(((25%/2) * 10px)), calc(((25%/2) * 10px)), -20.75, 2, -2, 2 ); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform : matrix3d',
         'expected': 'div { transform:matrix3d(0.227114470162179, 0.127248412323519, 0, 0.000811630714323203, 0.113139853456515, 1.53997196559414, 0, 0.000596368270149729, 0, 0, 1, 0, -165, 67, 0, 1); }',
         'input': 'div { transform:matrix3d(0.227114470162179, -0.127248412323519, 0, -0.000811630714323203, -0.113139853456515, 1.53997196559414, 0, 0.000596368270149729, 0, 0, 1, 0, 165, 67, 0, 1); }',
         'reversable': true
       },
       {
         'should': 'Should mirror transform (with no digits before dot): matrix3d',
         'expected': 'div { transform:matrix3d(0.227114470162179, 0.127248412323519, 0, 0.000811630714323203, 0.113139853456515, 1.53997196559414, 0, 0.000596368270149729, 0, 0, 1, 0, -165, 67, 0, 1); }',
         'input': 'div { transform:matrix3d(0.227114470162179, -.127248412323519, 0, -0.000811630714323203, -0.113139853456515, 1.53997196559414, 0, 0.000596368270149729, 0, 0, 1, 0, 165, 67, 0, 1); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform with calc : matrix3d',
         'expected': 'div { transform:matrix3d(0.227114470162179, 0.127248412323519, 0, 0.000811630714323203, 0.113139853456515, 1.53997196559414, 0, 0.000596368270149729, 0, 0, 1, 0, calc(-1*(((25%/2) * 10px))), 67, 0, 1); }',
         'input': 'div { transform:matrix3d(0.227114470162179, -0.127248412323519, 0, -0.000811630714323203, -0.113139853456515, 1.53997196559414, 0, 0.000596368270149729, 0, 0, 1, 0, calc(((25%/2) * 10px)), 67, 0, 1); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform : translate',
         'expected': 'div { transform: translate(-10.75px); }',
         'input': 'div { transform: translate(10.75px); }',
         'reversable': true
       },
       {
         'should': 'Should mirror transform (with no digits before dot): translate',
         'expected': 'div { transform: translate(-0.75px); }',
         'input': 'div { transform: translate(.75px); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform with calc: translate',
         'expected': 'div { transform: translate(-moz-calc(-1*(((25%/2) * 10px)))); }',
         'input': 'div { transform: translate(-moz-calc(((25%/2) * 10px))); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform : translateX',
         'expected': 'div { transform: translateX(-50.25px); }',
         'input': 'div { transform: translateX(50.25px); }',
         'reversable': true
       },
       {
         'should': 'Should mirror transform (with no digits before dot): translateX',
         'expected': 'div { transform: translateX(-0.25px); }',
         'input': 'div { transform: translateX(.25px); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform with calc : translateX',
         'expected': 'div { transform: translateX(-ms-calc(-1*(((25%/2) * 10px))))); }',
         'input': 'div { transform: translateX(-ms-calc(((25%/2) * 10px)))); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform : translate3d',
         'expected': 'div { transform: translate3d(-12.75px, 50%, 3em); }',
         'input': 'div { transform: translate3d(12.75px, 50%, 3em); }',
         'reversable': true
       },
       {
         'should': 'Should mirror transform (with no digits before dot): translate3d',
         'expected': 'div { transform: translate3d(-0.75px, 50%, 3em); }',
         'input': 'div { transform: translate3d(.75px, 50%, 3em); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform with calc: translate3d',
         'expected': 'div { transform: translate3d(-webkit-calc(-1*(((25%/2) * 10px))))), 50%, calc(((25%/2) * 10px))))); }',
         'input': 'div { transform: translate3d(-webkit-calc(((25%/2) * 10px)))), 50%, calc(((25%/2) * 10px))))); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform : rotate',
         'expected': 'div { transform: rotate(-20.75deg); }',
         'input': 'div { transform: rotate(20.75deg); }',
         'reversable': true
       },
       {
         'should': 'Should mirror transform (with no digits before dot): rotate',
         'expected': 'div { transform: rotate(-0.75deg); }',
         'input': 'div { transform: rotate(.75deg); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform with calc: rotate',
         'expected': 'div { transform: rotate(calc(-1*(((25%/2) * 10deg)))); }',
         'input': 'div { transform: rotate(calc(((25%/2) * 10deg))); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform : rotate3d',
         'expected': 'div { transform: rotate3d(10, -20.15, 10, -45.14deg); }',
         'input': 'div { transform: rotate3d(10, 20.15, 10, 45.14deg); }',
         'reversable': true
       },
       {
         'should': 'Should mirror transform (with no digits before dot): rotate3d',
         'expected': 'div { transform: rotate3d(10, -20, 10, -0.14deg); }',
         'input': 'div { transform: rotate3d(10, 20, 10, .14deg); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform with calc: rotate3d',
         'expected': 'div { transform: rotate3d(10, -20.15, 10, calc(-1*(((25%/2) * 10deg)))); }',
         'input': 'div { transform: rotate3d(10, 20.15, 10, calc(((25%/2) * 10deg))); }',
         'reversable': false
       },
       {
         'should': 'Should not mirror transform : rotateX',
         'expected': 'div { transform: rotateX(45deg); }',
         'input': 'div { transform: rotateX(45deg); }',
         'reversable': false
       },
       {
         'should': 'Should not mirror transform with calc: rotateX',
         'expected': 'div { transform: rotateX(calc(((25%/2) * 10deg))); }',
         'input': 'div { transform: rotateX(calc(((25%/2) * 10deg))); }',
         'reversable': false
       },
       {
         'should': 'Should not mirror transform : rotateY',
         'expected': 'div { transform: rotateY(45deg); }',
         'input': 'div { transform: rotateY(45deg); }',
         'reversable': false
       },
       {
         'should': 'Should not mirror transform with calc: rotateY',
         'expected': 'div { transform: rotateY(calc(((25%/2) * 10deg))); }',
         'input': 'div { transform: rotateY(calc(((25%/2) * 10deg))); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform : rotateZ',
         'expected': 'div { transform: rotateZ(-45.75deg); }',
         'input': 'div { transform: rotateZ(45.75deg); }',
         'reversable': true
       },
       {
         'should': 'Should mirror transform (with no digits before dot): rotateZ',
         'expected': 'div { transform: rotateZ(-0.75deg); }',
         'input': 'div { transform: rotateZ(.75deg); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform with calc: rotateZ',
         'expected': 'div { transform: rotateZ(-ms-calc(-1*(((25%/2) * 10deg)))); }',
         'input': 'div { transform: rotateZ(-ms-calc(((25%/2) * 10deg))); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform : skew',
         'expected': 'div { transform: skew(-20.25rad,-30deg); }',
         'input': 'div { transform: skew(20.25rad,30deg); }',
         'reversable': true
       },
       {
         'should': 'Should mirror transform (with no digits before dot): skew',
         'expected': 'div { transform: skew(-0.25rad,-30deg); }',
         'input': 'div { transform: skew(.25rad,30deg); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform with calc: skew',
         'expected': 'div { transform: skew(calc(-1*(((25%/2) * 10rad))),calc(-1*(((25%/2) * 10deg)))); }',
         'input': 'div { transform: skew(calc(((25%/2) * 10rad)),calc(((25%/2) * 10deg))); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform : skewX',
         'expected': 'div { transform: skewX(-20.75rad); }',
         'input': 'div { transform: skewX(20.75rad); }',
         'reversable': true
       },
       {
         'should': 'Should mirror transform (with no digits before dot): skewX',
         'expected': 'div { transform: skewX(-0.75rad); }',
         'input': 'div { transform: skewX(.75rad); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform with calc: skewX',
         'expected': 'div { transform: skewX(-moz-calc(-1*(((25%/2) * 10rad)))); }',
         'input': 'div { transform: skewX(-moz-calc(((25%/2) * 10rad))); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform : skewY',
         'expected': 'div { transform: skewY(-10.75grad); }',
         'input': 'div { transform: skewY(10.75grad); }',
         'reversable': true
       },
       {
         'should': 'Should mirror transform (with no digits before dot): skewY',
         'expected': 'div { transform: skewY(-0.75grad); }',
         'input': 'div { transform: skewY(.75grad); }',
         'reversable': false
       },
       {
         'should': 'Should mirror transform with calc: skewY',
         'expected': 'div { transform: skewY(calc(-1*(((25%/2) * 10grad)))); }',
         'input': 'div { transform: skewY(calc(((25%/2) * 10grad))); }',
         'reversable': false
       },
       {
         'should': 'Should mirror multiple transforms : translateX translateY Rotate',
         'expected': 'div { transform: translateX(-50.25px) translateY(50.25px) rotate(-20.75deg); }',
         'input': 'div { transform: translateX(50.25px) translateY(50.25px) rotate(20.75deg); }',
         'reversable': true
       },
       {
         'should': 'Should mirror multiple transforms with calc : translateX translateY Rotate',
         'expected': 'div { transform: translateX(-ms-calc(-1*(((25%/2) * 10px)))) translateY(-moz-calc(((25%/2) * 10rad))) rotate(calc(-1*(((25%/2) * 10grad)))); }',
         'input': 'div { transform: translateX(-ms-calc(((25%/2) * 10px))) translateY(-moz-calc(((25%/2) * 10rad))) rotate(calc(((25%/2) * 10grad))); }',
         'reversable': false
       }
  ],
  'RTLCSS (Options):': [
      {
        'should': 'Should not rename selectors having directional decl. (default)',
        'expected': '.right .rtl .east .bright .ultra .least { display:block; right:0; }',
        'input': '.right .rtl .east .bright .ultra .least { display:block; left:0; }',
        'reversable': true
      },
      {
        'should': 'Should auto rename selectors having no directional decl. (default)',
        'expected': '.left .ltr .west .bright .ultra .least { display:block; }',
        'input': '.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': true
      },
      {
        'should': 'Should auto rename selectors having no directional decl. (greedy)',
        'expected': '.left .ltr .west .bleft .urtla .lwest { display:block; }',
        'input': '.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': true,
        'options': { 'greedy': true }
      },
      {
        'should': 'Should not auto rename selectors having no directional decl. (autoRename:false)',
        'expected': '.right .rtl .east .bright .ultra .least { display:block; }',
        'input': '.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': true,
        'options': { 'autoRename': false }
      },
      {
        'should': 'Should not auto rename selectors having no directional decl. (autoRename:false,greedy)',
        'expected': '.right .rtl .east .bright .ultra .least { display:block; }',
        'input': '.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': true,
        'options': { 'autoRename': false, 'greedy': true }
      },
      {
        'should': 'Should not auto rename when rules are flipped via decl directives',
        'expected': 'div.right { display:block; font-family: "Droid Sans", Tahoma, "Droid Arabic Kufi"; }',
        'input': 'div.right { display:block; font-family: "Droid Sans", Tahoma/*!rtl:append:, "Droid Arabic Kufi"*/; }',
        'reversable': false,
        'options': { 'autoRename': true }
      },
      {
        'should': 'Should not preserve processing directive. (default)',
        'expected': 'div { left:0; }',
        'input': '/*rtl:ignore*/div { left:0; }',
        'reversable': false
      },
      {
        'should': 'Should preserve processing directive. (preserveDirectives:true)',
        'expected': '/*rtl:ignore*/div { left:0; }',
        'input': '/*rtl:ignore*/div { left:0; }',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should swap left with right in url (defult)',
        'expected': 'div { background-image: url(rtl/west/right.png); right:0; }',
        'input': 'div { background-image: url(ltr/east/left.png); left:0; }',
        'reversable': true
      },
      {
        'should': 'Should not swap left with right in url (swapLeftRightInUrl:false)',
        'expected': 'div { background-image: url(rtl/west/left.png); right:0; }',
        'input': 'div { background-image: url(ltr/east/left.png); left:0; }',
        'reversable': true,
        'options': { 'swapLeftRightInUrl': false }
      },
      {
        'should': 'Should swap ltr with rtl in url (defult)',
        'expected': 'div { background-image: url(rtl/west/right.png); right:0; }',
        'input': 'div { background-image: url(ltr/east/left.png); left:0; }',
        'reversable': true
      },
      {
        'should': 'Should not swap ltr with rtl in url (swapLtrRtlInUrl:false)',
        'expected': 'div { background-image: url(ltr/west/right.png); right:0; }',
        'input': 'div { background-image: url(ltr/east/left.png); left:0; }',
        'reversable': false,
        'options': { 'swapLtrRtlInUrl': false }
      },
      {
        'should': 'Should swap east with west in url (defult)',
        'expected': 'div { background-image: url(rtl/west/right.png); right:0; }',
        'input': 'div { background-image: url(ltr/east/left.png); left:0; }',
        'reversable': true
      },
      {
        'should': 'Should not swap east with west in url (swapWestEastInUrl:false)',
        'expected': 'div { background-image: url(rtl/east/right.png); right:0; }',
        'input': 'div { background-image: url(ltr/east/left.png); left:0; }',
        'reversable': false,
        'options': { 'swapWestEastInUrl': false }
      },
      {
        'should': 'Should swap left with right in @import url (swapLeftRightInUrl:true)',
        'expected': 'div{display:none;} @import url("right.css");',
        'input': 'div{display:none;} @import url("left.css");',
        'reversable': true,
        'options': { 'swapLeftRightInUrl': true }
      },
      {
        'should': 'Should not swap bright with bleft in @import url (swapLeftRightInUrl:true,greedy:false)',
        'expected': 'div{display:none;} @import url("bright.css");',
        'input': 'div{display:none;} @import url("bright.css");',
        'reversable': true,
        'options': { 'swapLeftRightInUrl': true, 'greedy': false }
      },
      {
        'should': 'Should swap bright with bleft in @import url (swapLeftRightInUrl:true,greedy:true)',
        'expected': 'div{display:none;} @import url("bleft.css");',
        'input': 'div{display:none;} @import url("bright.css");',
        'reversable': true,
        'options': { 'swapLeftRightInUrl': true, 'greedy': true }
      },
      {
        'should': 'Should swap ltr with rtl in @import url (swapLtrRtlInUrl:true)',
        'expected': 'div{display:none;} @import url("rtl.css");',
        'input': 'div{display:none;} @import url("ltr.css");',
        'reversable': true,
        'options': { 'swapLtrRtlInUrl': true }
      },
      {
        'should': 'Should not swap ultra with urtla in @import url (swapLtrRtlInUrl:true,greedy:false)',
        'expected': 'div{display:none;} @import url("ultra.css");',
        'input': 'div{display:none;} @import url("ultra.css");',
        'reversable': true,
        'options': { 'swapLtrRtlInUrl': true, 'greedy': false }
      },
      {
        'should': 'Should swap ultra with urtla in @import url (swapLtrRtlInUrl:true,greedy:true)',
        'expected': 'div{display:none;} @import url("urtla.css");',
        'input': 'div{display:none;} @import url("ultra.css");',
        'reversable': true,
        'options': { 'swapLtrRtlInUrl': true, 'greedy': true }
      },
      {
        'should': 'Should swap west with east in @import url (swapWestEastInUrl:true)',
        'expected': 'div{display:none;} @import url("east.css");',
        'input': 'div{display:none;} @import url("west.css");',
        'reversable': true,
        'options': { 'swapWestEastInUrl': true }
      },
      {
        'should': 'Should not swap western with eastern in @import url (swapWestEastInUrl:true,greedy:false)',
        'expected': 'div{display:none;} @import url("western.css");',
        'input': 'div{display:none;} @import url("western.css");',
        'reversable': true,
        'options': { 'swapWestEastInUrl': true, 'greedy': false }
      },
      {
        'should': 'Should swap western with eastern in @import url (swapWestEastInUrl:true,greedy:true)',
        'expected': 'div{display:none;} @import url("eastern.css");',
        'input': 'div{display:none;} @import url("western.css");',
        'reversable': true,
        'options': { 'swapWestEastInUrl': true, 'greedy': true }
      },
      {
        'should': 'Should minify (minify:true)',
        'expected': 'div{font-family:"Droid Arabic Kufi";padding:10px 5px 5px 10px;color:red;}.div2{display:none;}',
        'input': '\n/*comment*/\ndiv\n/*comment*/\n {\n/*comment*/\n font-family:\n/*comment*/\n "Droid Arabic Kufi";\n/*comment*/\n padding:10px 10px 5px 5px;\n/*comment*/\n color:red; \n/*comment*/\n } \n/*comment*/\n .div2{ /*comment*/ \n display:none; /*comment*/ \n /*comment*/}',
        'reversable': false,
        'options': { 'minify': true }
      }
  ],
  'RTLCSS (Directives):': [
      {
        'should': 'Should auto rename selectors having no directional decl. unless forced to ignore. (default)',
        'expected': '.right .rtl .east .bright .ultra .least { display:block; }',
        'input': '/*rtl:ignore*/ .right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false
      },
      {
        'should': 'Should auto rename selectors having no directional decl. unless forced to ignore. (preserveDirectives)',
        'expected': '/*rtl:ignore*/ .right .rtl .east .bright .ultra .least { display:block; }',
        'input': '/*rtl:ignore*/ .right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should auto rename selectors having no directional decl. unless forced to ignore. (default, !important comment)',
        'expected': '.right .rtl .east .bright .ultra .least { display:block; }',
        'input': '/*!rtl:ignore*/ .right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false
      },
      {
        'should': 'Should auto rename selectors having no directional decl. unless forced to ignore. (preserveDirectives, !important comment)',
        'expected': '/*!rtl:ignore*/ .right .rtl .east .bright .ultra .least { display:block; }',
        'input': '/*!rtl:ignore*/ .right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should auto rename selectors having no directional decl. unless forced to ignore. (greedy)',
        'expected': '.right .rtl .east .bright .ultra .least { display:block; }',
        'input': '/*rtl:ignore*/ .right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
        'options': { 'greedy': true }
      },
      {
        'should': 'Should auto rename selectors having no directional decl. unless forced to ignore. (greedy, !important comment)',
        'expected': '.right .rtl .east .bright .ultra .least { display:block; }',
        'input': '/*!rtl:ignore*/ .right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
        'options': { 'greedy': true }
      },
      {
        'should': 'Should rename selectors when forced. (autoRename:false)',
        'expected': '.left .ltr .west .bright .ultra .least { display:block; }',
        'input': '/*rtl:rename*/.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
        'options': { 'autoRename': false }
      },
      {
        'should': 'Should rename selectors when forced. (autoRename:false, preserveDirectives)',
        'expected': '/*rtl:rename*/.left .ltr .west .bright .ultra .least { display:block; }',
        'input': '/*rtl:rename*/.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
        'options': { 'autoRename': false, 'preserveDirectives': true }
      },
      {
        'should': 'Should rename selectors when forced. (autoRename:false, !important comment)',
        'expected': '.left .ltr .west .bright .ultra .least { display:block; }',
        'input': '/*!rtl:rename*/.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
        'options': { 'autoRename': false }
      },
      {
        'should': 'Should rename selectors when forced. (autoRename:false, preserveDirectives, !important comment)',
        'expected': '/*!rtl:rename*/.left .ltr .west .bright .ultra .least { display:block; }',
        'input': '/*!rtl:rename*/.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
        'options': { 'autoRename': false, 'preserveDirectives': true }
      },
      {
        'should': 'Should rename selectors when forced. (autoRename:false,greedy)',
        'expected': '.left .ltr .west .bleft .urtla .lwest { display:block; }',
        'input': '/*rtl:rename*/.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
        'options': { 'autoRename': false, 'greedy': true }
      },
      {
        'should': 'Should rename selectors when forced. (autoRename:false,greedy, !important comment)',
        'expected': '.left .ltr .west .bleft .urtla .lwest { display:block; }',
        'input': '/*!rtl:rename*/.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
        'options': { 'autoRename': false, 'greedy': true }
      },
      {
        'should': 'Should prepend value. (default)',
        'expected': 'div { font-family: "Droid Arabic Kufi", "Droid Sans", Tahoma; }',
        'input': 'div { font-family: "Droid Sans", Tahoma/*rtl:prepend:"Droid Arabic Kufi", */; }',
        'reversable': false
      },
      {
        'should': 'Should prepend value. (preserveDirectives)',
        'expected': 'div { font-family: "Droid Arabic Kufi", "Droid Sans", Tahoma/*rtl:prepend:"Droid Arabic Kufi", */; }',
        'input': 'div { font-family: "Droid Sans", Tahoma/*rtl:prepend:"Droid Arabic Kufi", */; }',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should prepend value (!important comment)',
        'expected': 'div { font-family: "Droid Arabic Kufi", "Droid Sans", Tahoma; }',
        'input': 'div { font-family: "Droid Sans", Tahoma/*!rtl:prepend:"Droid Arabic Kufi", */; }',
        'reversable': false
      },
      {
        'should': 'Should prepend value (preserveDirectives, !important comment)',
        'expected': 'div { font-family: "Droid Arabic Kufi", "Droid Sans", Tahoma/*!rtl:prepend:"Droid Arabic Kufi", */; }',
        'input': 'div { font-family: "Droid Sans", Tahoma/*!rtl:prepend:"Droid Arabic Kufi", */; }',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should replace value.',
        'expected': 'div { font-family: "Droid Arabic Kufi"; }',
        'input': 'div { font-family: "Droid Sans", Tahoma/*rtl:"Droid Arabic Kufi"*/; }',
        'reversable': false
      },
      {
        'should': 'Should replace value.(preserveDirectives)',
        'expected': 'div { font-family: "Droid Arabic Kufi"/*rtl:"Droid Arabic Kufi"*/; }',
        'input': 'div { font-family: "Droid Sans", Tahoma/*rtl:"Droid Arabic Kufi"*/; }',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should replace value. (!important comment)',
        'expected': 'div { font-family: "Droid Arabic Kufi"; }',
        'input': 'div { font-family: "Droid Sans", Tahoma/*!rtl:"Droid Arabic Kufi"*/; }',
        'reversable': false
      },
      {
        'should': 'Should replace value. (preserveDirectives, !important comment)',
        'expected': 'div { font-family: "Droid Arabic Kufi"/*!rtl:"Droid Arabic Kufi"*/; }',
        'input': 'div { font-family: "Droid Sans", Tahoma/*!rtl:"Droid Arabic Kufi"*/; }',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should append value. (default)',
        'expected': 'div { font-family: "Droid Sans", Tahoma, "Droid Arabic Kufi"; }',
        'input': 'div { font-family: "Droid Sans", Tahoma/*rtl:append:, "Droid Arabic Kufi"*/; }',
        'reversable': false
      },
      {
        'should': 'Should append value. (preserveDirectives)',
        'expected': 'div { font-family: "Droid Sans", Tahoma/*rtl:append:, "Droid Arabic Kufi"*/, "Droid Arabic Kufi"; }',
        'input': 'div { font-family: "Droid Sans", Tahoma/*rtl:append:, "Droid Arabic Kufi"*/; }',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should append value. (!important comment)',
        'expected': 'div { font-family: "Droid Sans", Tahoma, "Droid Arabic Kufi"; }',
        'input': 'div { font-family: "Droid Sans", Tahoma/*!rtl:append:, "Droid Arabic Kufi"*/; }',
        'reversable': false
      },
      {
        'should': 'Should append value. (preserveDirectives, !important comment)',
        'expected': 'div { font-family: "Droid Sans", Tahoma/*!rtl:append:, "Droid Arabic Kufi"*/, "Droid Arabic Kufi"; }',
        'input': 'div { font-family: "Droid Sans", Tahoma/*!rtl:append:, "Droid Arabic Kufi"*/; }',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should insert value. (default)',
        'expected': 'div { font-family: "Droid Sans", "Droid Arabic Kufi", Tahoma; }',
        'input': 'div { font-family: "Droid Sans"/*rtl:insert:, "Droid Arabic Kufi"*/, Tahoma; }',
        'reversable': false
      },
      {
        'should': 'Should insert value. (preserveDirectives)',
        'expected': 'div { font-family: "Droid Sans", "Droid Arabic Kufi"/*rtl:insert:, "Droid Arabic Kufi"*/, Tahoma; }',
        'input': 'div { font-family: "Droid Sans"/*rtl:insert:, "Droid Arabic Kufi"*/, Tahoma; }',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should insert value. (!important comment)',
        'expected': 'div { font-family: "Droid Sans", "Droid Arabic Kufi", Tahoma; }',
        'input': 'div { font-family: "Droid Sans"/*!rtl:insert:, "Droid Arabic Kufi"*/, Tahoma; }',
        'reversable': false
      },
      {
        'should': 'Should insert value. (preserveDirectives, !important comment)',
        'expected': 'div { font-family: "Droid Sans", "Droid Arabic Kufi"/*!rtl:insert:, "Droid Arabic Kufi"*/, Tahoma; }',
        'input': 'div { font-family: "Droid Sans"/*!rtl:insert:, "Droid Arabic Kufi"*/, Tahoma; }',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should ignore flipping - rule level (default)',
        'expected': 'div { left:10px; text-align:right;}',
        'input': '/*rtl:ignore*/div { left:10px; text-align:right;}',
        'reversable': false
      },
      {
        'should': 'Should ignore flipping - rule level (preserveDirectives)',
        'expected': '/*rtl:ignore*/div { left:10px; text-align:right;}',
        'input': '/*rtl:ignore*/div { left:10px; text-align:right;}',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should ignore flipping - rule level (default, !important comment)',
        'expected': 'div { left:10px; text-align:right;}',
        'input': '/*!rtl:ignore*/div { left:10px; text-align:right;}',
        'reversable': false
      },
      {
        'should': 'Should ignore flipping - rule level (preserveDirectives , !important comment)',
        'expected': '/*!rtl:ignore*/div { left:10px; text-align:right;}',
        'input': '/*!rtl:ignore*/div { left:10px; text-align:right;}',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should ignore flipping - decl. level (default)',
        'expected': 'div { left:10px;text-align:left;}',
        'input': 'div { left:10px/*rtl:ignore*/;text-align:right;}',
        'reversable': false
      },
      {
        'should': 'Should ignore flipping - decl. level (preserveDirectives)',
        'expected': 'div { left:10px/*rtl:ignore*/;text-align:left;}',
        'input': 'div { left:10px/*rtl:ignore*/;text-align:right;}',
        'reversable': false,
        'options': { 'preserveDirectives': true }
      },
      {
        'should': 'Should ignore flipping - decl. level (default, !important comment)',
        'expected': 'div { left:10px;text-align:left;}',
        'input': 'div { left:10px/*!rtl:ignore*/;text-align:right;}',
        'reversable': false
      },
      {
        'should': 'Should ignore flipping - decl. level (preserveDirectives, !important comment)',
        'expected': 'div { left:10px/*!rtl:ignore*/;text-align:left;}',
        'input': 'div { left:10px/*!rtl:ignore*/;text-align:right;}',
        'options': { 'preserveDirectives': true }
      }
  ],
  'RTLCSS (String Map):': [
      {
        'should': 'Should rename "left", "Left", "LEFT" (default). ',
        'expected': 'div.right, div.Right, div.RIGHT, div.respectLeft { width:10px;}',
        'input': 'div.left, div.Left, div.LEFT, div.respectLeft { width:10px;}',
        'reversable': true
      },
      {
        'should': 'Should rename "left", "Left", "LEFT" (greedy). ',
        'expected': 'div.right, div.Right, div.RIGHT, div.respectRight { width:10px;}',
        'input': 'div.left, div.Left, div.LEFT, div.respectLeft { width:10px;}',
        'reversable': true,
        'options': {
          'greedy': true
        }
      },
      {
        'should': 'Should rename "ltr", "Ltr", "LTR" (default). ',
        'expected': 'div.rtl, div.Rtl, div.RTL, div.Ultra { width:10px;}',
        'input': 'div.ltr, div.Ltr, div.LTR, div.Ultra { width:10px;}',
        'reversable': true
      },
      {
        'should': 'Should rename "ltr", "Ltr", "LTR" (greedy). ',
        'expected': 'div.rtl, div.Rtl, div.RTL, div.Urtla { width:10px;}',
        'input': 'div.ltr, div.Ltr, div.LTR, div.Ultra { width:10px;}',
        'reversable': true,
        'options': {
          'greedy': true
        }
      },
      {
        'should': 'Should rename "west", "West", "WEST" (default). ',
        'expected': 'div.east, div.East, div.EAST, div.Western { width:10px;}',
        'input': 'div.west, div.West, div.WEST, div.Western { width:10px;}',
        'reversable': true
      },
      {
        'should': 'Should rename "west", "West", "WEST" (greedy). ',
        'expected': 'div.east, div.East, div.EAST, div.Eastern { width:10px;}',
        'input': 'div.west, div.West, div.WEST, div.Western { width:10px;}',
        'reversable': true,
        'options': {
          'greedy': true
        }
      },
      {
        'should': 'Should rename "prev"/"next"',
        'expected': 'div.next, div.Right { width:10px;}',
        'input': 'div.prev, div.Left { width:10px;}',
        'reversable': true,
        'options': { 'stringMap': [{ "search": "prev", "replace": "next", 'options': { scope: 'selector' } }] }
      },
      {
        'should': 'Should swap "prev"/"next" in Url',
        'expected': 'div { background-image: url(/content/pix/next.png);}',
        'input': 'div { background-image: url(/content/pix/prev.png);}',
        'reversable': true,
        'options': { 'stringMap': [{ "search": "prev", "replace": "next", 'options': { scope: 'url' } }] }
      },
      {
        'should': 'Should swap "prev"/"next" in Url and Rename in selector',
        'expected': 'div.next { display:block }; div.prev { background-image: url(/content/pix/prev.png);}',
        'input': 'div.prev { display:block }; div.prev { background-image: url(/content/pix/next.png);}',
        'reversable': true,
        'options': { 'stringMap': [{ "search": "prev", "replace": "next", 'options': { scope: '*' } }] }
      },
      {
        'should': 'Should rename "previous" to "nextious" (autoRename:true, greedy: true)',
        'expected': 'div.nextious{ width:10px;}',
        'input': 'div.previous{ width:10px;}',
        'reversable': true,
        'options': { 'stringMap': [{ "name": "prev-next", "search": "prev", "replace": "next", options: { greedy: true } }] }
      },
      {
        'should': 'Should escape strings used in stringMap',
        'expected': '@import url("//a.b/c-rtl.css"); @import url("//a.b/css");',
        'input': '@import url("//a.b/c.css"); @import url("//a.b/css");',
        'reversable': true,
        'options': { 'swapLtrRtlInUrl': false, 'stringMap': [ { name: 'import-rtl-stylesheet', search: [ '.css' ], replace: [ '-rtl.css' ], options: { scope: 'url'} }] }
      }
  ]
};

(function Run() {
  for (key in tests) {
    var group = tests[key];
    describe(key, function () {
      for (var i = 0; i < group.length; i++) {
        var item = group[i];
        (function (test) {
          it(test.should, function () {
            assert.equal(rtlcss.process(test.input, test.options), test.expected);
          });
        })(item);
        if (item.reversable) {
          (function (test) {
            it(test.should + " <REVERESE>", function () {
              assert.equal(rtlcss.process(test.expected, test.options), test.input);
            });
          })(item);
        }
      }
    });
  }
})();
