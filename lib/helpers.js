'use strict';
var Fs = require('fs'),
    Path = require('path');


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
    //var fileExt = $.path.extname(filePath).substr(1);
    //var fileType = fileTypes[fileExt] || fileTypes['default'];
    //var returnType = /\r\n/.test(contents) ? '\r\n' : '\n';

    var repCont = '-->\n' + json2html + '\n<!--';
    var reg = regex;
    var _match = contents.match(reg);

    repCont = _match[0].replace(/(([\t]*)-->)(\n|\r|.)*?(<!--)/gi, repCont);

    var newContents = contents.replace(reg, repCont);

    if (contents !== newContents) {
        Fs.writeFileSync(filePath, newContents);
    }
}


var helpers = {
    getInjectorTagsRegExp: getInjectorTagsRegExp,
    injectScripts: injectScripts
};

module.exports = helpers;
