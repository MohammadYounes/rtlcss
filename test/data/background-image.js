'use strict'

module.exports = [
  {
    should: 'Should process string map in url (processUrls:true)',
    expected: 'div { background-image: url(images/rtl.png), url(images/right.png);}',
    input: 'div { background-image: url(images/ltr.png), url(images/left.png);}',
    reversable: true,
    options: { processUrls: true }
  },
  {
    should: 'Should not process string map in data url (processUrls:true)',
    expected: 'div { background-image: url(data:image/svg+xml;base64,ltr), url(data:image/png;base64,something/rtl);}',
    input: 'div { background-image: url(data:image/svg+xml;base64,ltr), url(data:image/png;base64,something/rtl);}',
    reversable: true,
    options: { processUrls: true }
  },
  {
    should: 'Should not negate color value for linear gradient',
    expected: 'div { background-image: linear-gradient(rgba(255, 255, 255, 0.3) 0%, #ff8 100%);}',
    input: 'div { background-image: linear-gradient(rgba(255, 255, 255, 0.3) 0%, #ff8 100%);}',
    reversable: true
  },
  {
    should: 'Should not negate color value for linear gradient with calc',
    expected: 'div { background-image: linear-gradient(rgba(255, 255, calc((125 * 2) + 5), 0.3) 0%, #ff8 100%);}',
    input: 'div { background-image: linear-gradient(rgba(255, 255, calc((125 * 2) + 5), 0.3) 0%, #ff8 100%);}',
    reversable: true
  },
  {
    should: 'Should negate angle value for linear gradient',
    expected: 'div { background-image: linear-gradient(13.25deg, rgba(255, 255, 255, .15) 25%, transparent 25%);}',
    input: 'div { background-image: linear-gradient(-13.25deg, rgba(255, 255, 255, .15) 25%, transparent 25%);}',
    reversable: true
  },
  {
    should: 'Should complement the x position of a radial gradient',
    expected: 'div { background-image: radial-gradient(circle at 34% 40%, rgb(255, 165, 0) 0%, rgb(0, 0, 255) 100%);}',
    input: 'div { background-image: radial-gradient(circle at 66% 40%, rgb(255, 165, 0) 0%, rgb(0, 0, 255) 100%);}',
    reversable: true
  },
  {
    should: 'Should complement the x position of a conic gradient',
    expected: 'div { background-image: conic-gradient(from -90deg at 75% 50%, red, blue);}',
    input: 'div { background-image: conic-gradient(from 90deg at 25% 50%, red, blue);}',
    reversable: true
  },
  {
    should: 'Should swap the x keyword of a conic gradient',
    expected: 'div { background-image: conic-gradient(from -90deg at left 40%, red, blue);}',
    input: 'div { background-image: conic-gradient(from 90deg at right 40%, red, blue);}',
    reversable: true
  },
  {
    should: 'Should swap the x keyword of a radial gradient',
    expected: 'div { background-image: radial-gradient(at left top, red, blue);}',
    input: 'div { background-image: radial-gradient(at right top, red, blue);}',
    reversable: true
  },
  {
    should: 'Should process a very long url quickly',
    expected: `div { background-image: url("${'abcdefghij'.repeat(100000)}");}`,
    input: `div { background-image: url("${'abcdefghij'.repeat(100000)}");}`,
    reversable: false
  }
]
