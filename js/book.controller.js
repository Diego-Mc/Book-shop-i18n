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
  $('.book-add').click(onAddBook)

  // <input
  //         onkeyup="onSearch({search: this.value},this)"

  //TODO: fix open modal
  // if (queryParams.get('opened-book')) onRead(queryParams.get('opened-book'))

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
  $('.read-option').click({ bookId: books[0].id }, onRead)
  $('.modify-option').click({ bookId: books[0].id }, onUpdate)
  $('.delete-option').click({ bookId: books[0].id }, onDelete)

  document.querySelector('.container-1').innerHTML = cardViewHTML
}

function _showModalByCrudType(modalType) {
  $('.modal-body-option').hide()
  $(`[name=${modalType}-book]`).show()
}

function _setModalHeader(title) {
  $('.modal-title').text(title)
}

function _onRateChange(ev) {
  const $rate = $('.modal-footer').find('[name=book-rate]')
  const newRate = +$rate.text() + ev.data.diff

  $('.book-rate-plus').prop('disabled', newRate === 10)
  $('.book-rate-minus').prop('disabled', newRate === 0)

  $rate.text(newRate)
  $('.book-stars').html(_getStarsHTML(newRate))
  rateBook(ev.data.bookId, newRate)
  renderBooks()
}

function _getStarsHTML(rate) {
  const starFull = `<i class="bi bi-star-fill"></i>`
  const starHalf = `<i class="bi bi-star-half"></i>`
  const starEmpty = `<i class="bi bi-star"></i>`
  const starsRate = rate / 2
  const filledAmount = parseInt(starsRate)
  const halfAmount = Number.isInteger(starsRate) ? 0 : 1
  const emptyAmount = parseInt(5 - filledAmount - halfAmount)

  console.log(filledAmount, halfAmount, emptyAmount)

  return (
    starFull.repeat(filledAmount) +
    starHalf.repeat(halfAmount) +
    starEmpty.repeat(emptyAmount)
  )
}

function onRead(ev) {
  const bookId = ev.data.bookId
  const book = getBook(bookId)
  const $modal = $('[name=read-book]')

  $modal.find('.modal-body p').text(getLorem())
  $modal.find('[name=book-rate]').text(book.rate)

  $modal
    .find('.book-rate-plus')
    .off('click')
    .click({ bookId, diff: +1 }, _onRateChange)
    .prop('disabled', book.rate === 10)
  $modal
    .find('.book-rate-minus')
    .off('click')
    .click({ bookId, diff: -1 }, _onRateChange)
    .prop('disabled', book.rate === 0)

  _setModalHeader(book.name)
  _showModalByCrudType('read')

  saveToQuery({ 'opened-book': bookId })
}

function onUpdate(ev) {
  const bookId = ev.data.bookId
  const book = getBook(bookId)
  const $modal = $('[name=update-book]')

  const priceInput = $modal.find('.price-input').val('')
  const isbnInput = $modal.find('.isbn-input').val('')

  priceInput.attr('placeholder', book.price)
  $modal
    .find('.update-book-btn')
    .off('click')
    .click(() => {
      console.log(priceInput.val())
      const newPrice = +priceInput.val().trim()
      console.log(newPrice)
      const newISBN = isbnInput.val().trim()
      updateBook(bookId, newPrice, newISBN)
      renderBooks()
    })

  _setModalHeader(book.name)
  _showModalByCrudType('update')
}

function onDelete(ev) {
  const bookId = ev.data.bookId
  const book = getBook(bookId)
  const $modal = $('[name=delete-book]')

  $modal
    .find('.delete-book-btn')
    .off('click')
    .click(() => {
      deleteBook(bookId)
      renderBooks()
      _renderPageNav()
    })

  _setModalHeader(book.name)
  _showModalByCrudType('delete')
}

function onAddBook() {
  const $modal = $('[name=create-book]')

  const $titleInput = $modal.find('.title-input').val('')
  const $priceInput = $modal.find('.price-input').val('')
  const $isbnInput = $modal.find('.isbn-input').val('')

  $titleInput.keyup(() => _setModalHeader($titleInput.val() || 'New Book'))

  $modal
    .find('.add-book-btn')
    .off('click')
    .click(() => {
      const title = $titleInput.val().trim()
      const price = +$priceInput.val() || +$priceInput.attr('placeholder')
      const isbn = $isbnInput.val().trim()
      if (!title) return

      updateBook(title, price, isbn)
      renderBooks()
      _renderPageNav()
    })

  _setModalHeader('New Book')
  _showModalByCrudType('create')
}

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
