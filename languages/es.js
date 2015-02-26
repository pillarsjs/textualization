textualization = {
  'languages': "Idiomas disponibles:".cyan+"{languages}".yellow,
  'load': {
    'rewrite': "Nodo de traducciones modificado: ".red+" {id}:'{node}', idioma: {lang}".yellow,
    'loaded': "Nuevas traducciones disponibles: ".cyan+"'{id}'>{nodes}".yellow+", language: ".cyan+"{lang}".yellow,
    'error': "Error al cargar la traducción: ".red+"'{id}'".yellow+" '{path}'".yellow+", idioma: ".red+"{lang}".yellow+"\n\n{error}\n".bgRed
  },
  'translate': {
    'error': "Error i18n al tratar de traducir: ".red+"'{node}', {params}".yellow+"\n\n{error}\n".bgRed
  }
};