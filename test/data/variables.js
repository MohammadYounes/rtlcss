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
  }
]
