'use strict'

function copyObj(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function generateId() {
  return 'id' + Math.random().toString(32).slice(2)
}

function getLorem(words) {
  var punctuation = ['.', ','],
    text = '',
    phrase,
    punc,
    count = 0,
    nextCapital = true
  while (count < 250) {
    phrase = words[Math.floor(Math.random() * words.length)]
    text += nextCapital ? phrase[0].toUpperCase() + phrase.slice(1) : phrase
    nextCapital = false
    if (Math.random() > 0.8) {
      punc = punctuation[Math.floor(Math.random() * punctuation.length)]
      if (punc === '.') nextCapital = true
      text += punc
    }
    text += ' '
    count = text.match(/\S+/g).length
  }
  return text
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}
