Intructions

1. In /examples directory, execute npm install, when done
2. execute node app.js, now you'll have a HTTP server on http://locahost:8080
3. You can visit 
	- http://localhost:8080/welcome
	- http://localhost:8080/es/bienvenido
	- http://localhost:8080/fr/bienvenue
In all visits you'll can see in console, 3 messages from console.log()

4. In this example you can see how use library. 
	- We set up as many translation sheets as languages we have in application. In /languages directory. 
	- One sheet for espanish es.js, one sheet for french fr.js, and one sheet for english en.js
	- In these sheets there are translation nodes.
	- In your application you must use i18n global function to make translation. 
		
5. 
	var i18n = require("textualization");
	i18n.load(node,directory); 
	i18n(node,data);
