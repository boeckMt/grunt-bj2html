/*
 * bj2html
 *
 *
 * Copyright (c) 2015 boeckMt
 * Licensed under the MIT license.
 */

'use strict';

var Fs = require('fs'),
    Path = require('path');


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
            }
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

            var re = getInjectorTagsRegExp(options.starttag, options.endtag);
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
        injectScripts(obj.dest, options.regex, obj.template)
    }


  });

};

function getInjectorTagsRegExp (starttag, endtag) {
    return new RegExp('([\t ]*)(' + escapeForRegExp(starttag) + ')(\\n|\\r|.)*?(' + escapeForRegExp(endtag) + ')', 'gi');
}

function escapeForRegExp (str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function getTag (tag, ext) {
    return tag.replace(new RegExp( escapeForRegExp('{{ext}}'), 'g'), ext);
}

function injectScripts(filePath, regex, json2html) {

    var contents = String(Fs.readFileSync(filePath));
    var fileExt = Path.extname(filePath).substr(1);
    //var fileType = fileTypes['json'] || fileTypes['default'];
    var reg = regex;
    console.log(reg)
    var repCont = '<!-- bj2html:json -->\n' + json2html + '\n<!-- endbj2html -->';
    var returnType = /\r\n/.test(contents) ? '\r\n' : '\n';

    var newContents = contents.replace(
        reg,
        repCont
    );


    if (contents !== newContents) {
        Fs.writeFileSync(filePath, newContents);
    }
}
