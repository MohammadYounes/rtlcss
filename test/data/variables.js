'use strict'
module.exports = [
  {
    should: 'Should not process variables starting with direction',
    expected: ':root {--left-margin: 1em}',
    input: ':root {--left-margin: 1em}',
    reversable: true
  },
  {
    should: 'Should not process variables containing direction',
    expected: ':root {--brightest: red}',
    input: ':root {--brightest: red}',
    reversable: true
  },
  {
    should: 'Should flip variable values if it is flagged as an alias',
    expected: ':root {--pad: 10px 4px 2px 5px}',
    input: ':root {--pad: 10px 5px 2px 4px}',
    reversable: true,
    options: { aliases: { '--pad': 'padding' } }
  },
  {
    should: 'Should not flip variable names starting with direction included in aliases',
    expected: ':root {--left-margin: 10px}',
    input: ':root {--left-margin: 10px}',
    reversable: true,
    options: { aliases: { '--left-margin': 'left' } }
  },
  {
    should: 'Should not flip variable names containing direction included in aliases',
    expected: ':root {--brightest: 10px}',
    input: ':root {--brightest: 10px}',
    reversable: true,
    options: { aliases: { '--brightest': 'right' } }
  }
]
