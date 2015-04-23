# bj2html

> parse bower.json and update html header

inspired by:
* https://github.com/taptapship/wiredep
* https://github.com/klei/grunt-injector

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bj2html --save-dev
or npm install git://github.com/boeckMt/grunt-bj2html.git --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('bj2html');
```

## The "bj2html" task

### Overview
In your project's Gruntfile, add a section named `bj2html` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  bj2html: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.starttag
Type: `String`
Default value: `'<!-- bj2html:json -->'`

A string value that is used as start-tag.

#### options.endtag
Type: `String`
Default value: `'<!-- endbj2html -->'`

A string value that is used as end-tag.

#### options.bowerPath
Type: `String`
Default value: `'./test/app/bower.json'`

A string value that is used as path to your bower.json.


### Usage Examples

#### Default Options
So if the file `test/app/index.html` has the content `<!-- bj2html:json --> <!-- endbj2html -->`, it will  create a temp-file and populate it with `title`, `version`, `description` and `author` from the bower.json file.

```js
grunt.initConfig({
  bj2html: {
      my_options: {
        options: {},
        files: {
          'tmp/index.html': ['test/app/bower.json']
        }
      }
    },
})
```

#### Custom Options

```js
grunt.initConfig({
  bj2html: {
      my_options: {
        options: {
          starttag: '<!-- bj2html:json -->',
          endtag: '<!-- endbj2html -->',
          bowerPath: 'test/app/bower.json'
        },
        files: {
          'tmp/index.html': ['test/app/bower.json']
        }
      }
    },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 boeckMt. Licensed under the MIT license.
