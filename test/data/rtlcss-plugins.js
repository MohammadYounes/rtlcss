module.exports = [
  {
    'should': 'Should support plugins',
    'expected': 'div:before { content: "ABC";} div:after { content: "B";}',
    'input': '/*rtl:options: {"autoRename": true}*/ div:before { content: "A";} div:after { content: "B";}',
    'reversable': false,
    'plugins': [
      {
        'name': 'test',
        'control': [],
        'properties': [
          {
            'name': 'content',
            'expr': /content/im,
            'action': function (prop, value, cxt) {
              if (value === '"A"') {
                return { 'prop': prop, 'value': '"ABC"' }
              }
              return { 'prop': prop, 'value': value }
            }
          }
        ],
        'values': []
      }
    ]
  },
  {
    'should': 'Should allow overriding default plugin',
    'expected': 'div { text-align:right;}',
    'input': 'div { text-align:right;}',
    'plugins': [
      {
        'name': 'rtlcss',
        'control': [],
        'properties': [],
        'values': []
      }
    ]
  }
]
