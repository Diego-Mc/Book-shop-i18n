'use strict'

const STORAGE_KEY = 'books'

var gFilters = {}

const BOOKS_PER_PAGE = 4

var gBooks
createBooks()

function createBooks() {
  var books = getFromStorage(STORAGE_KEY)

  if (!books || books.length === 0) {
    books = [
      {
        id: generateId(),
        name: 'The Catcher in the Rye',
        price: 80,
        imgUrl: 'https://covers.openlibrary.org/b/id/9273490-L.jpg',
        rate: 0,
      },
      {
        id: generateId(),
        name: 'Little Prince',
        price: 70,
        imgUrl: 'https://covers.openlibrary.org/b/id/12635099-L.jpg',
        rate: 0,
      },
      {
        id: generateId(),
        name: 'The Master and Margarita',
        price: 60,
        imgUrl: 'https://covers.openlibrary.org/b/id/12393381-L.jpg',
        rate: 0,
      },
      {
        id: generateId(),
        name: 'The giver',
        price: 75,
        imgUrl: 'https://covers.openlibrary.org/b/id/1472491-L.jpg',
        rate: 0,
      },
      {
        id: generateId(),
        name: '11/22/63',
        price: 80,
        imgUrl: 'https://covers.openlibrary.org/b/id/12456385-L.jpg',
        rate: 0,
      },
    ]
  }

  gBooks = books
  _saveBooksToStorage()
}

function getBooks() {
  const books = gBooks
    .filter((book) => new RegExp(gFilters.search, 'i').test(book.name))
    .sort((b1, b2) => {
      var compVal
      if (gFilters.by === 'name') compVal = b1.name.localeCompare(b2.name)
      else compVal = b1[gFilters.by] - b2[gFilters.by]
      return compVal * gFilters.dir
    })

  const pageLowerBound = gFilters.pageIdx * BOOKS_PER_PAGE
  const pageUpperBound = pageLowerBound + BOOKS_PER_PAGE
  return books.slice(pageLowerBound, pageUpperBound)
}

function setFilter(filterObj) {
  Object.keys(filterObj).forEach((key) => (gFilters[key] = filterObj[key]))
  if (filterObj.by && !filterObj.dir) {
    gFilters.dir = gFilters.by === filterObj.by ? gFilters.dir * -1 : 1
  }
  return gFilters
}

function getFilter() {
  return gFilters
}

function getBook(bookId) {
  return gBooks.find((book) => book.id === bookId)
}

function updateBook(bookId, newPrice) {
  const book = getBook(bookId)
  book.price = newPrice
  _saveBooksToStorage()
}

function createBook(name, price, ISBN) {
  const book = {
    id: generateId(),
    name,
    price,
    imgUrl: `https://covers.openlibrary.org/b/isbn/${ISBN}-L.jpg`,
    rate: 0,
  }
  gBooks.push(book)
  _saveBooksToStorage()
}

function rateBook(bookId, rate) {
  const book = getBook(bookId)
  book.rate = rate
  _saveBooksToStorage()
}

function deleteBook(bookId) {
  const bookIdx = gBooks.findIndex((book) => book.id === bookId)
  gBooks.splice(bookIdx, 1)
  _saveBooksToStorage()
}

function _saveBooksToStorage() {
  saveToStorage(STORAGE_KEY, gBooks)
}

function getPageAmount() {
  return Math.ceil(gBooks.length / BOOKS_PER_PAGE)
}

function getCurrPageIdx() {
  return gFilters.pageIdx
}
