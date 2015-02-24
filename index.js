/* jslint node: true */
"use strict";

var fs = require('fs');
var jshint = require('jshint').JSHINT;
var crier = require('crier').addGroup('textualization');
var Procedure = require('procedure');
require('string.format');

var heap = {};
var cache = {};

module.exports = translate;

translate.reload = reload;
translate.refresh = refresh;
translate.load = load;
translate.heap = heap;
translate.cache = cache;

var languages = ['en'];
Object.defineProperty(translate,"languages",{
  enumerable : true,
  get : function(){return languages;},
  set : function(set){
    crier.info('languages',{languages:set});
    languages = set;
    refresh();
  }
});

function reload(){
  heap = {};
  refresh();
}

function refresh(){
  for(var i=0,k=Object.keys(cache),l=k.length;i<l;i++){
    var id = k[i];
    var value = cache[k[i]];
    var method = typeof value === "string" ? loadTranslationsPath : loadTranslations;
    method(id,value);
  }
}

function load(a,b,c){
  var args = Array.prototype.slice.call(arguments);
  if(args.length === 2){
    return loadTranslations(a,b);
  } else if(args.length === 3){
    return loadTranslationsPath(a,b,c);
  }
}

function loadTranslations(id,translations){
  cache[id]=translations;
  for(var i=0,l=languages.length;i<l;i++){
    var lang = languages[i];
    if(translations[lang] && (!heap[lang] || !heap[lang][id])){
      loadTranslation(id,lang,translations[lang]);
    }
  }
}

function loadTranslation(id,lang,translation){
  heap[lang] = heap[lang] || {};
  heap[lang][id] = heap[lang][id] || {};
  var k = Object.keys(translation);
  for(var i=0,l=k.length;i<l;i++){
    if(heap[lang][id][k[i]]){
      crier.info('heap-rewrite',{lang:lang,id:id,node:k[i]});
    }
    heap[lang][id][k[i]]=translation[k[i]];
  }
  crier.info('load-ok',{lang:lang,id:id,nodes:k});
}

function loadTranslationsPath(id,path,callback){
  cache[id]=path;
  var procedure = new Procedure();
  for(var i=0,l=languages.length;i<l;i++){
    var lang = languages[i];
    if(!heap[lang] || !heap[lang][id]){
      procedure.add(loadTranslationPath.bind(null),id,path,lang);
    }
  }
  procedure.race().launch(callback);
}

function loadTranslationPath(id,path,lang,callback){
  fs.readFile(path+'/'+lang+'.js',{encoding:'utf8'},function(error,translation){
    try {
      if(error){
        throw error;
      }
      translation = "(function(){var textualization = {};"+translation+"return textualization;})();";
      if(!jshint(translation)){
        var checkfail = jshint.data().errors;
        var jsHintError = new Error("Sheet sintax error");
        for(var e in checkfail){ // <---- array or object?
          jsHintError.stack += (checkfail[e].reason+" in line "+checkfail[e].line+'\n');
        }
        throw jsHintError;
      }
      translation = eval(translation) || {};
      loadTranslation(id,lang,translation);
      callback();
    } catch (error){
      crier.error('load-error',{path:path,lang:lang,error:error});
      callback(error);
    }
  });
}

function translate(text,params,lang) {
  if(!/^[a-z0-9\$\_]+(\.[a-z0-9\-\_]+)+$/i.test(text)){
    return text;
  }
  lang = lang || languages[0];
  text = text || "";
  var original = text;
  var func,i,k,l;

  var search = '["'+text.split('.').join('"]["')+'"]';
  var match;
  try {
    match = eval("heap['"+lang+"']"+search);
  } catch(error) {
    for(i=0,l=languages;i<l;i++){ // Search any translation by priority order.
      lang = languages[i];
      try {
        match = eval("heap['"+lang+"']"+search);
        break;
      } catch(error) {
        // continue...
      }
    }
  }
  if(!match){
    return original;
  }
  
  try {
    if(typeof match==="string"){ // Simple printf translation
      return match.format(params);

    } else if(Array.isArray(match)){ // Grammatical number translation
      var num;
      if(typeof match!=="object"){
        params = {$num:params};
        num = params[0];
      }
      num = params.$num;

      if(num>=0){
        if(match.length==2){
          return (num==1) ? match[0].format(params) : match[1].format(params) ;
        } else {
          return (num>=match.length-1) ? match[match.length-1].format(params) : match[num].format(params) ;
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
    crier.alert('translate-error',{node:original,params:params,error:error});
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