/* jslint node: true */
"use strict";

var fs = require('fs');
var jshint = require('jshint').JSHINT;
var crier = require('crier').addGroup('textualization');
var Procedure = require('procedure');
require('string.format');

module.exports = new Textualization();
function Textualization(){

  this.$heap = {};
  this.$cache = {};

  var langs = ['en'];
  Object.defineProperty(this,"languages",{
    enumerable : true,
    get : function(){return langs;},
    set : function(set){
      crier.info('languages',{languages:set});
      langs = set;
      this.refresh();
    }
  });
}
  Textualization.prototype.reload = function reload(){
    this.$heap = {};
    this.refresh();
  };
  Textualization.prototype.refresh = function refresh(){
    for(var i=0,k=Object.keys(this.$cache),l=k.length;i<l;i++){
      var id = k[i];
      var value = this.$cache[k[i]];
      var method = typeof value === "string" ? 'loadTranslationsPath' : 'loadTranslations';
      this[method](id,value);
    }
    return this;
  };
  Textualization.prototype.loadTranslations = function loadTranslations(id,translations){
    this.$cache[id]=translations;
    for(var i=0,l=this.languages.length;i<l;i++){
      var lang = this.languages[i];
      if(translations[lang] && (!this.$heap[lang] || !this.$heap[lang][id])){
        this.loadTranslation(id,lang,translations[lang]);
      }
    }
  };
  Textualization.prototype.loadTranslation = function loadTranslation(id,lang,translation){
    this.$heap[lang] = this.$heap[lang] || {};
    this.$heap[lang][id] = this.$heap[lang][id] || {};
    var k = Object.keys(translation);
    for(var i=0,l=k.length;i<l;i++){
      if(this.$heap[lang][id][k[i]]){
        crier.info('heap-rewrite',{lang:lang,id:id,node:k[i]});
      }
      this.$heap[lang][id][k[i]]=translation[k[i]];
    }
    crier.info('load-ok',{lang:lang,id:id,nodes:k});
  };
  Textualization.prototype.loadTranslationsPath = function loadTranslationsPath(id,path,callback){
    this.$cache[id]=path;
    var procedure = new Procedure();
    for(var i=0,l=this.languages.length;i<l;i++){
      var lang = this.languages[i];
      if(!this.$heap[lang] || !this.$heap[lang][id]){
        procedure.add(this.loadTranslationPath.bind(this),id,path,lang);
      }
    }
    procedure.race().launch(callback);
  };
  Textualization.prototype.loadTranslationPath = function loadTranslationPath(id,path,lang,callback){
    fs.readFile(path+'/'+lang+'.js',{encoding:'utf8'},function(error,translation){
      try {
        if(error){throw error;}
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
        this.loadTranslation(id,lang,translation);
        callback();
      } catch (error){
        crier.error('load-error',{path:path,lang:lang,error:error});
        callback(error);
      }
    });
  };
  Textualization.prototype.translate = function translate(text,params,lang) {
    if(!/^[a-z0-9\$\_]+(\.[a-z0-9\-\_]+)+$/i.test(text)){
      return text;
    }
    lang = lang || this.languages[0];
    text = text || "";
    var original = text;
    var sheet = this.$heap;
    var func,i,k,l;

    var search = '["'+text.split('.').join('"]["')+'"]';
    var match;
    try {
      match = eval("sheet["+lang+"]"+search);
    } catch(error) {
      for(i=0,l=this.languages;i<l;i++){ // Search any translation by priority order.
        lang = this.languages[i];
        try {
          match = eval("sheet["+lang+"]"+search);
          break;
        } catch(error) {
          // continue...
        }
      }
      if(!match){
        return original;
      }
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
  };
  module.exports.i18n = module.exports.translate.bind(module.exports);


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
