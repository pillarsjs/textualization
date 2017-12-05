const project = require("pillars");
const i18n = require("textualization");

project.services.get("http").configure({port:3001}).start(); 

i18n.load("vanity","./languages");
i18n.languages = ["es","en","fr"];

project.routes.add(new Route({
	iPath: 'vanity.paths.greeting'
},
function(gw){
	gw.render("./index.pug");
}));