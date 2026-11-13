'use strict'

module.exports = [
  {
    should: 'Should end ignore after an empty rule',
    expected: '.empty {} .next { padding-left: 6%; }',
    input: '/* rtl:ignore */ .empty {} .next { padding-right: 6%; }',
    reversable: false
  },
  {
    should: 'Should end ignore after an empty nested container',
    expected: '@media screen { .empty {} } .next { padding-left: 6%; }',
    input: '/* rtl:ignore */ @media screen { .empty {} } .next { padding-right: 6%; }',
    reversable: false
  },
  {
    should: 'Should process value directive before !important',
    expected: 'div { right: auto !important;}',
    input: 'div { right: auto /* rtl:ignore */!important;}',
    reversable: false
  },
  {
    should: 'Should process value directive after !important',
    expected: 'div { right: auto !important;}',
    input: 'div { right: auto !important/* rtl:ignore */;}',
    reversable: false
  },
  {
    should: 'Should process value directive before value',
    expected: 'div { right: auto !important;}',
    input: 'div { right: /* rtl:ignore */auto !important;}',
    reversable: false
  }
]
