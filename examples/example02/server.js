const project = require("pillars");
const i18n = require("textualization");

project.services.get("http").configure({port:3001}).start(); 

// En un nombre de nodo, en este caso: vanity, cargamos el contenido del directorio 
// Donde estarán las hojas de traducciones, que tan sólo es un fichero por idioma, con extensión js.
i18n.load("vanity","./languages");
// Declaramos los idiomas disponibles en la aplicación, el primero será el por defecto
i18n.languages = ["es","en","fr"];

// Agregamos iPath, el cual nos permite traducir también las rutas
project.routes.add(new Route({
	iPath: 'vanity.paths.greeting'
},
function(gw){
	gw.render("./index.pug");
}));