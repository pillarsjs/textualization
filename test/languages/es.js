({
  sum: "El resultado de tu operación {operation} es {result}",
  inbox: [
    "No tienes mensajes", //hello
    "Tienes un solo mensaje",
    "Tienes {$num} mensajes"
  ],
  magic: "El texto {texto} al reves es: ·{params.texto.split('').reverse().join('')}·",
  hello: "Hola {firstname} {lastname}",
  func:  function(){
    var square = param * param;
    return "El cuadrado de {param} es " + square;
  }
})