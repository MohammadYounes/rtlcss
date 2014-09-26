var assert = require("assert");
var rtlcss = require("../lib/rtlcss.js");
var tests = {
  'Background:': [
      {
        'should'      : 'Should treat 0 as 0%',
        'expected'    : '.banner { background: 100% top url(topbanner.png) #00D repeat-y fixed; }',
        'input'       : '.banner { background: 0 top url(topbanner.png) #00D repeat-y fixed; }',
        'reversable'  : false
      },
      {
        'should'      : 'Should complement percentage horizontal position',
        'expected'    : '.banner { background: 81% top url(topbanner.png) #00D repeat-y fixed; }',
        'input'       : '.banner { background: 19% top url(topbanner.png) #00D repeat-y fixed; }',
        'reversable'  : true
      },
      {
        'should'    : 'Should mirror keyword horizontal position',
        'expected'  : '.banner { background: right top url(topbanner.png) #00D repeat-y fixed; }',
        'input'     : '.banner { background: left top url(topbanner.png) #00D repeat-y fixed; }',
        'reversable': true
      },
      {
        'should'    : 'Should swap left with right in url',
        'expected'  : '.banner { background: 10px top url(top-left-banner.png) #00D repeat-y fixed; }',
        'input'     : '.banner { background: 10px top url(top-right-banner.png) #00D repeat-y fixed; }',
        'reversable': true
      },
      {
        'should'    : 'Should swap ltr with rtl in url',
        'expected'  : '.banner { background: 10px top url(rtl-banner.png) #00D repeat-y fixed; }',
        'input'     : '.banner { background: 10px top url(ltr-banner.png) #00D repeat-y fixed; }',
        'reversable': true
      },
      {
        'should'    : 'Should swap west with east in url',
        'expected'  : '.banner { background: 10px top url(east-banner.png) #00D repeat-y fixed; }',
        'input'     : '.banner { background: 10px top url(west-banner.png) #00D repeat-y fixed; }',
        'reversable': true
      },
			{
        'should'    : 'Should not swap bright:bleft, ultra:urtla, westing:easting',
        'expected'  : '.banner { background: 10px top url(ultra/westing/bright.png) #00D repeat-y fixed; }',
        'input'     : '.banner { background: 10px top url(ultra/westing/bright.png) #00D repeat-y fixed; }',
        'reversable': true
      },
			{
        'should'    : 'Should swap bright:bleft, ultra:urtla, westing:easting (greedy)',
        'expected'  : '.banner { background: 10px top url(urtla/easting/bleft.png) #00D repeat-y fixed; }',
        'input'     : '.banner { background: 10px top url(ultra/westing/bright.png) #00D repeat-y fixed; }',
        'reversable': true,
				'options'		: {'greedy':true}
      },
  ],
  'Background Image:': [
      {
        'should'    : 'Should swap left with right in url',
        'expected'  : 'div { background-image: url(images/left.png), url(images/right.png);}',
        'input'     : 'div { background-image: url(images/right.png), url(images/left.png);}',
        'reversable': true
      },
      {
        'should'    : 'Should swap ltr with rtl in url',
        'expected'  : 'div { background-image: url(images/ltr.png), url(images/rtl.png);}',
        'input'     : 'div { background-image: url(images/rtl.png), url(images/ltr.png);}',
        'reversable': true
      },
      {
        'should'    : 'Should swap west with east in url',
        'expected'  : 'div { background-image: url(images/west.png), url(images/east.png);}',
        'input'     : 'div { background-image: url(images/east.png), url(images/west.png);}',
        'reversable': true
      },
      {
        'should'    : 'Should not negate color value for linear gradient',
        'expected'  : 'div { background-image: linear-gradient(rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%);}',
        'input'     : 'div { background-image: linear-gradient(rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%);}',
        'reversable': true
      },
      {
        'should'    : 'Should negate angle value for linear gradient',
        'expected'  : 'div { background-image: linear-gradient(135deg, rgba(255, 255, 255, .15) 25%, transparent 25%);}',
        'input'     : 'div { background-image: linear-gradient(-135deg, rgba(255, 255, 255, .15) 25%, transparent 25%);}',
        'reversable': true
      }
  ],
  'Background Position:': [
      {
        'should'    : 'Should complement percentage horizontal position ',
        'expected'  : 'div {background-position:100% 75%;}',
        'input'     : 'div {background-position:0 75%;}',
        'reversable': false
      },
      {
        'should'    : 'Should complement percentage horizontal position ',
        'expected'  : 'div {background-position:81% 75%, 11% top;}',
        'input'     : 'div {background-position:19% 75%, 89% top;}',
        'reversable': true
      },
      {
        'should'    : 'Should swap left with right',
        'expected'  : 'div {background-position:right 75%, left top;}',
        'input'     : 'div {background-position:left 75%, right top;}',
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
        'expected': 'div {background-position-x:81%, 11%;}',
        'input': 'div {background-position-x:19%, 89%;}',
        'reversable': true
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
        'should'    : 'Should mirror property name: border-top-right-radius',
        'expected'  : 'div { border-top-left-radius:15px; }',
        'input'     : 'div { border-top-right-radius:15px; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property name: border-bottom-right-radius',
        'expected'  : 'div { border-bottom-left-radius:15px; }',
        'input'     : 'div { border-bottom-right-radius:15px; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property name: border-left',
        'expected'  : 'div { border-right:1px solid black; }',
        'input'     : 'div { border-left:1px solid black; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property name: border-left-color',
        'expected'  : 'div { border-right-color:black; }',
        'input'     : 'div { border-left-color:black; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property name: border-left-style',
        'expected'  : 'div { border-right-style:solid; }',
        'input'     : 'div { border-left-style:solid; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property name: border-left-width',
        'expected'  : 'div { border-right-width:1em; }',
        'input'     : 'div { border-left-width:1em; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property name: left',
        'expected'  : 'div { right:auto; }',
        'input'     : 'div { left:auto; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property name: margin-left',
        'expected'  : 'div { margin-right:2em; }',
        'input'     : 'div { margin-left:2em; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property name: padding-left',
        'expected'  : 'div { padding-right:2em; }',
        'input'     : 'div { padding-left:2em; }',
        'reversable': true
      },		
      {
        'should'    : 'Should mirror property name: nav-left',
        'expected'  : 'div { nav-right:#b4; }',
        'input'     : 'div { nav-left:#b4; }',
        'reversable': true
      }
  ],
  'Mirrored Values:': [
      {
        'should'    : 'Should mirror property value: clear',
        'expected'  : 'div { clear:right; }',
        'input'     : 'div { clear:left; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property value: direction',
        'expected'  : 'div { direction:ltr; }',
        'input'     : 'div { direction:rtl; }',
        'reversable': true
      },
			{
        'should'    : 'Should mirror property value: float',
        'expected'  : 'div { float:right; }',
        'input'     : 'div { float:left; }',
        'reversable': true
      },
			{
        'should'    : 'Should mirror property value: text-align',
        'expected'  : 'div { text-align:right; }',
        'input'     : 'div { text-align:left; }',
        'reversable': true
      },		
			{
        'should'    : 'Should mirror property value: cursor nw',
        'expected'  : 'div { cursor:nw-resize; }',
        'input'     : 'div { cursor:ne-resize; }',
        'reversable': true
      },
			{
        'should'    : 'Should mirror property value: cursor sw',
        'expected'  : 'div { cursor:sw-resize; }',
        'input'     : 'div { cursor:se-resize; }',
        'reversable': true
      },
			{
        'should'    : 'Should mirror property value: cursor nesw',
        'expected'  : 'div { cursor:nesw-resize; }',
        'input'     : 'div { cursor:nwse-resize; }',
        'reversable': true
      },		
			{
        'should'    : 'Should keep property value as is: cursor ns',
        'expected'  : 'div { cursor:ns-resize; }',
        'input'     : 'div { cursor:ns-resize; }',
        'reversable': false
      },
			{
        'should'    : 'Should swap left,ltr,west in url: cursor',
        'expected'  : '.foo { cursor: url(right.cur), url(rtl.cur), url(east.cur), se-resize, auto }',
        'input'     : '.foo { cursor: url(left.cur), url(ltr.cur), url(west.cur), sw-resize, auto }',
        'reversable': true
      },		
			{
        'should'    : 'Should mirror property value: transition',
        'expected'  : '.foo { transition: right .3s ease .1s, left .3s ease .1s, margin-right .3s ease, margin-left .3s ease, padding-right .3s ease, padding-left .3s ease}',
        'input'     : '.foo { transition: left .3s ease .1s, right .3s ease .1s, margin-left .3s ease, margin-right .3s ease, padding-left .3s ease, padding-right .3s ease}',
        'reversable': true
      },
			{
        'should'    : 'Should mirror property value: transition-property',
        'expected'  : '.foo { transition-property: right; }',
        'input'     : '.foo { transition-property: left; }',
        'reversable': true
      },		
  ],
 'Mirrored Values (N Value Syntax):': [
      {
        'should'    : 'Should mirror property value: border-radius (4 values)',
        'expected'  : 'div { border-radius: 40px 10px 10px 40px; }',
        'input'     : 'div { border-radius: 10px 40px 40px 10px; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property value: border-radius (3 values)',
        'expected'  : 'div { border-radius: 40px 10px 40px 40px; }',
        'input'     : 'div { border-radius: 10px 40px 40px; }',
        'reversable': false
      },
      {
        'should'    : 'Should mirror property value: border-radius (2 values)',
        'expected'  : 'div { border-radius: 40px 10px; }',
        'input'     : 'div { border-radius: 10px 40px; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property value: border-radius (4 values - double)',
        'expected'  : 'div { border-radius: 40px 10px 10px 40px / 4em 1em 1em 4em; }',
        'input'     : 'div { border-radius: 10px 40px 40px 10px / 1em 4em 4em 1em; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property value: border-radius (3 values - double)',
        'expected'  : 'div { border-radius: 40px 10px 40px 40px /4em  1em 4em 3em; }',
        'input'     : 'div { border-radius: 10px 40px 40px / 1em 4em 3em; }',
        'reversable': false
      },
      {
        'should'    : 'Should mirror property value: border-radius (2 values- double)',
        'expected'  : 'div { border-radius: 40px 10px / 2em 1em; }',
        'input'     : 'div { border-radius: 10px 40px / 1em 2em; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property value: border-width',
        'expected'  : 'div { border-width: 1px 4px 3px 2px; }',
        'input'     : 'div { border-width: 1px 2px 3px 4px; }',
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
        'should'    : 'Should mirror property value: margin',
        'expected'  : 'div { margin: 1px auto 3px 2px; }',
        'input'     : 'div { margin: 1px 2px 3px auto; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property value: padding',
        'expected'  : 'div { padding: 1px 4px 3px 2px; }',
        'input'     : 'div { padding: 1px 2px 3px 4px; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property value: box-shadow',
        'expected'  : 'div { box-shadow: -60px -16px teal, -10px 5px 5px red,inset -5em 1em 0 white; }',
        'input'     : 'div { box-shadow: 60px -16px teal, 10px 5px 5px red,inset 5em 1em 0 white; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror property value: text-shadow',
        'expected'  : 'div { text-shadow: -60px -16px teal, -10px 5px 5px red,inset -5em 1em 0 white; }',
        'input'     : 'div { text-shadow: 60px -16px teal, 10px 5px 5px red,inset 5em 1em 0 white; }',
        'reversable': true
      },    
  ],
 'Transform Origin:': [
      {
        'should'    : 'Should mirror (x-offset: 0 means 0%)',
        'expected'  : 'div { transform-origin:100%; }',
        'input'     : 'div { transform-origin:0; }',
        'reversable': false
      },
      {
        'should'    : 'Should mirror (x-offset)',
        'expected'  : 'div { transform-origin:90%; }',
        'input'     : 'div { transform-origin:10%; }',
        'reversable': true
      },   
      {
        'should'    : 'Should not mirror (x-offset: not percent)',
        'expected'  : 'div { transform-origin:10px; }',
        'input'     : 'div { transform-origin:10px; }',
        'reversable': false
      },   
      {
        'should'    : 'Should mirror (offset-keyword)',
        'expected'  : 'div { transform-origin:right; }',
        'input'     : 'div { transform-origin:left; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror (x-offset y-offset: 0 means 0%)',
        'expected'  : 'div { transform-origin:100% 0; }',
        'input'     : 'div { transform-origin:0 0; }',
        'reversable': false
      },
      {
        'should'    : 'Should mirror (x-offset y-offset)',
        'expected'  : 'div { transform-origin:30% 10%; }',
        'input'     : 'div { transform-origin:70% 10%; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror (y-offset x-offset-keyword)',
        'expected'  : 'div { transform-origin:70% right; }',
        'input'     : 'div { transform-origin:70% left; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror (x-offset-keyword y-offset)',
        'expected'  : 'div { transform-origin:right 70%; }',
        'input'     : 'div { transform-origin:left 70%; }',
        'reversable': true
      }, 
      {
        'should'    : 'Should mirror (y-offset-keyword x-offset)',
        'expected'  : 'div { transform-origin:top 30%; }',
        'input'     : 'div { transform-origin:top 70%; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror (x-offset-keyword y-offset-keyword)',
        'expected'  : 'div { transform-origin:right top; }',
        'input'     : 'div { transform-origin:left top; }',
        'reversable': true
      },      
      {
        'should'    : 'Should mirror (y-offset-keyword x-offset-keyword)',
        'expected'  : 'div { transform-origin:top right; }',
        'input'     : 'div { transform-origin:top left; }',
        'reversable': true
      },   
      {
        'should'    : 'Should mirror (x-offset y-offset z-offset)',
        'expected'  : 'div { transform-origin:80% 30% 10%; }',
        'input'     : 'div { transform-origin:20% 30% 10%; }',
        'reversable': true
      },   
      {
        'should'    : 'Should mirror (y-offset x-offset-keyword z-offset)',
        'expected'  : 'div { transform-origin:20% right 10%; }',
        'input'     : 'div { transform-origin:20% left 10%; }',
        'reversable': true
      },   
      {
        'should'    : 'Should mirror (x-offset-keyword y-offset z-offset)',
        'expected'  : 'div { transform-origin:left 20% 10%; }',
        'input'     : 'div { transform-origin:right 20% 10%; }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror (x-offset-keyword y-offset-keyword z-offset)',
        'expected'  : 'div { transform-origin:left bottom 10%; }',
        'input'     : 'div { transform-origin:right bottom 10%; }',
        'reversable': true
      },   
      {
        'should'    : 'Should mirror (y-offset-keyword x-offset-keyword z-offset)',
        'expected'  : 'div { transform-origin:bottom left 10%; }',
        'input'     : 'div { transform-origin:bottom right 10%; }',
        'reversable': true
      },   
 ],
 'Transforms:': [
			{
        'should'    : 'Should mirror transform : matrix',
        'expected'  : 'div { transform: matrix(2, 0.1, 2, 2, 2, 2); }',
        'input'     : 'div { transform: matrix(2, -0.1, -2, 2, -2, 2); }',
        'reversable': true
      },
			{
        'should'    : 'Should mirror transform : translate',
        'expected'  : 'div { transform: translate(-100px); }',
        'input'     : 'div { transform: translate(100px); }',
        'reversable': true
      },	
			{
        'should'    : 'Should mirror transform : translateX',
        'expected'  : 'div { transform: translateX(-50px); }',
        'input'     : 'div { transform: translateX(50px); }',
        'reversable': true
      },			
			{
        'should'    : 'Should mirror transform : translate3d',
        'expected'  : 'div { transform: translate3d(-12px, 50%, 3em); }',
        'input'     : 'div { transform: translate3d(12px, 50%, 3em); }',
        'reversable': true
      },				
      {
        'should'    : 'Should mirror transform : rotate',
        'expected'  : 'div { transform: rotate(-20deg); }',
        'input'     : 'div { transform: rotate(20deg); }',
        'reversable': true
      },
      {
        'should'    : 'Should mirror transform : rotate3d',
        'expected'  : 'div { transform: rotate3d(10, -20, 10, -45deg); }',
        'input'     : 'div { transform: rotate3d(10, 20, 10, 45deg); }',
        'reversable': true
      },		
			{
        'should'    : 'Should not mirror transform : rotateX',
        'expected'  : 'div { transform: rotateX(45deg); }',
        'input'     : 'div { transform: rotateX(45deg); }',
        'reversable': false
      },
			{
        'should'    : 'Should not mirror transform : rotateY',
        'expected'  : 'div { transform: rotateY(45deg); }',
        'input'     : 'div { transform: rotateY(45deg); }',
        'reversable': false
      },
			{
        'should'    : 'Should mirror transform : rotateZ',
        'expected'  : 'div { transform: rotateZ(-45deg); }',
        'input'     : 'div { transform: rotateZ(45deg); }',
        'reversable': true
      },		
			{
        'should'    : 'Should mirror transform : skew',
        'expected'  : 'div { transform: skew(-20rad,-30deg); }',
        'input'     : 'div { transform: skew(20rad,30deg); }',
        'reversable': true
      },
			{
        'should'    : 'Should mirror transform : skewX',
        'expected'  : 'div { transform: skewX(-20rad); }',
        'input'     : 'div { transform: skewX(20rad); }',
        'reversable': true
      },		
			{
        'should'    : 'Should mirror transform : skewY',
        'expected'  : 'div { transform: skewY(-10grad); }',
        'input'     : 'div { transform: skewY(10grad); }',
        'reversable': true
      },
	],
  'RTLCSS (Options):': [
      {
        'should'    : 'Should not rename selectors having directional decl. (default)',
        'expected'  : '.right .rtl .east .bright .ultra .least { display:block; right:0; }',
        'input'     : '.right .rtl .east .bright .ultra .least { display:block; left:0; }',
        'reversable': true
      },
      {
        'should'    : 'Should auto rename selectors having no directional decl. (default)',
        'expected'  : '.left .ltr .west .bright .ultra .least { display:block; }',
        'input'     : '.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': true
      },  
      {
        'should'    : 'Should auto rename selectors having no directional decl. (greedy)',
        'expected'  : '.left .ltr .west .bleft .urtla .lwest { display:block; }',
        'input'     : '.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': true,
        'options'   : {'greedy':true}
      },
      {
        'should'    : 'Should not auto rename selectors having no directional decl. (autoRename:false)',
        'expected'  : '.right .rtl .east .bright .ultra .least { display:block; }',
        'input'     : '.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': true,
        'options'   : {'autoRename': false }
      },
      {
        'should'    : 'Should not auto rename selectors having no directional decl. (autoRename:false,greedy)',
        'expected'  : '.right .rtl .east .bright .ultra .least { display:block; }',
        'input'     : '.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': true,
        'options'   : {'autoRename': false, 'greedy': true }
      },
      {
        'should'    : 'Should not preserve processing directive. (default)',
        'expected'  : 'div { left:0; }',
        'input'     : '/*rtl:ignore*/div { left:0; }',
        'reversable': false,
      },
      {
        'should'    : 'Should preserve processing directive. (preserveDirectives:true)',
        'expected'  : '/*rtl:ignore*/div { left:0; }',
        'input'     : '/*rtl:ignore*/div { left:0; }',
        'reversable': false,
        'options'   : {'preserveDirectives':true}
      },
      {
        'should'    : 'Should swap left with right in url (defult)',
        'expected'  : 'div { background-image: url(rtl/west/right.png); right:0; }',
        'input'     : 'div { background-image: url(ltr/east/left.png); left:0; }',
        'reversable': true
      },
      {
        'should'    : 'Should not swap left with right in url (swapLeftRightInUrl:false)',
        'expected'  : 'div { background-image: url(rtl/west/left.png); right:0; }',
        'input'     : 'div { background-image: url(ltr/east/left.png); left:0; }',
        'reversable': true,
        'options'   : {'swapLeftRightInUrl':false}
      },
      {
        'should'    : 'Should swap ltr with rtl in url (defult)',
        'expected'  : 'div { background-image: url(rtl/west/right.png); right:0; }',
        'input'     : 'div { background-image: url(ltr/east/left.png); left:0; }',
        'reversable': true
      },
      {
        'should'    : 'Should not swap ltr with rtl in url (swapLtrRtlInUrl:false)',
        'expected'  : 'div { background-image: url(ltr/west/right.png); right:0; }',
        'input'     : 'div { background-image: url(ltr/east/left.png); left:0; }',
        'reversable': false,
        'options'   : {'swapLtrRtlInUrl':false}
      },
      {
        'should'    : 'Should swap east with west in url (defult)',
        'expected'  : 'div { background-image: url(rtl/west/right.png); right:0; }',
        'input'     : 'div { background-image: url(ltr/east/left.png); left:0; }',
        'reversable': true
      },
      {
        'should'    : 'Should not swap east with west in url (swapWestEastInUrl:false)',
        'expected'  : 'div { background-image: url(rtl/east/right.png); right:0; }',
        'input'     : 'div { background-image: url(ltr/east/left.png); left:0; }',
        'reversable': false,
        'options'   : {'swapWestEastInUrl':false}
      },
	  {
        'should'    : 'Should swap left with right in @import url (swapLeftRightInUrl:true)',
        'expected'  : 'div{display:none;} @import url("right.css");',
        'input'     : 'div{display:none;} @import url("left.css");',
        'reversable': true,
        'options'   : {'swapLeftRightInUrl':true}
      },
	  {
        'should'    : 'Should not swap bright with bleft in @import url (swapLeftRightInUrl:true,greedy:false)',
        'expected'  : 'div{display:none;} @import url("bright.css");',
        'input'     : 'div{display:none;} @import url("bright.css");',
        'reversable': true,
        'options'   : {'swapLeftRightInUrl':true, 'greedy':false}
      },
	  {
        'should'    : 'Should swap bright with bleft in @import url (swapLeftRightInUrl:true,greedy:true)',
        'expected'  : 'div{display:none;} @import url("bleft.css");',
        'input'     : 'div{display:none;} @import url("bright.css");',
        'reversable': true,
        'options'   : {'swapLeftRightInUrl':true, 'greedy':true}
      },
	  {
        'should'    : 'Should swap ltr with rtl in @import url (swapLtrRtlInUrl:true)',
        'expected'  : 'div{display:none;} @import url("rtl.css");',
        'input'     : 'div{display:none;} @import url("ltr.css");',
        'reversable': true,
        'options'   : {'swapLtrRtlInUrl':true}
      },
	  {
        'should'    : 'Should not swap ultra with urtla in @import url (swapLtrRtlInUrl:true,greedy:false)',
        'expected'  : 'div{display:none;} @import url("ultra.css");',
        'input'     : 'div{display:none;} @import url("ultra.css");',
        'reversable': true,
        'options'   : {'swapLtrRtlInUrl':true, 'greedy':false}
      },
	  {
        'should'    : 'Should swap ultra with urtla in @import url (swapLtrRtlInUrl:true,greedy:true)',
        'expected'  : 'div{display:none;} @import url("urtla.css");',
        'input'     : 'div{display:none;} @import url("ultra.css");',
        'reversable': true,
        'options'   : {'swapLtrRtlInUrl':true, 'greedy':true}
      },
	  {
        'should'    : 'Should swap west with east in @import url (swapWestEastInUrl:true)',
        'expected'  : 'div{display:none;} @import url("east.css");',
        'input'     : 'div{display:none;} @import url("west.css");',
        'reversable': true,
        'options'   : {'swapWestEastInUrl':true}
      },
	  {
        'should'    : 'Should not swap western with eastern in @import url (swapWestEastInUrl:true,greedy:false)',
        'expected'  : 'div{display:none;} @import url("western.css");',
        'input'     : 'div{display:none;} @import url("western.css");',
        'reversable': true,
        'options'   : {'swapWestEastInUrl':true, 'greedy':false}
      },
	  {
        'should'    : 'Should swap western with eastern in @import url (swapWestEastInUrl:true,greedy:true)',
        'expected'  : 'div{display:none;} @import url("eastern.css");',
        'input'     : 'div{display:none;} @import url("western.css");',
        'reversable': true,
        'options'   : {'swapWestEastInUrl':true, 'greedy':true}
      },	  
      {
        'should'    : 'Should minify (minify:true)',
        'expected'  : 'div{font-family:"Droid Arabic Kufi";padding:10px 5px 5px 10px;color:red;}.div2{display:none;}',
        'input'     : '\n/*comment*/\ndiv\n/*comment*/\n {\n/*comment*/\n font-family:\n/*comment*/\n "Droid Arabic Kufi";\n/*comment*/\n padding:10px 10px 5px 5px;\n/*comment*/\n color:red; \n/*comment*/\n } \n/*comment*/\n .div2{ /*comment*/ \n display:none; /*comment*/ \n /*comment*/}',
        'reversable': false,
        'options'   : {'minify':true}
      }
  ],
  'RTLCSS (Directives):': [
      {
        'should'    : 'Should auto rename selectors having no directional decl. unless forced to ignore. (default)',
        'expected'  : ' .right .rtl .east .bright .ultra .least { display:block; }',
        'input'     : '/*rtl:ignore*/ .right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
      },
      {
        'should'    : 'Should auto rename selectors having no directional decl. unless forced to ignore. (greedy)',
        'expected'  : ' .right .rtl .east .bright .ultra .least { display:block; }',
        'input'     : '/*rtl:ignore*/ .right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
        'options'   : {'greedy':true}
      },      
      {
        'should'    : 'Should rename selectors when forced. (autoRename:false)',
        'expected'  : '.left .ltr .west .bright .ultra .least { display:block; }',
        'input'     : '/*rtl:rename*/.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
        'options'   : {'autoRename': false }
      },
      {
        'should'    : 'Should rename selectors when forced. (autoRename:false,greedy)',
        'expected'  : '.left .ltr .west .bleft .urtla .lwest { display:block; }',
        'input'     : '/*rtl:rename*/.right .rtl .east .bright .ultra .least { display:block; }',
        'reversable': false,
        'options'   : {'autoRename': false, 'greedy': true }
      },
      {
        'should'    : 'Should prepend value.',
        'expected'  : 'div { font-family: "Droid Arabic Kufi", "Droid Sans", Tahoma; }',
        'input'     : 'div { font-family: "Droid Sans", Tahoma/*rtl:prepend:"Droid Arabic Kufi", */; }',
        'reversable': false,
      },
      {
        'should'    : 'Should replace value.',
        'expected'  : 'div { font-family: "Droid Arabic Kufi"; }',
        'input'     : 'div { font-family: "Droid Sans", Tahoma/*rtl:"Droid Arabic Kufi"*/; }',
        'reversable': false,
      },
      {
        'should'    : 'Should append value.',
        'expected'  : 'div { font-family: "Droid Sans", Tahoma, "Droid Arabic Kufi"; }',
        'input'     : 'div { font-family: "Droid Sans", Tahoma/*rtl:append:, "Droid Arabic Kufi"*/; }',
        'reversable': false,
      },
      {
        'should'    : 'Should insert value.',
        'expected'  : 'div { font-family: "Droid Sans", "Droid Arabic Kufi", Tahoma; }',
        'input'     : 'div { font-family: "Droid Sans"/*rtl:insert:, "Droid Arabic Kufi"*/, Tahoma; }',
        'reversable': false,
      },
      {
        'should'    : 'Should ignore flipping (rule level)',
        'expected'  : 'div { left:10px; text-align:right;}',
        'input'     : '/*rtl:ignore*/div { left:10px; text-align:right;}',
        'reversable': false,
      },
      {
        'should'    : 'Should ignore flipping (decl. level)',
        'expected'  : 'div { left:10px;text-align:left;}',
        'input'     : 'div { left:10px/*rtl:ignore*/;text-align:right;}',
        'reversable': false,
      },
  ]
};
   
(function Run() {
  for (key in tests) {
    var group = tests[key];
    describe(key, function () {
      for(var i=0;i<group.length;i++){
	var item = group[i];
        (function (test) {
          it(test.should, function () {
            assert.equal(rtlcss.process(test.input,test.options), test.expected);
          });
        })(item);
	if(item.reversable)
	  (function (test) {
	    it(test.should + " <REVERESE>", function () {
	      assert.equal(rtlcss.process(test.expected,test.options), test.input);
	    });
	  })(item);
      };
    });
  }
})();
