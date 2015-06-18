/* jslint node: true */
"use strict";

global.modulesCache = global.modulesCache || {};
if(global.modulesCache['textualization']){
  module.exports = global.modulesCache['textualization'];
  return;
}

var fs = require('fs');
var jshint = require('jshint').JSHINT;
var crier = require('crier').addGroup('textualization');
crier.constructor.console.format = function(text,meta,lang){
  return translate(text,meta,lang);
};
var paths = require('path');
require('string.format');

var heap = {};
var cache = {};

module.exports = global.modulesCache['textualization'] = translate;

translate.reload = reload;
translate.refresh = refresh;
translate.load = load;
translate.heap = heap;

var languages = [];
Object.defineProperty(translate,"languages",{
  enumerable : true,
  get : function(){return languages;},
  set : function(set){
    languages = set;
    refresh();
    crier.info('languages',{languages:set});
  }
});

translate.load('textualization',paths.join(__dirname,'languages'));

function reload(){
  refresh(true);
}

function refresh(reload){
  for(var i=0,k=Object.keys(cache),l=k.length;i<l;i++){
    loadTranslationsPath(k[i],cache[k[i]],reload);
  }
}

function load(id,translations,lang){
  var method = typeof translations === "string" ? loadTranslationsPath : loadTranslations;
  method(id,translations,lang);
}

function loadTranslations(id,translations,lang){
  heap[id] = heap[id] || {};
  heap[id][lang] = translations;
  crier.info('load.loaded',{lang:lang,id:id,nodes:translations});
}

function loadTranslationsPath(id,path,reload){
  cache[id] = path;
  for(var i=0,l=languages.length;i<l;i++){
    var lang = languages[i];
    if(!reload && heap[id] && heap[id][lang]){
      break;
    }
    var translations;
    try {
      translations = fs.readFileSync(paths.join(path,lang+'.js'),{encoding:'utf8'});
    } catch (error) {
      break;
    }
    
    try {
      translations = "(function(){return "+translations+";})();";
      if(!jshint(translations)){
        var checkfail = jshint.data().errors;
        var jsHintError = new Error("Sheet sintax error");
        jsHintError.stack = "";
        for(var e in checkfail){ // array [{id:'(error)|(main)...',raw,code,evidence,line,character,scope:'(main)',a,b,c,d,reason},...]
          if(checkfail[e]){ // Fix null result at end
            jsHintError.stack += "\tLine "+checkfail[e].line+' > '+(checkfail[e].reason+'\n\t\t...'+checkfail[e].evidence+'...\n');
          }
        }
        throw jsHintError;
      }
      translations = eval(translations) || {};
    } catch (error){
      crier.error('load.error',{id:id,path:path,lang:lang,error:error});
    }

    loadTranslations(id,translations,lang);
  }
}

function translate(text,params,lang) {
  if(!/^[a-z0-9\$\_]+(\.[a-z0-9\-\_]+)+$/i.test(text)){
    return text;
  }
  lang = lang || languages[0];
  text = text || "";
  var original = text;

  var node = text.split('.');
  var id =  node.shift();

  if(!heap[id] || Object.keys(heap[id]).length===0){return original;}

  var func,i,k,l;
  var search = 'heap["'+[id,lang].concat(node).join('"]["')+'"]';
  var match;
  try {
    match = eval(search);
  } catch(error) {
    for(i=1,l=languages.length;i<l;i++){ // Search any translation by priority order.
      search = 'heap["'+[id,languages[i]].concat(node).join('"]["')+'"]';
      try {
        match = eval(search);
        break;
      } catch(error) {
        // continue...
      }
    }
    search = 'heap["'+[id,Object.keys(heap[id])[0]].concat(node).join('"]["')+'"]';
    try {
      match = eval(search);
    } catch(error) {
      // continue...
    }
  }
  if(!match){
    return original;
  }
  
  try {
    if(typeof match==="string"){ // Simple printf translation
      return match.format(params);

    } else if(Array.isArray(match)){ // Grammatical number translation
      var _num_;
      if(typeof params!=="object"){
        _num_ = params;
        params = {_num_:_num_};
      } else {
        _num_ = params._num_;
      }

      if(_num_>=0){
        if(match.length==2){
          return (_num_==1) ? match[0].format(params) : match[1].format(params) ;
        } else {
          return (_num_>=match.length-1) ? match[match.length-1].format(params) : match[_num_].format(params) ;
        }
      } else {
        throw new Error("Invalid params for gramatical number translation");
      }

    } else if(typeof match==="function"){ // Function handled translation
        func = functionBody(match);
        func = "function("+Object.keys(params).join(',')+"){\n"+func+"\n}";
        eval("func = "+func+";");
        var funcparams = [];
        for(i=0,k=Object.keys(params),l=k.length;i<l;i++){
          funcparams.push(params[k[i]]);
        }
        match = func.apply(params,funcparams);
        return match.format(params);

    }
    // !=String & !=Array & !=Function => Invalid translation value.
    console.log(typeof match);
    throw new Error("Invalid translation format");

  } catch(error){
    crier.alert('translate.error',{node:original,params:params,error:error});
    return original;
  }
}

function functionBody(func){
  var source = func.toString();
  var ini = /^\W*function[^{]*{/;
  var end = /\}$/;
  ini = ini.exec(source);
  if(ini){ini = ini.index+ini[0].length;} else {ini = 0;}
  end = end.exec(source);
  if(end){end = end.index;} else {end = source.length;}
  return source.substring(ini,end);
}