/* global describe */
/* global it */
const assert = require('assert')
const spawn = require('child_process').spawn
const fs = require('fs')

function runCommand (cmd, args, done) {
  const child = spawn(cmd, args)
  let resp = ''
  let err = ''
  child.stderr.on('data', function (error) { err += error })
  child.stdout.on('data', function (buffer) { resp += buffer.toString() })
  child.stdout.on('end', function () { done(err, resp) })
}

const configPath = './test/css/config.json'
const inputPath = './test/css/input.css'
const expectedPath = './test/css/input.expected.css'
const outputPath = './test/css/input.rtl.css'

describe('# CLI', function () {
  it('Should succeed', function (done) {
    runCommand('node', ['./bin/rtlcss.js', inputPath, '--config', configPath, '--silent', ''], function (err, resp) {
      if (err) throw new Error(err)
      fs.readFile(expectedPath, 'utf-8', function (err, expected) {
        if (err) throw new Error(err)
        fs.readFile(outputPath, 'utf-8', function (err, output) {
          if (err) throw new Error(err)
          assert.equal(expected, output)
          fs.unlink(outputPath, function () {
            done()
          })
        })
      })
    })
  })
})
