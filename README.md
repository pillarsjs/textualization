# Textualization
Sistema de internacionalización en dot notation. Permite la internacionalización del codigo JS.

Las traducciones se establecen de forma independiente del lenguaje de programación, posibilitando un sólo código fuente en JS, y tantas hojas de traducción como idiomas existan.

###Ejemplo básico
**app.js**
```javascript
var i18n = require("textualization");

//Carga de directorio de traducciones
i18n.load("i18nSample","./languages");

//Definición de los idiomas de la aplicación
i18n.languages = ["es","en"];

//Mensaje de usuario
console.log(i18n("i18nSample.hello",{},"en"));
console.log(i18n("i18nSample.hello",{},"es"));

```

**./welcome-lang/es.js** - Hoja de traducción para el español
```javascript
textualization={
	hello: "Hola!!"
};
```

**./welcome-lang/en.js** - Hoja de traducción para el inglés
```javascript
textualization={
	hello: "Hi!!!"
};
```

**Consola**
> node app.js
> Hi!!
> Hola!!



###Traducción con soporte a parámetros 
Permite el paso de parámetros a las traduciones.
**app.js**
```javascript
var i18n = require("textualization");
i18n.load("i18nSample","./languages"); 
i18n.languages = ["es","en"];

var operation = "5 + 5";
var result = eval(operation);

console.log(i18n("i18nSample.sum",{op:operation, res:result},"en"));
console.log(i18n("i18nSample.sum",{op:operation, res:result},"es"));
```

**es.js**
```javascript
textualization={
	sum: "El resultado de tu operación {op} es {res}"
};
```

**en.js**
```javascript
textualization={
	sum: "The result of the operation {op} is {res}"
};
```

**Consola**
> node app.js
> The result of the operation 5 + 5 is 10
> El resultado de tu operación 5 + 5 es 10

###Plurales y singulares
Textualization tiene soporte a traducción de singulares y plurales.
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
		"No tienes mensajes",
		"Tienes un solo mensaje",
		"Tienes {$num} mensajes"
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

###Funciones de traducción directa
**app.js**
```javascript
var i18n = require("textualization");
i18n.load("i18nSample","./languages"); 
i18n.languages = ["es","en"];

console.log(i18n("i18nSample.magic",{texto:"hola"}));
```

**es.js**
```javascript
textualization={
	magic: "El texto {texto} al revés es: ·{params.texto.split('').reverse().join('')}·",
};
```
**en.js**
```javascript
textualization={
	magic: "Text {texto} backwards is: ·{params.texto.split('').reverse().join('')}·",
};
```

**Consola**
> El texto al revés es: aloh


##Propiedades
###i18n.languages
Array que contiene los idiomas disponibles en la aplicación. El primero será el idioma por defecto.
```javascript
i18n.languages = ["es","en"];
```

##Métodos
###i18n.load(*node*,*path*)
Definición del directorio de traducciones para un nodo concreto.
```javascript
i18n.load("i18nSample","./languages"); 
```

###i18n(*node*,*params*,*language*)
Método de traducción.


