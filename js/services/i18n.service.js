const gTrans = {
  'website-title': {
    en: "Diego's Book-Shop",
    he: 'חנות הספרים של דיאגו',
    es: 'La Librería de Diego',
  },
  'grid-view': {
    en: 'Grid view',
    he: 'תצוגת כרטיסיות',
    es: 'Vista de cuadrícula',
  },
  name: {
    en: 'Name',
    he: 'שם',
    es: 'Nombre',
  },
  price: {
    en: 'Price',
    he: 'מחיר',
    es: 'Precio',
  },
  rate: {
    en: 'Rate',
    he: 'דירוג',
    es: 'Puntuación',
  },
  search: {
    en: 'Search',
    he: 'חיפוש',
    es: 'Buscar',
  },
  read: {
    en: 'Read',
    he: 'קריאה',
    es: 'Leer',
  },
  update: {
    en: 'Update',
    he: 'עדכון',
    es: 'Actualizar',
  },
  delete: {
    en: 'Delete',
    he: 'מחיקה',
    es: 'Borrar',
  },
  'book-title': {
    en: 'Book title',
    he: 'שם הספר',
    es: 'Titulo del libro',
  },
  title: {
    en: 'Title',
    he: 'שם',
    es: 'título',
  },
  id: {
    en: 'Id',
    he: 'מס"ד',
    es: 'I.D',
  },
  options: {
    en: 'Options',
    he: 'אפשרויות',
    es: 'Opciones',
  },
  'book-price': {
    en: 'Book price',
    he: 'מחיר הספר',
    es: 'Precio del libro',
  },
  'book-isbn': {
    en: 'Book ISBN',
    he: 'קוד ISBN',
    es: 'ISBN del libro',
  },
  'isbn-msg': {
    en: 'ISBN is not required. Will be used for cover image only.',
    he: 'לא חובה. הקוד משמש אך ורק לצורך הצגת תמונת הכריכה.',
    es: 'No se requiere ISBN. Se usará solo para la imagen de portada.',
  },
  close: {
    en: 'Close',
    he: 'סגירה',
    es: 'Cerrar',
  },
  'delete-msg': {
    en: 'Are you sure?',
    he: 'האם אתה בטוח?',
    es: 'Estas seguro?',
  },
  yes: {
    en: 'Yes',
    he: 'כן',
    es: 'sí',
  },
  'add-book': {
    en: 'Add Book',
    he: 'הוסף ספר',
    es: 'Añadir Libro',
  },
  'new-book': {
    en: 'New book',
    he: 'ספר חדש',
    es: 'Nuevo libro',
  },
}

var gCurrState = 'es'

const gStates = {
  il: 'he',
  us: 'en',
  es: 'es',
  gb: 'en',
}

const gCurrencies = {
  il: {
    locale: 'he-il',
    currency: 'ILS',
  },
  us: {
    locale: 'en-us',
    currency: 'USD',
  },
  es: {
    locale: 'eu-es',
    currency: 'EUR',
  },
  gb: {
    locale: 'en-gb',
    currency: 'GBP',
  },
}

function getLangByState(state) {
  return gStates[state]
}

function getStates() {
  return Object.keys(gStates)
}

function getTrans(key) {
  if (!gTrans[key]) return 'NOT_FOUND'

  const lang = getLangByState(gCurrState)

  if (!gTrans[key][lang]) return gTrans[key].en

  return gTrans[key][lang]
}

function doTrans() {
  $('[data-trans]').each(function () {
    const $el = $(this)
    const trans = getTrans($el.data('trans'))
    if ($el.is('input')) $el.attr('placeholder', trans)
    else $el.text(trans)
  })
  _doCurrency()
}

function _doCurrency() {
  $('[data-currency]')
    .attr('data-currency', gCurrState)
    .each(function () {
      const $el = $(this)
      const num = parseFloat($el.text())
      const formatted = formatCurrency(num)
      $el.text(formatted)
    })
}

function formatCurrency(num) {
  const currencyObj = getCurrencyObj()
  const options = {
    style: 'currency',
    currency: currencyObj.currency,
    maximumFractionDigits: 2,
  }

  var formatted = Intl.NumberFormat(currencyObj.locale, options).format(num)

  if (isNaN(num)) return formatted.replace(/\s*NaN\s*/g, '').trim()

  return formatted
}

function getCurrencyObj(state = gCurrState) {
  return gCurrencies[state]
}

function setLang(state) {
  gCurrState = state
  const lang = getLangByState(state)

  if (lang === 'he') {
    $('.bootstrap-rtl').attr(
      'href',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.rtl.min.css'
    )
    $('.rtl-fixes').attr('href', 'css/main-rtl.css')
    $('html').attr('dir', 'rtl')
  } else {
    $('.bootstrap-rtl').attr('href', '')
    $('.rtl-fixes').attr('href', '')
    $('html').attr('dir', 'ltr')
  }

  $('html').attr('lang', lang)
  doTrans(lang)

  const $selectedLang = $('.curr-selected-lang')
  $selectedLang
    .find('img')
    .attr('src', `images/flags/${state}.svg`)
    .attr('alt', state)
  $selectedLang.find('span').text(state)

  saveToQuery({ state })
}

function getDir() {
  if (gCurrState === 'il') return 'rtl'
  return 'ltr'
}

function setDirection($el) {
  const val = $el.text() || $el.val()

  const enMatches = val.match(new RegExp('[A-Za-z]', 'g')) || []
  const heMatches = val.match(new RegExp('[א-ת]', 'g')) || []

  if (enMatches.length === heMatches.length) {
    $el.css('direction', getDir())
  } else if (enMatches.length > heMatches.length) {
    $el.css('direction', 'ltr')
  } else {
    $el.css('direction', 'rtl')
  }
}

// lorem support

gLoremWords = {
  he: [
    'השמיים',
    'מעל',
    'הנמל',
    'היה',
    'הצבע של הטלוויזיה',
    'הופעל',
    'בשביל',
    'ערוץ מת',
    'הכל',
    'זה קרה',
    'פחות או יותר',
    'אני',
    'היה לי',
    'הסיפור',
    'לאט לאט',
    'מעל מני אנשים',
    'וגם',
    'באופן כללי',
    'קרה',
    'במקרים כאלה',
    'בכל פעם',
    'זה',
    'היה',
    'סיפור אחר',
    'זה',
    'היה',
    'תענוג',
    'בשביל',
    'להשרף',
  ],
  es: [
    'el cielo',
    'arriba',
    'el puerto',
    'estaba',
    'el color de la televisión',
    'sintonizado',
    'a',
    'un canal muerto',
    'todos',
    'esto ocurrió',
    'más o menos',
    'yo',
    'tenido',
    'la historia',
    'poco a poco',
    'de varias personas',
    'y',
    'como generalmente',
    'sucede',
    'en esos casos',
    'cada vez',
    'eso',
    'estaba',
    'una historia diferente',
    'eso',
    'estaba',
    'Un placer',
    'a',
    'quemar',
  ],
  en: [
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
}

function getLoremLang() {
  const words = gLoremWords[getLangByState(gCurrState)]
  return getLorem(words)
}
