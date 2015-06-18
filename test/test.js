var test = require('unit.js');
var i18n = require("../index.js");

describe("Textualization -----",function(){ 
  describe("Simple use",function(){ 
    it("Simple i18n",function(){     
      i18n.load("i18nSample",{
        hello: "Hola {firstname} {lastname}"
      },"es");
      i18n.load("i18nSample",{
        hello: "Hello {firstname} {lastname}"
      },"en");

      var user = {
        firstname: "Homer",
        lastname: "Simpson"
      }

      test
        .value(i18n("i18nSample.hello",user,"es"))
          .isType("string")
          .is("Hola Homer Simpson")

        .value(i18n("i18nSample.hello",user,"en"))
          .isType("string")
          .is("Hello Homer Simpson")

    })

    
    it("Numerals - Plural & Singular",function(){     
      i18n.load("i18nSample",{
          inbox: [
            "Tienes un mensaje",
            "Tienes {$num} mensajes"
          ]      
        },"es");

      test
        .value(i18n("i18nSample.inbox",{$num:0},"es"))
          .isType("string")
          .is("Tienes 0 mensajes")
        .value(i18n("i18nSample.inbox",{$num:8},"es"))
          .isType("string")
          .is("Tienes 8 mensajes")
        .value(i18n("i18nSample.inbox",{$num:14999},"es"))
          .isType("string")
          .is("Tienes 14999 mensajes")
        .value(i18n("i18nSample.inbox",{$num:1},"es"))
          .isType("string")
          .is("Tienes un mensaje")

    })


    it("Numerals - Multiple items",function(){     
      i18n.load("i18nSample",{
          nodo: [
              "No hay elementos", 
              "Un elemento",
              "Dos elementos", 
              "Tres elementos",  
              "cuatro elementos",
              "cinco elementos",
              "{$num} elementos"
          ]     
        },"es");

      test
        .value(i18n("i18nSample.nodo",{$num:0},"es"))
          .isType("string")
          .is("No hay elementos")
        .value(i18n("i18nSample.nodo",{$num:1},"es"))
          .isType("string")
          .is("Un elemento")
        .value(i18n("i18nSample.nodo",{$num:2},"es"))
          .isType("string")
          .is("Dos elementos")
        .value(i18n("i18nSample.nodo",{$num:3},"es"))
          .isType("string")
          .is("Tres elementos")
        .value(i18n("i18nSample.nodo",{$num:4},"es"))
          .isType("string")
          .is("cuatro elementos")
        .value(i18n("i18nSample.nodo",{$num:5},"es"))
          .isType("string")
          .is("cinco elementos")
        .value(i18n("i18nSample.nodo",{$num:6},"es"))
          .isType("string")
          .is("6 elementos")
        .value(i18n("i18nSample.nodo",{$num:7},"es"))
          .isType("string")
          .is("7 elementos")
        .value(i18n("i18nSample.nodo",7,"es"))
          .isType("string")
          .is("7 elementos")

    })

    it("Functions ",function(){     
      i18n.load("i18nSample",{
          func:  function(){
            var square = param * param;
            return "El cuadrado de {param} es " + square;
          }    
        },"es");

      test
        .value(i18n("i18nSample.func",{param:5},"es"))
          .isType("string")
          .is("El cuadrado de 5 es 25")

    })

  })

  describe("Load",function(){ 
    it("Load 3 languages",function(){     
      i18n.load("i18nSampleLoad","./test/languages");
      i18n.languages = ["es","en","de"];

      var user = {
        firstname: "Homer",
        lastname: "Simpson"
      };

      test
        .value(i18n("i18nSampleLoad.hello",user,"es"))
          .isType("string")
          .is("Hola Homer Simpson")

        .value(i18n("i18nSampleLoad.hello",user,"en"))
          .isType("string")
          .is("Hi Homer Simpson")

        .value(i18n("i18nSampleLoad.hello",user,"de"))
          .isType("string")
          .is("Hallo Homer Simpson")

    })

    it("Load 3 languages and after 2",function(){     
      i18n.load("i18nSampleLoad","./test/languages");
      i18n.languages = ["es","en","de"];      
      i18n.languages = ["es","en"];
      i18n.reload();

      var user = {
        firstname: "Homer",
        lastname: "Simpson"
      };

      //console.log(i18n.heap);

      test
        .value(i18n("i18nSampleLoad.hello",user,"de"))
          .is("Hallo Homer Simpson")
    })

  })


});