// In this example, I use Pillars.js framework for HTTP server and controllers. But Take in mind that Textualization is a standalone library!!
var project = require("pillars");
// Start http server built-in in pillars.js
project.services.get('http').start();

// Include textualization library
var i18n = require("textualization");

// Load translation directory with .load method. First argument is the node you'll use in this code, and second argument is directory where we have translations sheets
// We define a node for each languages directory, in a big application we can have many translations directories
i18n.load("t12n","./languages");

// Set languages in our app with .languages propierty. It's an array.
// 1st language, in this case "en", is the default language in application
i18n.languages = ["en","fr","es"];

// I create in my application a controller in this way, because I use Pillars.js
// Textualization library + Pillars.js allows internationalize the path. So I define iPath property in route object
project.routes.add(new Route({
		method:['GET','POST'],
		iPath: 't12n.paths.welcome' // With iPath property in a Pillars.js Controller, we can translate path too.
	},function(gw){		
		// A data or several data. In this example a user,...
		var user = {
			name:"Chelo",
			surname: "Quilón"
		};
		// To use textualization without Pillars.js, use i18n global function directly
		// Use i18n directly to make the translations. you must specify; 1st argument: node; 2nd argumet: data; 3th argument: language
		console.log(i18n('t12n.welcome',user,"es"));
		console.log(i18n('t12n.welcome',user,"en"));
		console.log(i18n('t12n.welcome',user,"fr"));

		// In Pillars.js with .i18n method from gw object (object from pillarsjs framework) we can ignore the third argument (language), gangway know it ;)
		gw.send(gw.i18n('t12n.welcome',user));
		
}));

/*
Pillars.js concepts in this example
project: my all entire project with all controllers and middleware accessible
Controller: a route object. With a configuration and a handler. We make controllers with route objects and adding it to 'project.routes'
gangway: request and response, vitaminized
*/


