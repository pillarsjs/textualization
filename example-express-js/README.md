### Installation
```
git clone https://github.com/rblmdst/i18n-using-textualization.git
cd i18n-using-textualization
npm install
node index.js
```

The app will start and then, you will get a result similar to the following  in your console.

![result in console](./console.png)

### Endpoints

url                         | result
----------------------------|------------------------
localhost:8000/             | "Welcome to my app."
localhost:8000/fr           | "Bienvenu dans mon appli."
localhost:8000/test         | "Knowledge is a power!"
localhost:8000/test?lang=fr | "La connaissance est un pouvoir!"
localhost:8000/test?lang=en | "Knowledge is a power!"

### Ressources
[textualization documentation](https://github.com/pillarsjs/textualization)  
[example using pillarsjs framework](https://github.com/pillarsjs/textualization/tree/master/example)
