'use strict'

module.exports = [
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
