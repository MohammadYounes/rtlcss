'use strict'

module.exports = [
  {
    should: 'Should mirror translate (x only)',
    expected: 'div { translate: -10px; }',
    input: 'div { translate: 10px; }',
    reversable: true
  },
  {
    should: 'Should not mirror translate with var (x only)',
    expected: 'div { translate: var(--x); }',
    input: 'div { translate: var(--x); }',
    reversable: true
  },
  {
    should: 'Should mirror translate (x y)',
    expected: 'div { translate: -10px 20px; }',
    input: 'div { translate: 10px 20px; }',
    reversable: true
  },
  {
    should: 'Should not mirror translate (x y) with var',
    expected: 'div { translate: var(--x) 20px; }',
    input: 'div { translate: var(--x) 20px; }',
    reversable: true
  },
  {
    should: 'Should mirror translate (x y z)',
    expected: 'div { translate: -50% 20px 5px; }',
    input: 'div { translate: 50% 20px 5px; }',
    reversable: true
  },
  {
    should: 'Should not mirror translate (x y z) with var',
    expected: 'div { translate: var(--x) 20px 5px; }',
    input: 'div { translate: var(--x) 20px 5px; }',
    reversable: true
  },
  {
    should: 'Should mirror translate with calc',
    expected: 'div { translate: calc(-1*(10px + 5%)) 20px; }',
    input: 'div { translate: calc(10px + 5%) 20px; }',
    reversable: false
  },
  {
    should: 'Should not change translate: none',
    expected: 'div { translate: none; }',
    input: 'div { translate: none; }',
    reversable: false
  },
  {
    should: 'Should mirror rotate (angle)',
    expected: 'div { rotate: -45deg; }',
    input: 'div { rotate: 45deg; }',
    reversable: true
  },
  {
    should: 'Should mirror rotate (z axis)',
    expected: 'div { rotate: z -0.5turn; }',
    input: 'div { rotate: z 0.5turn; }',
    reversable: true
  },
  {
    should: 'Should mirror rotate (y axis)',
    expected: 'div { rotate: y -30deg; }',
    input: 'div { rotate: y 30deg; }',
    reversable: true
  },
  {
    should: 'Should mirror rotate (y axis, angle first)',
    expected: 'div { rotate: -30deg y; }',
    input: 'div { rotate: 30deg y; }',
    reversable: true
  },
  {
    should: 'Should not mirror rotate (x axis)',
    expected: 'div { rotate: x 45deg; }',
    input: 'div { rotate: x 45deg; }',
    reversable: false
  },
  {
    should: 'Should mirror rotate (vector)',
    expected: 'div { rotate: -1 2 3 -45deg; }',
    input: 'div { rotate: 1 2 3 45deg; }',
    reversable: true
  },
  {
    should: 'Should mirror rotate (angle before vector)',
    expected: 'div { rotate: -45deg -1 2 3; }',
    input: 'div { rotate: 45deg 1 2 3; }',
    reversable: true
  },
  {
    should: 'Should not mirror rotate vector when the angle is a variable',
    expected: 'div { rotate: -1 2 3 var(--angle); }',
    input: 'div { rotate: 1 2 3 var(--angle); }',
    reversable: false
  },
  {
    should: 'Should not mirror rotate vector when the angle/axis are variables',
    expected: 'div { rotate: var(--x) 2 3 var(--angle); }',
    input: 'div { rotate: var(--x) 2 3 var(--angle); }',
    reversable: false
  },
  {
    should: 'Should mirror rotate with calc',
    expected: 'div { rotate: calc(-1*(45deg + 10deg)); }',
    input: 'div { rotate: calc(45deg + 10deg); }',
    reversable: false
  },
  {
    should: 'Should mirror rotate (vector) with calc',
    expected: 'div { rotate: calc(-1*(1)) 2 3 calc(-1*(45deg + 10deg)); }',
    input: 'div { rotate: calc(1) 2 3 calc(45deg + 10deg); }',
    reversable: false
  },
  {
    should: 'Should not change rotate: none',
    expected: 'div { rotate: none; }',
    input: 'div { rotate: none; }',
    reversable: false
  }
]
