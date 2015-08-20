'use strict';
var Fs = require('fs'),
    Path = require('path'),
    LineEnding = "\n";

//create regex from start and end tags
function getInjectorTagsRegExp (starttag, endtag) {
    return new RegExp('([\t ]*)(' + escapeForRegExp(starttag) + ')((\\n|\\r|.)*?)(' + escapeForRegExp(endtag) + ')', 'gi');
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
    var _match = reg.exec(contents);
    if(_match === null){
      return null;
    }
    var repCont = json2html;

    var startMarker = _match[2],
        endMarker = _match[5],
        indent = _match[1];
        
    // append start and end tags
    repCont.unshift(startMarker);
    repCont.push(endMarker);

    // create new string
    var newCont = ""
    var newLeng = repCont.length;
    for(var i=0; i < newLeng ;i++){
      if(i < newLeng -1){
        newCont+= indent + repCont[i] + LineEnding;
      }else{
        newCont+= indent + repCont[i];
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
