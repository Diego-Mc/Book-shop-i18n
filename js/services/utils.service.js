'use strict'

function copyObj(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function generateId() {
  return 'id' + Math.random().toString(32).slice(2)
}

function generateLoremArr(sentencesAmount = 1) {
  var loremArr = []
  while (sentencesAmount > 0) {
    loremArr.push('lorem '.repeat(getRandomInt(12, 36)).trim() + '.')
    sentencesAmount--
  }
  return loremArr
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}
