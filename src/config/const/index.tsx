export const REGEX = {
  // phone: /^(\d{3})-(\d{3})-(\d{4})$/,
  phone: /^(\d{9,10})$/,
  phone_co: /^(\d{10,10})$/,
  phone_pe: /^(\d{9,9})$/,
  pin: /^\d{6,}$/,
  // namePropio: /^(?:[a-zA-ZÀ-ÿ]+['-]?)+(?:\s(?:[a-zA-ZÀ-ÿ]+['-]?)+)+$/,
  namePropio: /^[a-zA-ZÀ-ÿ,-.'\s]+$/,
  dniPeruOColombia: /^\d{8}$|^\d{6,10}$/,
}

export const GENDER = {
  man: 'Hombre',
  woman: 'Mujer',
  id_woman: 'W',
  id_man: 'M',
}

export const COUNTRY = {
  colombia: {
    name: 'Colombia',
    code: 'CO',
    phoneCode: '+57',
    country_id: 1,
  },
  peru: {
    name: 'Perú',
    code: 'PE',
    phoneCode: '+51',
    country_id: 2,
  },
}

export const months = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
]

export const SYNC_UP_TYPES = {
  user: 'user',
  parcels: 'parcels',
  sales: 'sales',
}

export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  loadData: 'loadData',
  wallet: 'wallet',
  user: 'user',
  parcels: 'parcels',
  sales: 'sales',
  district: 'district',
  districts: 'districts',
  getGFW: 'getGFW',
  postGFW: 'postGFW',
  syncUp: 'syncUp',
  security: 'security',
}
