import Config from 'react-native-config'
import axios from 'axios'
const bitGoUTXO = require('@bitgo/utxo-lib')
const {
  send_batch_transactions,
  get_all_ecpairs,
} = require('transaction-js/batch')
import CryptoJS from 'crypto-js'
import {STORAGE_KEYS} from '../config/const'
import {storage} from '../config/store/db'

const KEYS_WALLET = [
  'purchaseDate',
  'farmerAlias',
  'farmerPlot',
  'DNI',
  'variety',
  'moistureLevel',
  'premiumPaid',
  'COOPMaterialNumber',
  'COOPMaterialName',
  'PONumber',
  'POPosition',
  'plannedDeliveryDate',
  'shipsTo',
]

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
  console.log('wallet', wallet)
  const url = `${Config?.WALLET_FUND}/fund/${wallet}`
  // console.log('url', url)
  return await axios.get(url).catch(error => {
    console.log('error fundingWallet => ', error)
    return error
  })
}

export const dniText = async dni => {
  const utf8Key = CryptoJS.enc.Utf8.parse(
    Config?.KEY_CIFRADO_KAFE_SISTEMAS || '',
  )
  const encryptedHexStr = CryptoJS.enc.Hex.parse(dni)
  const encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypted = CryptoJS.AES.decrypt(encryptedBase64Str, utf8Key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding, // Sin relleno
  })
  const decryptedUtf8 = CryptoJS.enc.Utf8.stringify(decrypted)
  return decryptedUtf8.replace(/\0+$/, '')
}

// @braudin refactorizando la funcion
export const dniEncrypt = async dni => {
  const paddedDNI = dni.padStart(16, '0')
  const utf8Key = CryptoJS.enc.Utf8.parse(
    Config?.KEY_CIFRADO_KAFE_SISTEMAS || '',
  )
  const utf8DNI = CryptoJS.enc.Utf8.parse(paddedDNI)
  const encrypted = CryptoJS.AES.encrypt(utf8DNI, utf8Key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding, // Sin relleno
  })
  const hexResult = encrypted.ciphertext.toString(CryptoJS.enc.Hex)
  return {dni: hexResult, dniAll: hexResult.length}
}

export const writeTransaction = async ({wallet, dataWrite, user, parcels}) => {
  const DNI = await dniText(user?.dni)
  const writeOK = []
  const indexDelete = []
  for (let index = 0; index < dataWrite.length; index++) {
    let sale = dataWrite[index]?.data
    const purchaseDate = sale?.mes
    const hashDNI = await CryptoJS.SHA256(DNI + purchaseDate)?.toString()
    const parcel = parcels?.find(p => p?.id === sale?.parcela)
    const polygon = convertAPolygonString(parcel?.polygon)
    const farmerPlot = await CryptoJS.SHA256(polygon)?.toString()
    const batch = {
      bnfp: {value: hashDNI, unique: true},
      purchaseDate,
      farmerAlias: user?.name?.trim()?.split(' ')[0],
      farmerPlot,
      DNI: hashDNI,
      variety: `CACAO (${sale?.type})`,
      moistureLevel: `TYPO (${sale?.type})`,
      premiumPaid: '1',
      COOPMaterialNumber: '',
      COOPMaterialName: `CACAO (${sale?.type})`,
      PONumber: '',
      POPosition: '',
      plannedDeliveryDate: purchaseDate,
      shipsTo: '',
    }
    const res = bitGoUTXO.ECPair.fromWIF(
      wallet?.wallet?.wif,
      bitGoUTXO?.networks?.kmd,
      true,
    )
    const ec_pairs = get_all_ecpairs(batch, res)
    const tx1 = await send_batch_transactions(ec_pairs, batch, res)
    const isSend = countMatches(KEYS_WALLET, tx1)
    if (isSend) {
      writeOK.push(true)
      indexDelete.push(index)
    } else {
      writeOK.push(false)
    }
  }
  // filtra los elementos que no se han enviado
  const newDataWrite = dataWrite?.filter((element, index) => {
    if (!indexDelete?.includes(index)) {
      return element
    }
  })
  storage.set(STORAGE_KEYS.writeBlockchain, JSON.stringify(newDataWrite))
  return writeOK
}

const countMatches = (constantArr, dynamicArr) => {
  // Filtra los elementos de constantArray que están presentes en dynamicArray
  const matches = constantArr.filter(item => dynamicArr.includes(item))
  // Retorna true si hay al menos 3 coincidencias, de lo contrario false
  return matches.length <= 4
}

function convertAPolygonString(coordenadas) {
  // Mappear las coordenadas a un string con el formato requerido
  let polygonString = coordenadas
    ?.map(coord => `${coord[0]} ${coord[1]}`)
    ?.join(', ')

  // Agregar el primer punto al final para cerrar el polígono
  polygonString += `, ${coordenadas[0][0]} ${coordenadas[0][1]}`

  // Formato final del polígono
  return `POLYGON((${polygonString}))`
}

export const generateUniqueID = () => {
  const randomValue = Math.random().toString()
  const hash = CryptoJS.MD5(randomValue).toString()
  return hash
}

export const transaction = async wallet => {}
