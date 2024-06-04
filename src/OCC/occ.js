import axios from 'axios'
import {Linking} from 'react-native'
const bitGoUTXO = require('@bitgo/utxo-lib')
const {
  send_batch_transactions,
  get_all_ecpairs,
} = require('transaction-js/batch')

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
  /*
  @Braudin
  - Se limpió el código un poco.
  - Object es el objeto que se enviará a la red de OCC
  - De momento y para fines de prueba, dejo un objeto test.
  - DNI siempre tiene que ser DNI+purchaseDate
  */
  // DNI y POLIGON en SHA256
  const hashDNI =
    'cc729b1a100e6cae30549fa78579371ec8766bba640202dca5e0ecfbd0bc5774'
  const POLIGON =
    '219be08dcfd34c5bc25134d5aa730f47eb9290c430498bafaab1452110c473a5'
  const batch = {
    bnfp: {
      value: hashDNI,
      unique: true,
    },
    purchaseDate: '02 marzo 2024', // Fecha de venta
    farmerAlias: 'El Patron', // Alias del agricultor, Primer nombre
    farmerPlot: POLIGON, // Parcela del agricultor GPS o POLIGON en SHA256
    DNI: hashDNI, // DNI del agricultor SHA256
    variety: 'Variedad 01', // variedad del cultivo
    moistureLevel: 'BABA', // nivel de humedad || Creo que baba o seco
    premiumPaid: '9999', // Prima pagada || 1= Sí, 2= No, 0= No lo sé
    COOPMaterialNumber: '0000123', // Numero GTIN del material o ''
    COOPMaterialName: 'CACAO BABA', // Nombre del producto, el que aparece en factura
    PONumber: '12345', // Número de orden de compra (PO)
    POPosition: '909090', // Posición de la orden de compra (PO)
    plannedDeliveryDate: '01 marzo 2024', // Fecha de entrega (PO)
    shipsTo: 'IDENTI', // Empresa que compra el producto (PO)
  }
  const res = bitGoUTXO.ECPair.fromWIF(wif, bitGoUTXO.networks.kmd, true)
  // const test_batch = object
  const ec_pairs = get_all_ecpairs(batch, res)
  const tx1 = await send_batch_transactions(ec_pairs, batch, res)
  return tx1
}

export const transaction = async wallet => {}
