const gTrans = {
  'website-title': {
    en: "Diego's Book-Shop",
    he: 'הספריה של דיאגו',
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
    $('html').attr('dir', 'ltr')
  }

  $('html').attr('lang', lang)
  doTrans(lang)
}
