module.exports = function (text) {
  var pos = 0
  var value = text
  var prefix = value.charAt(0) === '!' ? '!rtl:' : 'rtl:'
  var meta

  if (value.indexOf(prefix) === 0) {
    meta = {
      'option': '',
      'param': '',
      'begin': true,
      'end': true
    }
    value = value.slice(prefix.length)
    pos = value.indexOf(':')

    if (pos > -1) {
      meta.option = value.slice(0, pos)
      // begin/end are always true, unless one of them actually exists.
      meta.begin = meta.option !== 'end'
      meta.end = meta.option !== 'begin'
      if (meta.option === 'begin' || meta.option === 'end') {
        value = value.slice(meta.option.length + 1)
        pos = value.indexOf(':')
        if (pos > -1) {
          meta.option = value.slice(0, pos)
          value = value.slice(pos)
          meta.param = value.slice(1)
        } else {
          meta.option = value
        }
      } else {
        meta.param = value.slice(pos + 1)
      }
    } else {
      meta.option = value
    }
  }
  return meta
}
