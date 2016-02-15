# 2.0.0 RC1
  * New Options:
    * `autoRenameStrict` option to apply auto rename only when a pair exists.
    * `blacklist` option to prevent execution of certian directives.
    * `clean` option with `true` default, to remove directives from output CSS.
    * `processUrls` option  with `false` default, No Url will be processed unless `processUrls` is set to `true` or `{'atrule': true, 'decl': true}`.

  * Updated Options:
    * `autoRename` new default is `false`.
    * `stringMap`:
      * Now maps are sorted by `priority` and `exclusive` flag determines if a map execution should stop iterating over other maps.
      * Removed `east` and `west` from default string map.

  * Removed Options:
    * `enableLogging`, still warnings and errors are reported directly to postcss. 
    * `swapLeftRightInUrl`, `swapLtrRtlInUrl` and `swapWestEastInUrl` in favor of `processUrls` option.
    * `minify`.
    * `preserveComments`, comments inside declaration values will always be preserved.
    * `preserveDirectives`, in favor of `clean` option.

  * Constructor arguments  `rules`, `declarations` and `properties` are now replaced with `plugins`.
  * Support for control directive blocks, e.g. `/*rtl:begin:ignore*/ ... /*rtl:end:ignore*/`.
  * New directives:
    * `config`
    * `options`
    * `raw`
    * `remove`

### 1.7.2 - 30 Jan. 2016
  * Fixes a bug in flipping N-Values containing comments.

### 1.7.2 - 04 Dec. 2015
  * Fixes a compatibility issue with postcss-js (Fixes [#48](https://github.com/MohammadYounes/rtlcss/issues/48)).

### 1.7.1 - 10 Nov. 2015
  * Fixed a bug in flipping backgrounds having functions (Issue [#45](https://github.com/MohammadYounes/rtlcss/issues/45)).

## 1.7.0 - 19 Sep. 2015
  * Add `calc` support.
  * Mark rule as flipped when values are updated by decl. directives.
  * Allow further processing for rules that uses `rename` directive.

### 1.6.3 - 28 Aug. 2015
  * CLI: fix source map option (issue #40).
  * Upgrade to [POSTCSS] v5.0.x

### 1.6.2 - 21 Jul. 2015
  * CLI: fix loading custom configuration file manually via the --config flag. **Thanks @KeyKaKiTO**

### 1.6.1 - 17 Mar. 2015
  * Fixed flipping units having more than 1 digit before the decimal point.

## 1.6.0 - 15 Mar. 2015
  * Support flipping `matrix3d` transform.

### 1.5.2 - 28 Feb. 2015
  * Fix flipping string maps containing regular expressions special characters (Fixes [#24](https://github.com/MohammadYounes/rtlcss/issues/24)).

### 1.5.1 - 14 Feb. 2015
  * Fix flipping multiple shadows when a hex color was used. **Thanks @ocean90**

## 1.5.0 - 30 Jan. 2015
  * CLI: New option `-e,--ext` to set output files extension when processing a directory.

### 1.4.3 - 24 Jan. 2015
  * Upgrade to [POSTCSS] v4.0.x **Thanks @necolas**

### 1.4.2 - 24 Oct. 2014
  * CLI: Switch to Unix line endings (Fixes [#14](https://github.com/MohammadYounes/rtlcss/issues/14))

### 1.4.1 - 24 Oct. 2014
  * CLI: Print processing errors.

## 1.4.0 - 10 Oct. 2014
  * CLI: Support processing a directory. see [CLI documentation](https://github.com/MohammadYounes/rtlcss/blob/master/CLI.md#directory)

### 1.3.1 - 29 Sep. 2014
  * Update README.md (typos).

## 1.3.0 - 28 Sep. 2014
  * New feature - String Maps. Add your own set of swappable strings, for example (prev/next).
  * Preserves lowercase, UPPERCASE and Capitalization when swapping ***left***, ***right***, ***ltr***, ***rtl***, ***west*** and ***east***.

## 1.2.0 - 26 Sep. 2014
  * Support !important comments for directives (enables flipping minified stylesheets).

## 1.1.0 - 26 Sep. 2014
  * Upgrade to [POSTCSS] v2.2.5
  * Support flipping `border-color`, `border-style` and `background-position-x`

# 1.0.0 - 24 Aug. 2014
  * Upgrade to [POSTCSS] v2.2.1
  * Support flipping urls in '@import' rule.
  * Fix JSON parse error when configuration file is UTF-8 encoded.
  * Better minification.

## 0.9.0 - 10 Aug. 2014
  * New configuration loader.
  * CLI configuration can be set using one of the following methods:
    * Specify the configuration file manually via the --config flag.
    * Put your config into your projects package.json file under the `rtlcssConfig` property
    * Use a special file `.rtlcssrc` or `.rtlcssrc.json`

## 0.8.0 - 8 Aug. 2014
  * Fix source map generation.

## 0.7.0 - 4 Jul. 2014
  * Fix flipping linear-gradient.

## 0.6.0 - 4 Jul. 2014
  * Allow additional comments inside `ignore`/`rename` rule level directives.

## 0.5.0 - 11 Jun. 2014
  * Add CLI support.

## 0.4.0 - 5 Apr. 2014
  * Fix flipping transform-origin.
  * Update autoRename to search for all swappable words.

## 0.3.0 - 5 Apr. 2014
  * Support flipping rotateZ.
  * Fix flipping rotate3d.
  * Fix flipping skew, skewX and skewY.
  * Fix flipping cursor value.
  * Fix flipping translate3d.
  * Update flipping background horizontal position to treat 0 as 0%

## 0.2.1 - 20 Mar. 2014
  * Upgrade to [POSTCSS] v0.3.4

## 0.2.0 - 20 Mar. 2014
  * Support combining with other processors.
  * Support rad, grad & turn angle units when flipping linear-gradient
  * Fix typo in config.js

## 0.1.3 - 7 Mar. 2014
  * Fix missing include in rules.js

## 0.1.2 - 5 Mar. 2014
  * New option: minify output CSS.
  * Updated README.md

## 0.1.1 - 4 Mar. 2014
  * Initial commit.
