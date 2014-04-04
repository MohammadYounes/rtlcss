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
        'should'    : 'Should mirror property value: margin',
        'expected'  : 'div { margin: 1px 4px 3px 2px; }',
        'input'     : 'div { margin: 1px 2px 3px 4px; }',
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
};
//TODO: transform-origin.
   
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