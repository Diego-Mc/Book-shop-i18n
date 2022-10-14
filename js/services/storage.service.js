'use strict'

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getFromStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}
