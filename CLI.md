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


### Help
Print a help message with available options and exits.
```
$ rtlcss -help
$ rtlcss --help

```

### Version
Print the current version number and exits.
```
$ rtlcss -v
$ rtlcss --version
```

### Config
Set the configuration settings `config.json` path
```
$ rtlcss -c
$ rtlcss --config <path>
```

Default `config.json` 
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
        "enableLogging": false,
        "minify": false
    },
    "rules": [ ],
    "declarations": [ ],
    "properties": [ ],
    "map": false
}
```

### STDIN 
Read input from `stdin`
```
$ rtlcss -
$ rtlcss --stdin
```
> - If no destination is specificed, the output will be written to  `stdout`.






