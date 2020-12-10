module.exports = [
  {
    should: 'Should mirror (x-offset: 0 means 0%)',
    expected: 'div { perspective-origin:100%; }',
    input: 'div { perspective-origin:0; }',
    reversable: false
  },
  {
    should: 'Should mirror (x-offset)',
    expected: 'div { perspective-origin:90.25%; }',
    input: 'div { perspective-origin:9.75%; }',
    reversable: true
  },
  {
    should: 'Should mirror calc (x-offset)',
    expected: 'div { perspective-origin: -moz-calc(100% - (((25%/2) * 10px))); }',
    input: 'div { perspective-origin: -moz-calc(((25%/2) * 10px)); }',
    reversable: false
  },
  {
    should: 'Should not mirror (x-offset: not percent, not calc)',
    expected: 'div { perspective-origin:10.75px; }',
    input: 'div { perspective-origin:10.75px; }',
    reversable: false
  },
  {
    should: 'Should mirror (offset-keyword)',
    expected: 'div { perspective-origin:right; }',
    input: 'div { perspective-origin:left; }',
    reversable: true
  },
  {
    should: 'Should mirror (x-offset y-offset: 0 means 0%)',
    expected: 'div { perspective-origin:100% 0; }',
    input: 'div { perspective-origin:0 0; }',
    reversable: false
  },
  {
    should: 'Should mirror with y being calc (x-offset y-offset: 0 means 0%)',
    expected: 'div { perspective-origin:100% -webkit-calc(15% * (3/2)); }',
    input: 'div { perspective-origin:0 -webkit-calc(15% * (3/2)); }',
    reversable: false
  },
  {
    should: 'Should mirror percent (x-offset y-offset)',
    expected: 'div { perspective-origin:30.25% 10%; }',
    input: 'div { perspective-origin:69.75% 10%; }',
    reversable: true
  },
  {
    should: 'Should mirror with x being calc (x-offset y-offset)',
    expected: 'div { perspective-origin: -webkit-calc(100% - (15% * (3/2))) 30.25%; }',
    input: 'div { perspective-origin: -webkit-calc(15% * (3/2)) 30.25%; }',
    reversable: false
  },
  {
    should: 'Should mirror with y being calc (x-offset y-offset)',
    expected: 'div { perspective-origin:30.25% calc(15% * (3/2)); }',
    input: 'div { perspective-origin:69.75% calc(15% * (3/2)); }',
    reversable: true
  },
  {
    should: 'Should mirror (x-offset-keyword y-offset)',
    expected: 'div { perspective-origin:right 70%; }',
    input: 'div { perspective-origin:left 70%; }',
    reversable: true
  },
  {
    should: 'Should mirror with calc (x-offset-keyword y-offset)',
    expected: 'div { perspective-origin:right -moz-calc(((140%/2))); }',
    input: 'div { perspective-origin:left -moz-calc(((140%/2))); }',
    reversable: true
  },
  {
    should: 'Should mirror (x-offset-keyword y-offset-keyword)',
    expected: 'div { perspective-origin:right top; }',
    input: 'div { perspective-origin:left top; }',
    reversable: true
  },
  {
    should: 'Should mirror (x-offset-keyword y-offset-keyword)',
    expected: 'div { perspective-origin:left bottom; }',
    input: 'div { perspective-origin:right bottom; }',
    reversable: true
  },
  {
    should: 'Should mirror (y-offset-keyword x-offset-keyword)',
    expected: 'div { perspective-origin:bottom left; }',
    input: 'div { perspective-origin:bottom right; }',
    reversable: true
  }
]
