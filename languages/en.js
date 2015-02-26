textualization = {
  'languages': "Avaliable languages:".cyan+"{languages}".yellow,
  'load': {
    'rewrite': "Translation node overwrite: ".red+" {id}:'{node}', language: {lang}".yellow,
    'loaded': "Translation loaded: ".cyan+"'{id}'>{nodes}".yellow+", language: ".cyan+"{lang}".yellow,
    'error': "Translation load error: ".red+"'{id}'".yellow+" '{path}'".yellow+", language: ".red+"{lang}".yellow+"\n\n{error}\n".bgRed
  },
  'translate': {
    'error': "Error on i18n translation: ".red+"'{node}', {params}".yellow+"\n\n{error}\n".bgRed
  }
};