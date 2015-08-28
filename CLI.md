RTLCSS CLI
======

> Convert LTR CSS files to RTL using the command line.

In order to get started, you'll want to install RTLCSS's command line interface (CLI) globally. You may need to use sudo (for OSX, *nix, BSD etc) or run your command shell as Administrator (for Windows).


## Install
    npm install -g rtlcss

## Command line usage
```
$ rtlcss [option option=parameter ...] [source] [destination]
```
> If no destination is specified, output will written to `{source name}.rtl.{source ext}`


### Example
Convert input.css to output.rtl.css
```
$ rtlcss input.css output.rtl.css
```

## Options
### Help
Print a help message with available options and exits.
```
$ rtlcss -h
$ rtlcss --help

```

### Version
Print the current version number and exits.
```
$ rtlcss -v
$ rtlcss --version
```

### Config
Configuration can be set using one of the following methods:

* Specify the configuration file manually via the --config flag.
* Put your config into your projects package.json file under the `rtlcssConfig` property.
* Use a special file `.rtlcssrc` or `.rtlcssrc.json`.

```
$ rtlcss -c
$ rtlcss --config <path>
```

Default `.rtlcssrc`
```JAVASCRIPT
{
    "options": {
        "preserveComments": true,
        "preserveDirectives": false,
        "swapLeftRightInUrl": true,
        "swapLtrRtlInUrl": true,
        "swapWestEastInUrl": true,
        "autoRename": true,
        "greedy": false,
        "stringMap":[...],
        "enableLogging": false,
        "minify": false
    },
    "rules": [ ],
    "declarations": [ ],
    "properties": [ ],
    "map": false
}
```

Source Map generation is disabled by default, you can enable it by setting `map` config to `true`. If you want more control over source map generation, visit  [postcss](https://github.com/postcss/postcss/blob/4.1.16/README.md#source-map) for more details on the available options.

### STDIN
Read input from `stdin`
```
$ rtlcss -
$ rtlcss --stdin
```
> - If no destination is specificed, the output will be written to  `stdout`.

### Directory
Used to indicate source/destination are directories - source directory will be processed recursively.
```
$ rtlcss -d
$ rtlcss --directory
```

### Extension
Used with `Directory` option to set the output files extension. **Default** `.rtl.css`
```
$ rtlcss -e ".ext"
$ rtlcss --ext ".ext"
```


### Silent
Silent mode, no warnings or errors will be printed.
```
$ rtlcss -s
$ rtlcss --silent
```
