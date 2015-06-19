# Textualization

![license](https://img.shields.io/badge/license-MIT-blue.svg ) [![Build Status](https://img.shields.io/travis/bifuer/textualization/master.svg)](https://travis-ci.org/bifuer/textualization) [![npm version](https://img.shields.io/npm/v/textualization.svg)](https://www.npmjs.com/package/textualization) [![Github release](https://img.shields.io/github/release/bifuer/textualization.svg)](https://github.com/bifuer/textualization) [![npm downloads](https://img.shields.io/npm/dm/textualization.svg)](https://www.npmjs.com/package/textualization)

Very simple internationalization (aka i18n) manager for Node.js

Textualization offers the possibility of not writing any user text message in your JS code. Allows to translate your code into any language without having to learn a complex methodology.

---

## Textualization in 5 minutes:

### Usual way for writing without i18n support:
```javascript
var message = "User " + username + " has been disconnected at " + time + ".";
```

### Usual way for programming with others i18n systems, something like:
```javascript
var message = i18n.translate(
  "User %s has been disconnected at %s",
  [user.firstName+" "+user.lastName, time.toUTCString()],
  language
);
```

And a translation sheet entry similar to:
```
...
"User %s %s has been disconnected at %s." = "El usuario %s %s se ha desconectado a las %s.";
...
...
```

### **Textualization** way:
```javascript
var message = i18n('user.messages.logOut',{user:user, time:time}));
```

And translate by JSON i18n sheets, with direct dot-notation reference {} or evaluated expressions ·{}·:
```
{
  user: {
    messages: {
      logOut: "The user {user.firstName} {user.lastName} has been disconnected at ·{time.toUTCString()}·",
      ...
    },
    ...
  },
  ...
}
```

More possible uses (See [String.format](https://github.com/bifuer/String.format)):
```
...:"The user ·{username.toUpperCase()}· has been logged out.",
...:"New properties ·{Object.keys(props).join(',')}· added!",
...:"Welcome {user.firstName} {user.lastName}!"
```


### Easy numerals/plurals for every language:

```javascript
i18n('mail.inbox.status', 5);             // Short version
i18n('mail.inbox.status', {_num_:5,...}); // For support of aditional params
```

Translation entry as array of numeral options:
```JSON
...:[
      "No messages in the inbox",
      "There is a message in the inbox",
      "There are {_num_} messages in the inbox"
    ]
````

### And direct objects and arrays parsing as JSON.
```JSON
"The Object {myObj} is loaded." ==> "The Object {a:'A',b:'B'} is loaded."
"The Array {myArray} is loaded." ==> "The Array ['A','B','C'] is loaded."
```

## Along with a simple translation sheet load system:
```
// Hypothetical working directory
myApp/
     /languages/
               /en.json
               /es.json
               /de.json
               /ru.json
```

```javascript
i18n.load('nameSpace', './languages');
i18n.languages = ['en', 'es'];
```

Textualization load from directory `./languages` only `i18n.languages` defined, and refresh translations cache if this property changes.

Additionally also supports .js files. In this case is possible to use functions in translations sheets.
```javascript
({
  hello: "Hello {name}!",
  bye: function (){return "Good bye" + name;}, // contextualized evaluation.
  ...
})
```
> The brackets at the beginning and end of the statement are optionals. In some text editors allows to have a correct syntax highlighting.


## Nothing more, that's all. Simple?

This repository is part of the [Pillars.js](https://github.com/bifuer/pillars) core libraries. Any contribution, collaboration, issues... is well come ;)

contact Us!:
- [Repository issues](https://github.com/bifuer/textualization/issues)
- Twitter [@pillarsJs](http://twitter.com/PillarsJS)
- Mail [javi(at)pillarsjs.com](mailto:javi@pillarsjs.com)

## License
MIT

