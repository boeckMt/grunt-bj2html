/*
 * bj2html
 *
 *
 * Copyright (c) 2015 boeckMt
 * Licensed under the MIT license.
 */

'use strict';

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

        //console.log('destination:' + destination)
        //console.log('source:' + source)

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

        });

    });


    //Inject all gathered files per destination, template and starttag:
    console.log(filesToInject)
    for(var i = 0; i < filesToInject.length; i++){

        //var header = grunt.file.read('header.php').split('\n');

        var obj = filesToInject[i];
        console.log(obj.src, obj.dest, obj.template)
        //grunt.file.write(obj.path, obj.template);
    }


/*
    _.forIn(filesToInject, function (templates, destination) {
        _.forIn(templates, function (files, template) {
            // Remove possible duplicates:
            files = _.uniq(files);

            files.forEach(function (obj) {
                // Get start and end tag for each file:
                obj.starttag = getTag(options.starttag, obj.key);
                obj.endtag = getTag(options.endtag, obj.key);

                // Fix filename (remove ignorepaths and such):
                var file = obj.path;
                if (options.relative) {
                    var base =  path.dirname(destination);
                    file = path.relative(base, file);
                }
                file = unixify(file);
                file = makeMinifiedIfNeeded(options.min, file);
                if (options.ignorePath || obj.ignore) {
                    file = removeBasePath(toArray(options.ignorePath).concat(toArray(obj.ignore)), file);
                }
                if (options.addRootSlash) {
                    file = addRootSlash(file);
                } else {
                    file = removeRootSlash(file);
                }
                obj.file = file;
            });

            // Read template:
            var templateContent = options.templateString || grunt.file.read(template),
            templateOriginal = templateContent;

            // Inject per start tag:
            _.forIn(_.groupBy(files, 'starttag'), function (sources, starttag) {
                var endtag = sources[0].endtag,
                key = sources[0].key;

                // Transform to injection content:
                sources.forEach(function (obj, i) {
                    obj.transformed = options.transform(obj.file, i, sources.length);
                });

                // Sort files if needed:
                if (typeof options.sort === 'function') {
                    sources.sort(function (a, b) {
                        return options.sort(a.file, b.file);
                    });
                }

                // Do the injection:
                var re = getInjectorTagsRegExp(starttag, endtag);
                templateContent = templateContent.replace(re, function (match, indent, starttag, content, endtag) {
                    grunt.log.writeln('Injecting ' + key.green + ' files ' + ('(' + sources.length + ' files)').grey);
                    return indent + starttag + getIndentedTransformations(sources, indent, options.lineEnding) + endtag;
                });
            });

            // Write the destination file.
            if (templateContent !== templateOriginal || !grunt.file.exists(destination)) {
                grunt.file.write(destination, templateContent);
            } else {
                grunt.log.ok('Nothing changed');
            }
        });
    });

*/




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
