'use strict'
module.exports = [
  {
    should: 'Should not negate tokens',
    expected: 'div { box-shadow: rgba(0, 128, 128, 0.98) inset -5em 1em 0;}',
    input: 'div { box-shadow: rgba(0, 128, 128, 0.98) inset 5em 1em 0;}',
    reversable: true
  },
  {
    should: 'Should not flip env(safe-area-inset-*) (processEnv:false)',
    expected: `div { 
      margin-right:env(safe-area-inset-left, 10px);
      padding:env(safe-area-inset-right, 20px);
    }`,
    input: `div { 
      margin-left:env(safe-area-inset-left, 10px);
      padding:env(safe-area-inset-right, 20px);
    }`,
    reversable: true,
    options: { processEnv: false }
  },
  {
    should: 'Should flip env(safe-area-inset-*) (1 value)',
    expected: `div { 
      margin-right:env(safe-area-inset-right, 10px);
      padding:env(safe-area-inset-left, 20px);
    }`,
    input: `div { 
      margin-left:env(safe-area-inset-left, 10px);
      padding:env(safe-area-inset-right, 20px);
    }`,
    reversable: true
  },
  {
    should: 'Should flip env(safe-area-inset-*) (n+1 values)',
    expected: `div { 
      padding:
        env(safe-area-inset-top, 0px)
        env(safe-area-inset-right, 20px)
        env(safe-area-inset-bottom, 0px)
        env(safe-area-inset-left, 10px);
      margin:
        env(safe-area-inset-top, 0px)
        env(safe-area-inset-left, 20px)
        env(safe-area-inset-bottom, 0px);
      border-width:
        env(safe-area-inset-top, 0px)
        env(safe-area-inset-left, 20px);
    }`,
    input: `div { 
      padding:
        env(safe-area-inset-top, 0px)
        env(safe-area-inset-right, 10px)
        env(safe-area-inset-bottom, 0px)
        env(safe-area-inset-left, 20px);
      margin:
        env(safe-area-inset-top, 0px)
        env(safe-area-inset-right, 20px)
        env(safe-area-inset-bottom, 0px);
      border-width:
        env(safe-area-inset-top, 0px)
        env(safe-area-inset-right, 20px);
    }`,
    reversable: true
  },
  {
    should: 'Should ignore flipping env(SAFE-AREA-INSET-*) (case-sensitive)',
    expected: `div { 
      padding:
        env(SAFE-AREA-INSET-TOP, 0px)
        env(SAFE-AREA-INSET-LEFT, 20px)
        env(SAFE-AREA-INSET-BOTTOM, 0px)
        env(SAFE-AREA-INSET-RIGHT, 10px);
      border-right-width: env(SAFE-AREA-INSET-LEFT, 40px);
    }`,
    input: `div { 
      padding:
        env(SAFE-AREA-INSET-TOP, 0px)
        env(SAFE-AREA-INSET-RIGHT, 10px)
        env(SAFE-AREA-INSET-BOTTOM, 0px)
        env(SAFE-AREA-INSET-LEFT, 20px);
      border-left-width: env(SAFE-AREA-INSET-LEFT, 40px);
    }`,
    reversable: true
  }
]
