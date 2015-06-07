# Textualization
Sistema de internacionalización en dot notation. Permite la internacionalización de aplicaciones en JS.

Los **textos de usuario** se establecen de forma independiente del lenguaje de programación, evitando el uso de *texto de usuario* y *traducciones* directamente en el código JS y sustituyendo éste por **nodos de traducción**. 

**Código JS del módulo i18nSample**
```javascript
i18n(i18nSample.hello);
```
>El nodo de traducción es *hello*. El módulo a traducir es *i18nSample*. 


Los **nodos de traducción** estarán contenidos en las **hojas de traducción** específicas para cada idioma: 

**Ejemplo de hoja de traducción es.js**
```javascript
// Los nodos de traducción son *hello*, *sum*, *inbox* y *func*.
textualization={
	hello: "Hola {firstname} {lastname}!!",
	sum: "El resultado de tu operación {operation} es {result}",
	inbox: [
		"No tienes mensajes", //hello
		"Tienes un solo mensaje",
		"Tienes {$num} mensajes"
	],
	func:  function(){
		var square = param * param;
		return "El cuadrado de {param} es " + square;
	}

};
```

>Por otro lado se declara el **directorio de traducciones** para el módulo concreto mediante el método *i18n.load()*. En un directorio de traducciones existirá una hoja de traducción por cada idioma.

>Las traduciones utilizan la metodología de sustitución de cadenas de la librería [String.format](https://github.com/bifuer/String.format)

###Ejemplo básico
**app.js**
```javascript
var i18n = require("textualization");

//Carga de directorio de traducciones
i18n.load("i18nSample","./languages");

//Definición de los idiomas de la aplicación
i18n.languages = ["es","en"];

var user = {
	firstname: "Homer",
	lastname: "Simpson"
}

//Mensaje de usuario
console.log(i18n("i18nSample.hello",user, "es"));
console.log(i18n("i18nSample.hello",user, "en"));

```

**./language/es.js** - Hoja de traducción para el español
```javascript
textualization={
	hello: "Hola {firstname} {lastname}!!"
};
```

**./language/en.js** - Hoja de traducción para el inglés
```javascript
textualization={
	hello: "Hi {firstname} {lastname}!!!"
};
```

**Consola**
> node app.js

> Hi Homer Simpson!!

> Hola Homer Simpson!!



###Numerales
Textualization tiene soporte a traducción con numerales. Para trabajar con numerales, en el nodo de traducción se declara un Array.

El caso de existir dos elementos en el Array, estamos hablando de **plural y singular**. Se declaran dos traducciones en un Array en el nodo de traducción, la primera para el singular y la segunda para el plural.

**es.js**
```javascript
textualization={
	inbox: [		
		"Tienes un mensaje", 		// Singular
		"Tienes {$num} mensajes"	// Plural
		
	]
}
```

En el caso de más de dos elementos en el Array, se sigue la regla: 

```javascript
textualization={
	nodo: [
		"No hay elementos",	
		"Un elemento",
		"Dos elementos", 
		"Tres elementos",  
		....
		"n-2 elementos",
		"n-1 elementos",
		"n o más elementos"
	],
```
> En el código JS se utiliza la variable reservada **$num** para indicar el numeral. 
 
**app.js**
```javascript
var i18n = require("textualization");
i18n.load("i18nSample","./languages"); 
i18n.languages = ["es","en"];

console.log(i18n("i18nSample.inbox",{$num:6},"es"));
console.log(i18n("i18nSample.inbox",{$num:1},"es"));
console.log(i18n("i18nSample.inbox",{$num:0},"es"));
```

**es.js**
```javascript
textualization={
	inbox: [
		"No tienes mensajes", 		// 0
		"Tienes un solo mensaje",	// 1
		"Tienes {$num} mensajes"	// >1
	]
};
```

**en.js**
```javascript
textualization={
	inbox: [
		"No messages",
		"One message",
		"You have {$num} messages"
	]
};
```

**Consola**
> Tienes 6 mensajes

> Tienes un solo mensaje

> No tienes mensajes



###Traducción con funciones
En los nodos de traducciones es posible utilizar funciones.

**app.js**
```javascript
var i18n = require("textualization");
i18n.load("i18nSample","./languages"); 
i18n.languages = ["es","en"];

console.log(i18n("i18nSample.func",{param:5}));
```

**es.js**
```javascript
textualization={
	func:  function(){
		var square = param * param;
		return "El cuadrado de {param} es " + square;
	}
};
```

**Consola**
> El cuadrado de 5 es 25


##Propiedades
###i18n.languages
Array que contiene los idiomas disponibles en la aplicación. El primero será el idioma por defecto.
Independientemente de las hojas de traducciones que existan en el directorio de traducciones cargado mediante *i18n.load()*, sólo se cargarán las hojas de los idiomas definidos en *i18n.languages*. 

Si a lo largo del código hubiera un nuevo seteo de esta propiedad se limpia la caché, y se cachean las hojas de traducciones para los nuevos idiomas declarados.
```javascript
i18n.languages = ["es","en"];
```

##Métodos
###i18n.load(*node*,*path*)
Definición del directorio de traducciones para un nodo concreto.
```javascript
i18n.load("i18nSample","./languages"); 
```

###i18n.refresh()
Si cambia una hoja de traducción, se puede utilizar *i18n.refresh()* para recargar las traducciones.

###i18n(*node*,{*params*},*language*)
Método de traducción.
+ *node*: nodo de traducción que deberá estar definido en las hojas de traducciones. Si no estuviera definido aparecerá simplemente el nodo.
+ *params*: objeto que contiene los parámetros que se pasarán para realizar la traducción.
+ *language*: idioma al que queremos traducir el nodo. En el caso de no especificarlo se utilizará el idioma por defecto que será el primer idioma declarado en *i18n.languages*.

