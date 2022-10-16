'use strict'

function copyObj(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function generateId() {
  return 'id' + Math.random().toString(32).slice(2)
}

function getLorem() {
  var words = [
      'the sky',
      'above',
      'the port',
      'was',
      'the color of television',
      'tuned',
      'to',
      'a dead channel',
      'all',
      'this happened',
      'more or less',
      'I',
      'had',
      'the story',
      'bit by bit',
      'from various people',
      'and',
      'as generally',
      'happens',
      'in such cases',
      'each time',
      'it',
      'was',
      'a different story',
      'it',
      'was',
      'a pleasure',
      'to',
      'burn',
    ],
    punctuation = ['.', ','],
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
