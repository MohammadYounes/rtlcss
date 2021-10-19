'use strict'

module.exports = [
  {
    should: 'Should mirror object-position (keywords only)',
    expected: 'div {object-position:top left}',
    input: 'div {object-position:top right}',
    reversable: true
  },
  {
    should: 'Should ignore mirroring invalid position',
    expected: 'div {object-position:25% left;}',
    input: 'div {object-position:75% left;}',
    reversable: true
  },
  {
    should: 'Should complement percentage horizontal position ',
    expected: 'div {object-position:100% 75%;}',
    input: 'div {object-position:0 75%;}',
    reversable: false
  },
  {
    should: 'Should complement percentage horizontal position with calc',
    expected: 'div {object-position:calc(100% - (30% + 50px)) 75%;}',
    input: 'div {object-position:calc(30% + 50px) 75%;}',
    reversable: false
  },
  {
    should: 'Should complement percentage horizontal position ',
    expected: 'div {object-position:10.75% top;}',
    input: 'div {object-position:89.25% top;}',
    reversable: true
  },
  {
    should: 'Should complement percentage horizontal position with calc',
    expected: 'div {object-position:calc(100% - (30% + 50px)) calc(30% + 50px);}',
    input: 'div {object-position:calc(30% + 50px) calc(30% + 50px);}',
    reversable: false
  },
  {
    should: 'Should complement percentage (treat 0 as 0%)',
    expected: 'div {object-position:100% 100%;}',
    input: 'div {object-position:0 100%;}',
    reversable: false
  },
  {
    should: 'Should mirror object-position',
    expected: 'div {object-position:right 75%;}',
    input: 'div {object-position:left 75%;}',
    reversable: true
  },
  {
    should: 'Should mirror object-position (calc)',
    expected: 'div {object-position:right -ms-calc(30% + 50px);}',
    input: 'div {object-position:left -ms-calc(30% + 50px);}',
    reversable: true
  }
]
