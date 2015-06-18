({
  'languages': "Available languages:".cyan+"{languages}".yellow,
  'load': {
    'loaded': "Translation loaded: ".cyan+"'{id}'".yellow+", language: ".cyan+"{lang}".yellow,
    'error': "Translation load error: ".red+"'{id}'".yellow+" '{path}'".yellow+", language: ".red+"{lang}".yellow
  },
  'translate': {
    'error': "Error on i18n translation: ".red+"'{node}', {params}".yellow
  }
})