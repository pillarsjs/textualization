// create the server
var http = require("http")
var express = require("express")
var app = express()

var server = http.createServer(app)
var port = process.env.port || 8000

// set i18n
var i18n = require("textualization")
/*
  i18n.load():
  first argument -> the namespace or node the i18n object will be attached to
  second argument -> the path to directory that contains language files ("en.json", "fr.json", etc.)
*/
i18n.load("namespace", "./languages")
const SUPPORTED_LANGUAGES = ["en", "fr"]
i18n.languages =  SUPPORTED_LANGUAGES // only "es.json" and "fr.json" will be loaded even other languages files(eg: "es.json)" are present

// endpoints

// will display "Bienvenu dans mon appli." to the user
app.get("/fr", (req, res) => {
  return res.send(i18n("namespace.welcome", null, "fr")) // case when no template variable present
})

// will display "Welcome to my app." to the user
app.get("/", (req, res) => {
  return res.send(i18n("namespace.welcome", null, "en")) // case when no template variable present
})

/*
  "localhost:8000/test" will print : "Knowledge is a power!"
  "localhost:8000/test?lang=fr" will print : "La connaissance est un pouvoir!"
  "localhost:8000/test?lang=en" will print : "Knowledge is a power!"
*/
app.get("/test", (req, res) => {
  let userLang = req.query["lang"] // langage specified by user in the query eg: "localhost:8000/time?lang=fr"
  let lang = userLang && SUPPORTED_LANGUAGES.indexOf(userLang) !== -1 ? userLang : SUPPORTED_LANGUAGES[0]
  console.log({lang})
  return res.send(i18n("namespace.quote", null, lang)) // case when no template variable present
})

server.listen(port, (err) => {
  if (err) {
    console.log(i18n("namespace.messages.app_start_failed", {err: err}, "en")) // can use ES6 {err} instead of {err: err}
    process.exit(0)
  }
  console.log(i18n("namespace.messages.app_start_succeed", {port}, "en")) // {port} is equal to {port: port}
})

