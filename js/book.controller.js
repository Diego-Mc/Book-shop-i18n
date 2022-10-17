'use strict'

$(onInit)

var gView
const VIEW_STORAGE_KEY = 'favlayout'

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

  const state = queryParams.get('state') || 'us'
  setLang(state)

  $('#name-filter').click({ by: 'name' }, onFilter)
  $('#price-filter').click({ by: 'price' }, onFilter)
  $('#rate-filter').click({ by: 'rate' }, onFilter)
  $('.searchbar').keyup(onSearch)
  $('.book-add').click(onAddBook)

  _renderLangPicker()
  _updateFilters()
  _renderPageNav()
  renderBooks()

  const openedBookId = queryParams.get('opened-book')
  if (openedBookId) {
    $(`[data-id=${openedBookId}]`).find('.read-option').trigger('click')
  }

  //Observe class change in body to know if user closed the modal
  const modalObserver = new MutationObserver(() => {
    if ($('body').hasClass('modal-open')) return
    saveToQuery({ 'opened-book': '' })
  })
  modalObserver.observe($('body').get()[0], { attributes: true })
}

function _renderLangPicker() {
  const state = getStates()
  const langOptionsHTMLs = state.map(
    (state) => `<li class="dropdown-item lang-item lang-${state}">
                <img src="images/flags/${state}.svg" alt="${state}" />
                <span class="text-uppercase">${state}</span>
               </li>`
  )

  $('.lang-menu').html(langOptionsHTMLs)

  state.forEach((state) => {
    $(`.lang-${state}`).click(() => setLang(state))
  })
}

function renderBooks() {
  $('.book-view-type').addClass('d-none')

  if (gView === 'cards') _renderCards()
  else _renderTable()

  $(`.book-${gView}`).removeClass('d-none')
  _setBooksOptionsListener()
  $('.card-title').each(_$setDir)
}

function onSetView(ev) {
  gView = ev.data.view
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

function _renderCards() {
  const books = getBooks()

  const bookCardHTMLs = books.map((book) => _renderCard(book.id))
  $('.book-cards').html(bookCardHTMLs)
}

function _setBooksOptionsListener() {
  _setBookOptionsListener('read', onRead)
  _setBookOptionsListener('update', onUpdate)
  _setBookOptionsListener('delete', onDelete)
}

function _setBookOptionsListener(crudStr, cb) {
  $(`.${crudStr}-option`).each(function () {
    $(this)
      .off('click')
      .click({ bookId: $(this).closest('.book-element').data('id') }, cb)
  })
}

function _renderCard(bookId) {
  const cardHTML = `
  <div data-id="${bookId}" class="book-card book-element position-relative p-0">
    ${_getBookOptionsHTML()}
    ${_getBookCardHTML(bookId)}
  </div>`

  return cardHTML
}

function _renderTable() {
  const books = getBooks()
  const rowsHTMLs = books.map((book) => _renderRow(book.id))
  $('.book-rows').html(rowsHTMLs)
}

function _renderRow(bookId) {
  const book = getBook(bookId)
  const rowHTML = `
              <tr data-id="${bookId}" class="book-element">
                <th scope="row">${book.name}</th>
                <td>${book.price}</td>
                <td>${book.rate}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-outline-primary read-option custom-sm-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                  >
                    <i class="bi bi-book"></i>
                    <span data-trans="read" class="ms-1">
                      ${getTrans('read')}
                    </span>
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-outline-secondary update-option custom-sm-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                  >
                    <i class="bi bi-pencil-square"></i>
                    <span data-trans="update" class="ms-1">
                      ${getTrans('update')}
                    </span>
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-outline-danger delete-option custom-sm-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                  >
                    <i class="bi bi-trash3"></i>
                    <span data-trans="delete" class="ms-1">
                      ${getTrans('delete')}
                    </span>
                  </button>
                </td>
              </tr>`
  return rowHTML
}

function _getBookOptionsHTML() {
  return `
              <!-- Dropdown options -->
              <div class="dropdown position-absolute end-0" style="z-index: 10">
                <button
                  class="btn dropdown-toggle btn-lg text-light border-0 mt-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu book-options-menu" style="min-width: fit-content">
                  <li>
                    <button
                      class="dropdown-item read-option"
                      data-bs-toggle="modal"
                      data-bs-target="#modal"
                      type="button"
                    >
                      <i class="bi bi-book"></i>
                      <span data-trans="read" class="ms-1">
                        ${getTrans('read')}
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      class="dropdown-item update-option"
                      data-bs-toggle="modal"
                      data-bs-target="#modal"
                      type="button"
                    >
                      <i class="bi bi-pencil-square"></i>
                      <span data-trans="update" class="ms-1">
                        ${getTrans('update')}
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      class="dropdown-item delete-option"
                      data-bs-toggle="modal"
                      data-bs-target="#modal"
                      type="button"
                    >
                      <i class="bi bi-trash3"></i>
                      <span data-trans="delete" class="ms-1">
                        ${getTrans('delete')}
                      </span>
                    </button>
                  </li>
                </ul>
              </div>`
}

function _getBookCardHTML(bookId) {
  const book = getBook(bookId)
  return `
              <!-- Card -->
              <div class="card h-100">
                <img
                  src="${book.imgUrl || 'images/book-cover.jpg'}"
                  style="height: 280px"
                  class="card-img-top"
                  alt="${book.name}"
                />
                <div
                  class="card-body d-flex flex-column justify-content-between gap-2"
                >
                  <h5 class="card-title d-inline-block text-nowrap w-100">
                    ${book.name}
                  </h5>
                  <div
                    class="fw-light text-muted d-flex w-100 justify-content-between"
                  >
                    <span class="book-price fw-normal lh-1">
                    ${book.price}
                    <span>$</span>
                    </span>
                    <p class="d-flex gap-1 lh-1 book-stars">
                      ${_getStarsHTML(book.rate)}
                    </p>
                  </div>
                </div>
              </div>`
}

function _showModalByCrudType(modalType) {
  $('.modal-body-option').hide()
  $(`[name=${modalType}-book]`).show()

  $('input[type=text]').each(_$setDir).keyup(_$setDir)
}

function _$setDir() {
  // sets the direction of inputs based on value entered
  setDirection($(this))
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

  $modal.find('.modal-body p').text(getLoremLang())
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
  const defaultHeader = getTrans('book-title', getCurrLang())

  $titleInput
    .off('keyup')
    .keyup(() => _setModalHeader($titleInput.val() || defaultHeader))

  $modal
    .find('.add-book-btn')
    .off('click')
    .click(() => {
      const title = $titleInput.val().trim()
      const price = +$priceInput.val() || +$priceInput.attr('placeholder')
      const isbn = $isbnInput.val().trim()
      if (!title) return

      createBook(title, price, isbn)
      renderBooks()
      _renderPageNav()
    })

  _setModalHeader(defaultHeader)
  _showModalByCrudType('create')
}

function _updateFilters() {
  const filter = getFilter()

  $('#view-btn')
    .prop('checked', gView === 'cards')
    .off('change')
    .change({ view: gView === 'cards' ? 'table' : 'cards' }, onSetView)

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
