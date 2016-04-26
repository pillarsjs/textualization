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
      i18n.load("i18nSample",{
        hello: "Olá {firstname} {lastname}"
      },"pt_BR");

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
        
        .value(i18n("i18nSample.hello",user,"pt_BR"))
          .isType("string")
          .is("Olá Homer Simpson")

    })

    
    it("Numerals - Plural & Singular",function(){     
      i18n.load("i18nSample",{
          inbox: [
            "Tienes un mensaje",
            "Tienes {_num_} mensajes"
          ]      
        },"es");

      test
        .value(i18n("i18nSample.inbox",{_num_:0},"es"))
          .isType("string")
          .is("Tienes 0 mensajes")
        .value(i18n("i18nSample.inbox",{_num_:8},"es"))
          .isType("string")
          .is("Tienes 8 mensajes")
        .value(i18n("i18nSample.inbox",{_num_:14999},"es"))
          .isType("string")
          .is("Tienes 14999 mensajes")
        .value(i18n("i18nSample.inbox",{_num_:1},"es"))
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
              "{_num_} elementos"
          ]     
        },"es");

      test
        .value(i18n("i18nSample.nodo",{_num_:0},"es"))
          .isType("string")
          .is("No hay elementos")
        .value(i18n("i18nSample.nodo",{_num_:1},"es"))
          .isType("string")
          .is("Un elemento")
        .value(i18n("i18nSample.nodo",{_num_:2},"es"))
          .isType("string")
          .is("Dos elementos")
        .value(i18n("i18nSample.nodo",{_num_:3},"es"))
          .isType("string")
          .is("Tres elementos")
        .value(i18n("i18nSample.nodo",{_num_:4},"es"))
          .isType("string")
          .is("cuatro elementos")
        .value(i18n("i18nSample.nodo",{_num_:5},"es"))
          .isType("string")
          .is("cinco elementos")
        .value(i18n("i18nSample.nodo",{_num_:6},"es"))
          .isType("string")
          .is("6 elementos")
        .value(i18n("i18nSample.nodo",{_num_:7},"es"))
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
    
    it("Load 4 languages",function(){     
      i18n.load("i18nSampleLoad","./test/languages");
      i18n.languages = ["es","en","de","pt_BR"];

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
          
        .value(i18n("i18nSampleLoad.hello",user,"pt_BR"))
          .isType("string")
          .is("Olá Homer Simpson")

    })

  })


});