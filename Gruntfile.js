/*
 * bj2html
 *
 *
 * Copyright (c) 2015 boeckMt
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    //copy index.html to tmp for tests
    copy: {
      test: {
          expand: true,
          cwd: 'test/app/',
          src: '*.html',
          dest: 'tmp/',
          filter: 'isFile'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
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

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy:test', 'bj2html', 'nodeunit']);

  /*
  grunt.registerTask('inject', ['bj2html']);

  grunt.registerTask('co', ['copy:test']);
  */

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
