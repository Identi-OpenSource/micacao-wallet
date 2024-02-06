export const REGEX = {
  // phone: /^(\d{3})-(\d{3})-(\d{4})$/,
  phone: /^(\d{8,11})$/,
  pin: /^\d{6,}$/,
  // namePropio: /^(?:[a-zA-ZÀ-ÿ]+['-]?)+(?:\s(?:[a-zA-ZÀ-ÿ]+['-]?)+)+$/,
  namePropio: /^[a-zA-ZÀ-ÿ,-.'\s]+$/,
  dniPeruOColombia: /^\d{8}$|^\d{6,10}$/,
}

export const GENDER = {
  man: 'Hombre',
  woman: 'Mujer',
}

export const COUNTRY = {
  peru: {
    name: 'Perú',
    code: 'PE',
    phoneCode: '+51',
  },
  colombia: {
    name: 'Colombia',
    code: 'CO',
    phoneCode: '+57',
  },
}
