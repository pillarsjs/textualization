/* jslint node: true */
"use strict";

var fs = require('fs');
var jshint = require('jshint').JSHINT;
var crier = require('crier').addGroup('textualization');
var paths = require('path');
require('string.format');

var heap = {};
var cache = {};

module.exports = translate;

translate.reload = reload;
translate.refresh = refresh;
translate.load = load;
translate.heap = heap;

var languages = [];
Object.defineProperty(translate,"languages",{
  enumerable : true,
  get : function(){return languages;},
  set : function(set){
    crier.info('languages',{languages:set});
    languages = set;
    refresh();
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
  crier.info('load.loaded',{lang:lang,id:id,nodes:Object.keys(translations)});
}

function loadTranslationsPath(id,path,lang,reload){
  cache[id] = path;
  var langs = languages;
  if(Array.isArray(lang)){
    langs = langs.concat(lang);
  } else if (typeof lang === 'string') {
    langs = langs.concat([lang]);
  }
  for(var i=0,l=langs.length;i<l;i++){
    lang = langs[i];
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
      translations = "(function(){var textualization = {};"+translations+"return textualization;})();";
      if(!jshint(translations)){
        var checkfail = jshint.data().errors;
        var jsHintError = new Error("Sheet sintax error");
        for(var e in checkfail){ // <---- array or object?
          jsHintError.stack += (checkfail[e].reason+" in line "+checkfail[e].line+'\n');
        }
        throw jsHintError;
      }
      translations = eval(translations) || {};
      loadTranslations(id,translations,lang);
    } catch (error){
      crier.error('load.error',{id:id,path:path,lang:lang,error:error});
    }
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