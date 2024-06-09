import axios from 'axios'
import {Linking} from 'react-native'
const bitGoUTXO = require('@bitgo/utxo-lib')
const {
  send_batch_transactions,
  get_all_ecpairs,
} = require('transaction-js/batch')
import CryptoJS from 'crypto-js'
import Config from 'react-native-config'
import {months} from '../config/const'

export const newWallet = () => {
  // Create
  let wallet = bitGoUTXO.ECPair.makeRandom()
  let wif = wallet.toWIF()
  let ec_pairs = bitGoUTXO.ECPair.fromWIF(wif, bitGoUTXO.networks.kmd, true)

  return {
    walletOFC: ec_pairs.getAddress(),
    wif,
  }
}

export const fundingWallet = async wallet => {
  const url = `http://v1.funding.coingateways.com/fund.php?PROJECT=occs&RADDRESS=${wallet}`
  return await axios.get(url)
}

export const verificarWallet = async wallet => {
  const url = `https://blockchain-explorer.occs.openfoodchain.org/address/${wallet}`
  console.log('Testing Wallet: ', url)
  Linking.openURL(url)
}

export const writeTransaction = async (wif, object) => {
  const {userData, parcels_array, sales} = object
  // Obtener DNI
  const utf8Key = await CryptoJS.enc.Utf8.parse(
    Config.KEY_CIFRADO_KAFE_SISTEMAS,
  )
  const encryptedHexStr = await CryptoJS.enc.Hex.parse(userData.dniAll)
  const encryptedBase64Str = await CryptoJS.enc.Base64.stringify(
    encryptedHexStr,
  )
  const decrypted = await CryptoJS.AES.decrypt(encryptedBase64Str, utf8Key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  const DNI = await decrypted.toString(CryptoJS.enc.Utf8)
  let TX = []
  let newSales = []
  for (let index = 0; index < sales.length; index++) {
    let sale = sales[index]
    if (!sale.syncUpOCC) {
      const month = months.findIndex(p => p === sale.mes)
      const purchaseDate = getFirstDayMonthPrevious(month)
      const hashDNI = await CryptoJS.SHA256(DNI + purchaseDate).toString()
      const polygon = convertAPolygonString(
        parcels_array?.find(p => p.id === sale?.parcela)?.polygon,
      )
      const farmerPlot = await CryptoJS.SHA256(polygon).toString()
      const batch = {
        bnfp: {value: hashDNI, unique: true},
        purchaseDate,
        farmerAlias: userData.name.trim().split(' ')[0],
        farmerPlot,
        DNI: hashDNI,
        variety: 'CRIOLLO',
        moistureLevel: sale.type,
        premiumPaid: '1',
        COOPMaterialNumber: '',
        COOPMaterialName: 'CACAO CRIOLLO (BABA)',
        PONumber: '',
        POPosition: '',
        plannedDeliveryDate: purchaseDate,
        shipsTo: '',
      }
      const res = bitGoUTXO.ECPair.fromWIF(wif, bitGoUTXO.networks.kmd, true)
      const ec_pairs = get_all_ecpairs(batch, res)
      const tx1 = await send_batch_transactions(ec_pairs, batch, res)
      TX = [...TX, tx1]
      sale.syncUpOCC = true
      console.log(batch)
      console.log(polygon, farmerPlot, hashDNI, sale.type)
    }
    newSales = [...newSales, sale]
  }
  return [TX, newSales]
}

const getFirstDayMonthPrevious = mes => {
  const fechaActual = new Date()
  const añoActual = fechaActual.getFullYear()
  const mesActual = fechaActual.getMonth()
  let añoObjetivo
  let mesObjetivo
  if (mesActual > mes) {
    añoObjetivo = añoActual
    mesObjetivo = mes
  } else {
    añoObjetivo = añoActual - 1
    mesObjetivo = mes
  }
  const fechaObjetivo = new Date(añoObjetivo, mesObjetivo, 1)
  const año = fechaObjetivo.getFullYear()
  const mesStr = fechaObjetivo.getMonth()
  return `01-${months[mesStr]}-${año}`
}

function convertAPolygonString(coordenadas) {
  // Mappear las coordenadas a un string con el formato requerido
  let polygonString = coordenadas
    .map(coord => `${coord[0]} ${coord[1]}`)
    .join(', ')

  // Agregar el primer punto al final para cerrar el polígono
  polygonString += `, ${coordenadas[0][0]} ${coordenadas[0][1]}`

  // Formato final del polígono
  return `POLYGON((${polygonString}))`
}

export const transaction = async wallet => {}
