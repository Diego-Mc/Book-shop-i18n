'use strict'

var gView
const VIEW_STORAGE_KEY = 'favlayout'

function onInit() {
  gView = getFromStorage(VIEW_STORAGE_KEY) || 'cards'

  const queryParams = new URLSearchParams(location.search)
  const filterObj = {
    filter: queryParams.get('filter') || '',
    dir: +queryParams.get('dir') || 1,
    search: queryParams.get('search') || '',
    pageIdx: +queryParams.get('pageIdx') || 0,
  }
  setFilter(filterObj)

  if (queryParams.get('opened-book')) onRead(queryParams.get('opened-book'))

  renderBooks()
  _renderFilters()
  _renderPageNav()
}

function renderBooks() {
  if (gView === 'cards') _renderCards()
  else _renderTable()
}

function onSetView(viewStr) {
  gView = viewStr
  saveToStorage(VIEW_STORAGE_KEY, viewStr)
  renderBooks()
  _renderFilters()
}

function onFilter(filterObj) {
  filterObj = setFilter(filterObj)
  saveToQuery(filterObj)
  renderBooks()
  _renderFilters()
}

function onSearch(searchObj, el) {
  searchObj = setFilter(searchObj)
  saveToQuery(searchObj)
  renderBooks()
}

function onPageFilter(pageFilterObj) {
  pageFilterObj = setFilter(pageFilterObj)
  saveToQuery(pageFilterObj)
  renderBooks()
  _renderPageNav()
}

function saveToQuery(obj) {
  const currQuery = new URLSearchParams(location.search)
  Object.keys(obj).forEach((key) => currQuery.set(key, obj[key]))
  const newUrl = `${location.protocol}//${location.host}${
    location.pathname
  }?${currQuery.toString()}`
  history.pushState({ path: newUrl }, '', newUrl)
}

function _renderTable() {
  const books = getBooks()

  const tbodyHTML = books
    .map(
      (book) =>
        `<tr>` +
        `<td>${book.id}</td>` +
        `<td>${book.name}</td>` +
        `<td>${book.price}</td>` +
        `<td><button onclick="onRead('${book.id}')">Read</button></td>` +
        `<td><button onclick="onUpdateForm('${book.id}')">Update</button></td>` +
        `<td><button onclick="onDelete('${book.id}')">Delete</button></td>` +
        `<tr>`
    )
    .join('')

  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th onclick="onFilter({filter: 'name'})">Title</th>
          <th onclick="onFilter({filter: 'price'})">Price</th>
          <th colspan="3">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${tbodyHTML}
      </tbody>
    </table>
  `

  document.querySelector('.container').innerHTML = tableHTML
}

function _renderCards() {
  const books = getBooks()

  const cardViewHTML = `
  <section class="card-view">
    ${books
      .map(
        (book) =>
          `<div class="book-card"
          style="background-image:url('${book.imgUrl}'">` +
          `<span class="book-rate-card-circle">${book.rate}</span>` +
          `<div class="btns">` +
          `<button onclick="onRead('${book.id}')">Read</button>` +
          `<button onclick="onUpdateForm('${book.id}')">Update</button>` +
          `<button onclick="onDelete('${book.id}')">Delete</button>` +
          `</div>` +
          `<p><span>${book.name}</span> - <span>${book.price}$</span></p>` +
          `</div>`
      )
      .join('')}
  </section>
  `

  document.querySelector('.container').innerHTML = cardViewHTML
}

function onRead(bookId) {
  const book = getBook(bookId)
  const formHTML = `
          <form onsubmit="event.preventDefault()">
            <h2>${book.name}</h2>
            <h3>Summary</h3>
            <p>${generateLoremArr(5).join('<br/><br/>')}</p>
            <div class="book-rate-input">
              <button class="rate-btn rate-increase"
              ${book.rate === 10 ? 'disabled' : ''}
              onclick="onRateChange('${bookId}',+1)">+</button>

              <span class="book-rate">${book.rate}</span>

              <button class="rate-btn rate-decrease"
              ${book.rate === 0 ? 'disabled' : ''}
              onclick="onRateChange('${bookId}',-1)">-</button>
            </div>
          </form>
  `
  saveToQuery({ 'opened-book': bookId })

  document.querySelector('.overlay').innerHTML = _addOverlay(formHTML)
}

function onRateChange(bookId, diff) {
  const elRate = document.querySelector('.book-rate')
  const newRate = +elRate.innerText + diff
  const elDecrementBtn = document.querySelector('.rate-decrease')
  const elIncrementBtn = document.querySelector('.rate-increase')

  elDecrementBtn.disabled = newRate === 0 ? true : false
  elIncrementBtn.disabled = newRate === 10 ? true : false

  elRate.innerText = newRate
  rateBook(bookId, newRate)
  renderBooks()
}

function onUpdateForm(bookId) {
  const book = getBook(bookId)
  const formHTML = `
          <form onsubmit="onUpdate('${bookId}',event)">
            <h2>Update price for ${book.name}</h2>
            <label>
              New Price:
              <input class="price" placeholder="Enter a new price" />
            </label>
            <button>Update</button>
          </form>
  `

  document.querySelector('.overlay').innerHTML = _addOverlay(formHTML)
}

function onUpdate(bookId, ev) {
  ev.preventDefault()
  const newPrice = document.querySelector('.price').value
  console.log(newPrice)
  if (!newPrice) return

  updateBook(bookId, +newPrice)
  renderBooks()
  document.querySelector('.overlay').innerHTML = ''
}

function onDelete(bookId) {
  deleteBook(bookId)
  renderBooks()
  _renderPageNav()
}

function onAddBookForm() {
  const formHTML = `
          <form onsubmit="onAddBook(event)">
            <h2>Add a new book</h2>
            <label>
              Book title:
              <input class="book-title" placeholder="Enter a book title" />
            </label>
            <label>
              Book price:
              <input class="book-price" placeholder="Enter a book price" />
            </label>
            <label>
              Book <a href="https://isbnsearch.org/" target="_blank">ISBN-10</a> (optional - to be used for book cover):
              <input class="book-ISBN" placeholder="Enter the book's ISBN" />
            </label>
            <button>Add book</button>
          </form>
  `
  document.querySelector('.overlay').innerHTML = _addOverlay(formHTML)
}

function onAddBook(ev) {
  ev.preventDefault()
  const name = document.querySelector('.book-title').value
  const price = document.querySelector('.book-price').value
  var ISBN = document.querySelector('.book-ISBN').value

  if (!name || !price) return

  createBook(name.trim(), +price, ISBN)
  renderBooks()
  _renderPageNav()
  document.querySelector('.overlay').innerHTML = ''
}

const _addOverlay = (html) => `
    <div class="container-shadow" onclick="onCloseOverlay(this)">
      <div class="form-container" onclick="event.stopPropagation()">
        ${html}
      </div>
    </div>
`

function onCloseOverlay(el) {
  el.parentElement.innerHTML = ''
  saveToQuery({ 'opened-book': '' })
}
function _renderFilters() {
  const filter = getFilter()
  const filterHTML = `
        <div class="view-btn-container">
          <button
            onclick="onSetView('cards')"
            class="view-btn ${gView === 'cards' ? 'checked' : ''}"
            name="cards"
            >
            <img
            class="${gView === 'cards' ? 'checked' : ''}"
            src="images/icons/grid-alt.svg"/>
          </button>
          <button
            onclick="onSetView('table')"
            class="view-btn ${gView === 'table' ? 'checked' : ''}"
            name="table"
            >
            <img
            class="${gView === 'table' ? 'checked' : ''}"
            src="images/icons/list.svg"/>
          </button>
        </div>


        <button
          onclick="onFilter({filter: 'name'})"
          class="name-filter filter-btn ${
            filter.filter === 'name' ? 'selected' : ''
          }"
          name="name"
        >
          name ${filter.filter === 'name' ? (filter.dir === 1 ? '>' : '<') : ''}
        </button>
        <button
          onclick="onFilter({filter: 'price'})"
          class="price-filter filter-btn ${
            filter.filter === 'price' ? 'selected' : ''
          }"
          name="price"
        >
          price ${
            filter.filter === 'price' ? (filter.dir === 1 ? '>' : '<') : ''
          }
        </button>
        <button
          onclick="onFilter({filter: 'rate'})"
          class="rate-filter filter-btn ${
            filter.filter === 'rate' ? 'selected' : ''
          }"
          name="rate"
        >
          rate ${filter.filter === 'rate' ? (filter.dir === 1 ? '>' : '<') : ''}
        </button>
        <input
          onkeyup="onSearch({search: this.value},this)"
          class="searchbar"
          type="text"
          placeholder="Search..."
          value="${filter.search}"
        />`
  document.querySelector('.filter-wrapper').innerHTML = filterHTML
}

function _renderPageNav() {
  const pageAmount = getPageAmount()
  const currPage = getCurrPageIdx()
  const pageNav = document.querySelector('.page-nav')

  if (pageAmount <= 1) return (pageNav.innerHTML = '')

  var pageNavHTML = `
        <button onclick="onPageFilter({pageIdx:0})" class="page-btn">
          &lt;&lt;
        </button>
        `

  for (var i = 1; i <= pageAmount; i++) {
    pageNavHTML += `<button onclick="onPageFilter(
      {pageIdx:${i - 1}})"
      ${currPage === i - 1 ? 'disabled' : ''}
      class="page-btn">${i}</button>`
  }

  pageNavHTML += `
        <button onclick="onPageFilter({pageIdx:${
          pageAmount - 1
        }})" class="page-btn">
          &gt;&gt;
        </button>`

  pageNav.innerHTML = pageNavHTML
}
