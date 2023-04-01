/* eslint-env mocha */

'use strict'

const assert = require('assert').strict
const { spawn } = require('child_process')
const fs = require('fs')
const bin = require('../package.json').bin.rtlcss

const configPath = './test/css/config.json'
const inputPath = './test/css/input.css'
const expectedPath = './test/css/input.expected.css'
const outputPath = './test/css/input.rtl.css'

function runCommand (cmd, args, done) {
  const child = spawn(cmd, args)
  let output = ''
  child.stderr.on('data', (data) => { output += data })
  child.stdout.on('end', () => { done(output) })
}

describe('# CLI', () => {
  it('Should succeed', (done) => {
    runCommand('node', [bin, inputPath, '--config', configPath, '--silent'], (err) => {
      if (err) throw new Error(err)
      fs.readFile(expectedPath, 'utf-8', (err, expected) => {
        if (err) throw new Error(err)
        fs.readFile(outputPath, 'utf-8', (err, output) => {
          if (err) throw new Error(err)
          assert.equal(expected, output)
          fs.unlink(outputPath, () => {
            done()
          })
        })
      })
    })
  })
})
