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
    var regex = helpers.getInjectorTagsRegExp(options.starttag, options.endtag);

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
                title: bowerData.title || 'title',
                version: bowerData.version || 'version',
                description: bowerData.description || 'description',
                author: bowerData.authors.join(' and ') || 'authors'
            };

            var template = [
              '<title>' + header.title + '</title>',
              '<meta name="title" content="' + header.title + '">',
              '<meta name="version" content="' + header.version + '">',
              '<meta name="description" content="' + header.description + '">',
              '<meta name="author" content="' + header.author + '">'
            ]

            //get files and templates to inject
            filesToInject.push({src: filepath, dest:destination,  template: template});

            // Clear existing content between injectors
            /*
            var templateContent = template,
            templateOriginal = templateContent;

            templateContent = templateContent.replace(regex, function (match, indent, starttag, content, endtag) {
                return indent + starttag + options.lineEnding + indent + endtag;
            });

            */

            //grunt.file.write(destination, templateContent);
            //injectScripts(destination, options.regex, templateContent)

        });

    });


    //Inject all gathered files per destination, template and starttag:
    for(var i = 0; i < filesToInject.length; i++){
        var obj = filesToInject[i];
        //console.log(obj.src, obj.dest, obj.template)
        //grunt.file.write(obj.path, obj.template);
        var inject = helpers.injectScripts(obj.dest, regex, obj.template);
        if(inject == null){
          grunt.log.warn("can not find any tags!");
        }
    }


  });

};
