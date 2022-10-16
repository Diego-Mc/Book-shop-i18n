'use strict'

var gView
const VIEW_STORAGE_KEY = 'favlayout'

function addIcons() {}

function onInit() {
  gView = getFromStorage(VIEW_STORAGE_KEY) || 'cards'

  const queryParams = new URLSearchParams(location.search)
  const filterObj = {
    by: queryParams.get('by') || '',
    dir: +queryParams.get('dir') || 1,
    search: queryParams.get('search') || '',
    pageIdx: +queryParams.get('pageIdx') || 0,
  }
  setFilter(filterObj)

  $('#name-filter').click({ by: 'name' }, onFilter)
  $('#price-filter').click({ by: 'price' }, onFilter)
  $('#rate-filter').click({ by: 'rate' }, onFilter)
  $('.searchbar').keyup(onSearch)

  // <input
  //         onkeyup="onSearch({search: this.value},this)"

  if (queryParams.get('opened-book')) onRead(queryParams.get('opened-book'))

  renderBooks()
  _updateFilters()
  _renderPageNav()
}

function renderBooks() {
  if (gView === 'cards') _renderCards()
  else _renderTable()
}

function onSetView(el) {
  gView = el.data.view
  saveToStorage(VIEW_STORAGE_KEY, gView)
  renderBooks()
  _updateFilters()
}

function onFilter(ev) {
  const filterObj = setFilter(ev.data)
  saveToQuery(filterObj)
  renderBooks()
  _updateFilters()
}

function onSearch() {
  const searchObj = setFilter({ search: this.value })
  saveToQuery(searchObj)
  renderBooks()
}

function onPageFilter(ev) {
  const pageFilterObj = setFilter(ev.data)
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

  document.querySelector('.container-1').innerHTML = tableHTML
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

  document.querySelector('.container-1').innerHTML = cardViewHTML
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

function _updateFilters() {
  const filter = getFilter()

  $('#view-btn')
    .prop('checked', gView === 'cards')
    .on('change', { view: gView === 'cards' ? 'table' : 'cards' }, onSetView)

  $('.filter-btn .bi').hide()
  $('.filter-btn .icon').show()

  const $filter = $(`#${filter.by}-filter`)
  const $input = $filter.next()

  $filter.prop('checked', true)
  $input.find('.bi').hide()
  $input.find(`.bi-caret-${filter.dir === 1 ? 'up' : 'down'}-fill`).show()

  $('.searchbar').val(filter.search)
}

function _renderPageNav() {
  const pageAmount = getPageAmount()
  const currPage = getCurrPageIdx()
  const pageNav = $('[name=page-nav]')

  if (pageAmount <= 1) return pageNav.addClass('disabled')

  pageNav.removeClass('disabled')

  var pageNavHTML = `
        <li
          data-page-idx="${currPage - 1}"
          class="page-item page-link prev-page rounded-start">
          &laquo;
        </li>
        `

  for (var i = 1; i <= pageAmount; i++) {
    pageNavHTML += `
          <li
            data-page-idx="${i - 1}"
            class="page-item page-link">
            ${i}
          </li>
          `
  }

  pageNavHTML += `
        <li
          data-page-idx="${currPage + 1}"
          class="page-item page-link next-page rounded-end">
          &raquo;
        </li>
        `

  pageNav.find('.pagination').html(pageNavHTML)

  pageNav.find('.page-link').each(function () {
    const $el = $(this)
    const pageIdx = $el.data('page-idx')
    const isOutOfBound = pageIdx >= pageAmount || pageIdx < 0
    if (isOutOfBound) return $el.addClass('disabled')

    $el.click({ pageIdx }, onPageFilter)
  })

  pageNav.find(`[data-page-idx=${currPage}]`).addClass('active')
}
