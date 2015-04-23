'use strict';
var Fs = require('fs'),
    Path = require('path');

//create regex from start and end tags
function getInjectorTagsRegExp (starttag, endtag) {
    return new RegExp('([\t ]*)(' + escapeForRegExp(starttag) + ')(\\n|\\r|.)*?(' + escapeForRegExp(endtag) + ')', 'gi');
    //return new RegExp('(' + escapeForRegExp(starttag) + ')(\\n|\\r|.)*?(' + escapeForRegExp(endtag) + ')', 'gi');
}


function escapeForRegExp (str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function getTag (tag, ext) {
    return tag.replace(new RegExp( escapeForRegExp('{{ext}}'), 'g'), ext);
}

function injectScripts(filePath, regex, json2html) {

    // read file
    var contents = String(Fs.readFileSync(filePath));
    var reg = regex;

    //find match in file
    var _match = contents.match(reg);
    var repCont = json2html;

    // split match in lines
    var lines = _match[0].split("\r\n")
    var leng = lines.length;

    // get start and endtag in match
    var _start = lines[0]
    var _end = lines[leng -1]

    //find tabs in start to append indent to lines
    var indent = _start.match(/[\s]*/i)[0];
    for(var i=0; i< repCont.length;i++){
      repCont[i] = indent + repCont[i];
    }

    // append start and end tags
    repCont.unshift(_start);
    repCont.push(_end);

    // create new string
    var newCont = ""
    var newLeng = repCont.length;
    for(var i=0; i < newLeng ;i++){
      if(i < newLeng -1){
        newCont+= repCont[i] + '\r\n';
      }else{
        newCont+= repCont[i];
      }
    }

    // create new content for file
    var newContents = contents.replace(reg, newCont);

    if (contents !== newContents) {
        Fs.writeFileSync(filePath, newContents);
    }
}


var helpers = {
    getInjectorTagsRegExp: getInjectorTagsRegExp,
    injectScripts: injectScripts
};

module.exports = helpers;
