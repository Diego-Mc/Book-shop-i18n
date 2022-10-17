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

var gLang = 'en' //TODO: use queryparams

function getLang() {
  return gLang
}

function getTrans(key) {
  if (!gTrans[key]) return 'NOT_FOUND'

  if (!gTrans[key][gLang]) return gTrans[key].en

  return gTrans[key][gLang]
}

function doTrans() {
  $('[data-trans]').each(function () {
    const $el = $(this)
    const trans = getTrans($el.data('trans'), gLang)
    if ($el.is('input')) $el.attr('placeholder', trans)
    else $el.text(trans)
  })
}

function changeLang(lang) {
  gLang = lang

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
}

function getDir() {
  if (gLang === 'he') return 'rtl'
  return 'ltr'
}

function setDirection($el) {
  const val = $el.text() || $el.val()

  const enMatches = val.match(new RegExp('[A-Za-z]', 'g')) || []
  const heMatches = val.match(new RegExp('[א-ת]', 'g')) || []

  console.log(val, enMatches, heMatches)

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
  const words = gLoremWords[gLang]
  return getLorem(words)
}
