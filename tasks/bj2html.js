/*
 * bj2html
 *
 *
 * Copyright (c) 2015 boeckMt
 * Licensed under the MIT license.
 */

'use strict';
var helpers = require('../lib/helpers.js');

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('bj2html', 'parse bower.json and update html header', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', ',
      starttag: '<!-- bj2html:json -->',
      endtag: '<!-- endbj2html -->',
      bowerPath: './test/app/bower.json'
    });

    var filesToInject = [];

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {
        var template = options.templateString || file.dest,
        destination = options.destFile || file.dest,
        source = options.srcFiles || file.orig.src;

        source.forEach(function(filepath) {
            // Warn on and remove invalid source files.
            if (!grunt.file.exists(filepath)) {
                grunt.log.warn('Source file "' + filepath + '" not found.');
                return;
            }

            var bowerData = grunt.file.readJSON(filepath);
            var header = {
                title: bowerData.title,
                version: bowerData.version,
                description: bowerData.description,
                author: bowerData.authors.join()
            };
            var template = '<title>' + header.title + '</title>\n' +
            '<meta name="title" content="' + header.title + '">\n' +
            '<meta name="version" content="' + header.version + '">\n' +
            '<meta name="description" content="' + header.description + '">\n' +
            '<meta name="author" content="' + header.author + '">';

            //get files and templates to inject
            filesToInject.push({src: filepath, dest:destination,  template: template});
            //console.log(files)

            // Clear existing content between injectors
            var templateContent = template,
            templateOriginal = templateContent;

            var re = helpers.getInjectorTagsRegExp(options.starttag, options.endtag);
            templateContent = templateContent.replace(re, function (match, indent, starttag, content, endtag) {
                return indent + starttag + options.lineEnding + indent + endtag;
            });

            //grunt.file.write(destination, templateContent);
            //injectScripts(destination, options.regex, templateContent)

        });

    });


    //Inject all gathered files per destination, template and starttag:
    for(var i = 0; i < filesToInject.length; i++){
        var obj = filesToInject[i];
        //console.log(obj.src, obj.dest, obj.template)
        //grunt.file.write(obj.path, obj.template);
        helpers.injectScripts(obj.dest, options.regex, obj.template);
    }


  });

};
