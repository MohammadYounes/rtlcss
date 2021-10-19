/* eslint-env mocha */

'use strict'

const assert = require('assert').strict
const { spawn } = require('child_process')
const fs = require('fs')
const bin = require('../package.json').bin.rtlcss

function runCommand (cmd, args, done) {
  const child = spawn(cmd, args)
  let resp = ''
  let err = ''
  child.stderr.on('data', (error) => { err += error })
  child.stdout.on('data', (buffer) => { resp += buffer.toString() })
  child.stdout.on('end', () => { done(err, resp) })
}

const configPath = './test/css/config.json'
const inputPath = './test/css/input.css'
const expectedPath = './test/css/input.expected.css'
const outputPath = './test/css/input.rtl.css'

describe('# CLI', () => {
  it('Should succeed', (done) => {
    runCommand('node', [bin, inputPath, '--config', configPath, '--silent'], (err, resp) => {
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
