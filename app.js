
;(function(){
    'use strict'
    
    let words = [
      'ALURA',
      'REACT',
      'LENGUAJE',
      'VUE',
      'JAVA',
      'ANGULAR',
      'PROGRAMAR',
      'ORACLE',
      'NODE',
      'DESARROLLO',
      'JAVASCRIPT'
    ]
    
    // variable para almacenar la configuracion actual
    let game = null
    // para ver si ya se ha enviado alguna alerta
    let finished = false
    
    
    const object = { //guardo en un objeto todos los elementos a capturar
      man: document.getElementById('man'),
      guessed: document.querySelector('.guessed'),
      wrong: document.querySelector('.wrong')
    }
    
    function drawing(game) {
      let $elem
      $elem = object.man
    
      let state = game.state
      if (state === 8) {
        state = game.previuos
      }
      $elem.src = './img/0' + state + '.png' //ira cambiando las imagenes de acuerdo al state
    
      // renderizacion de letras adivinadas
      let word = game.word //las almaceno dentro de una variable
      let guessed = game.guessed
      $elem = object.guessed
      // borramos los elementos anteriores
      $elem.innerHTML = ''
      for (let letter of word) { //recorro letra a letra
        let $span = document.createElement('span')
        let $txt = document.createTextNode('')
        
        if (guessed.has(letter)) {
          $txt.nodeValue = letter //si se ha adivinado se muestra
        }
        $span.setAttribute('class', 'letra adivinada')
        $span.appendChild($txt)
        $elem.appendChild($span)
      }
    
      let wrong = game.wrong //almaceno las letras erradas
      $elem = object.wrong
      $elem.innerHTML = ''
      
      for (let letter of wrong) { //recorro las letras erradas
        let $span = document.createElement('span')
        let $txt = document.createTextNode(letter)
        $span.setAttribute('class', 'letra errada')
        $span.appendChild($txt)
        $elem.appendChild($span)
      }
    }
    
    function guess(game, letter) {
      let state = game.state
      if (state === 1 || state === 8) {
        return
      }
    
      let guessed = game.guessed
      let wrong = game.wrong
      if (guessed.has(letter) || wrong.has(letter)) {
        return
      }
    
      let word = game.word
      let letters = game.letters
      if (letters.has(letter)) {
        guessed.add(letter) //si la word contiene la letter se agrega la acertada
        game.restante--
    
        if (game.restante === 0) {
          game.previuos = game.state
          game.state =  8
        }
      } else {
        game.state--
        wrong.add(letter) //se agregan las letters erradas
      }
    }
    
    window.onkeypress = function guessletter(e) {
      let letter = e.key
      letter = letter.toUpperCase()
      if (/[^A-ZÑ]/.test(letter)) {
        return
      }
      guess(game, letter)
      let state = game.state
      if (state === 8 && !finished) { //el state 8 no existe, el ultimo es el 7
        setTimeout(alertWin, 0)
        finished = true
      }else if (state === 1 && !finished) { //el state 1 es perdido
        let word = game.word
        let fn = alertLose.bind(undefined, word)
        setTimeout(fn, 0)
        finished = true
      }
      drawing(game)
    }
    
    window.newGame = function newGame() {
      let word = randomWord()
      game = {}
      game.word = word
      game.state = 7
      game.guessed = new Set()
      game.wrong = new Set()
      finished = false
    
      let letters = new Set()
      for (let letter of word) {
        letters.add(letter)
      }
      game.letters = letters
      game.restante = letters.size
    
      drawing(game)
      console.log(game)
    }
    
    
    function randomWord() {
      let index = ~~(Math.random() * words.length)
      return words[index]
    }
    
    function alertWin() {
        Swal.fire({
            icon: 'success',
            text:'Felicidades, ganaste!!',
    })
    }
    
    function alertLose(word) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Has perdido... la word era: ' + word,
          })
    }
    
    newGame()
    
    document.getElementById("desistir").addEventListener("click", () => { location.reload(); })
    
    }())