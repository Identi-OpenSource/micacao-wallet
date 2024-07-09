import axios from 'axios'
import {Linking} from 'react-native'
const bitGoUTXO = require('@bitgo/utxo-lib')
const {
  fund_offline_wallets,
  send_batch_transactions,
  get_all_ecpairs,
} = require('transaction-js/batch')

function generateRandomString(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

function generateRandomDate() {
  const start = new Date(2000, 0, 1)
  const end = new Date()
  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  )
  const year = randomDate.getFullYear()
  const month = String(randomDate.getMonth() + 1).padStart(2, '0')
  const day = String(randomDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function createRandomJSON() {
  return {
    id: generateRandomString(36),
    anfp: String(Math.floor(Math.random() * 100000000)),
    dfp: generateRandomString(16),
    bnfp: {
      value: String(Math.floor(Math.random() * 1000000)),
      unique: true,
    },
    pds: generateRandomDate(),
    pde: generateRandomDate(),
    jds: String(Math.floor(Math.random() * 10)),
    jde: String(Math.floor(Math.random() * 10)),
    bbd: generateRandomDate(),
    pc: generateRandomString(2),
    pl: generateRandomString(8),
    rmn: String(Math.floor(Math.random() * 10000000000)),
    pon: String(Math.floor(Math.random() * 1000000)),
    pop: String(Math.floor(Math.random() * 1000)),
    mass: String(Math.random().toFixed(2)),
    raw_json: Buffer.from(
      JSON.stringify({randomKey: generateRandomString(5)}),
    ).toString('base64'),
    integrity_details: Math.random() > 0.5 ? null : generateRandomString(10),
    created_at: new Date().toISOString(),
    percentage:
      Math.random() > 0.5 ? null : String(Math.floor(Math.random() * 100)),
  }
}

const test_batch = {
  user: {
    id: {value: 1, unique: true},
    name: 'John Doe',
    email: 'johndoe@example.com',
    preferences: {
      theme: 'dark',
      notifications: {
        email: true,
        sms: false,
        push: {
          enabled: true,
          frequency: 'daily',
        },
      },
    },
    friends: [
      {
        id: 2,
        name: 'Jane Smith',
        status: 'online',
      },
      {
        id: 3,
        name: 'Bob Johnson',
        status: 'offline',
        lastOnline: '2023-03-08T12:00:00Z',
      },
    ],
  },
}

export const newWallet = () => {
  // Create
  let wallet = bitGoUTXO.ECPair.makeRandom()
  let wif = wallet.toWIF()
  let ec_pairs = bitGoUTXO.ECPair.fromWIF(wif, bitGoUTXO.networks.kmd, true)

  return {
    walletOFC: ec_pairs.getAddress(),
    wif,
  }

  //Testing for App
  // let walletOFC = "RPfu6aqhrH44rouSPJuLV3d2ZBk1Lp9nY7"

  // const privateKeyWIF = "L2aVJbLNkSjAoCnw6dSvSz6DotLJRwDrso5bv62SKPzJi7qurgiP"

  // return {
  //   walletOFC: walletOFC,
  //   wif: privateKeyWIF,
  // }
}

export const fundingWallet = async wallet => {
  const url = `http://v1.funding.coingateways.com/fund.php?PROJECT=occs&RADDRESS=${wallet}`
  return await axios.get(url)
}
// export const fundingWallet = async wallet => {
//   const url = `https://fund.occs.openfoodchain.org/found/${wallet}`
//   return await axios.get(url)
// }

// export const fundingWalletOff = async (baseAddy, baseWIF) => {
//   console.log('Start testing for Funding Wallet Offline...')
//   //name_ecpair, baseAddy, baseWIF
//   const test_batch = {
//     anfp: '11000011',
//     dfp: 'Description here Braudin',
//     pds: '2020-03-01',
//     pde: '2020-03-05',
//     jds: 2,
//     jde: 7,
//     bbd: '2020-05-05',
//     pc: 'DE',
//     pl: 'Herrath',
//     rmn: '11200100520',
//     pon: '123072',
//     pop: '164',
//     mass: 1.0,
//     percentage: null,
//   }
//   const res = bitGoUTXO.ECPair.fromWIF(baseWIF, bitGoUTXO.networks.kmd)
//   const name_ecpair = get_all_ecpairs(test_batch, res)
//   console.log('name_ecpair')
//   const resp = await fund_offline_wallets(name_ecpair, baseAddy, baseWIF)
//   console.log('Funding Wallet Offline', resp)
//   return resp
// }

export const verificarWallet = async wallet => {
  const url = `https://blockchain-explorer.occs.openfoodchain.org/address/${wallet}`
  console.log('Testing Wallet: ', url)
  Linking.openURL(url)
}

export const writeTransaction = async wif => {
  // const wifs = 'UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio'
  // const res = bitGoUTXO.ECPair.fromWIF(
  //   'UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio',
  //   bitGoUTXO.networks.kmd,
  // )
  // //console.log('res', res.getAddress())
  // const tx1 = await send_batch_transactions(ec_pairs, test_batch, res)

  const res = bitGoUTXO.ECPair.fromWIF(wif, bitGoUTXO.networks.kmd, true)

  const test_batch = createRandomJSON()

  console.log(`test batch: ${JSON.stringify(test_batch)}`)

  const ec_pairs = get_all_ecpairs(test_batch, res)

  const tx1 = await send_batch_transactions(ec_pairs, test_batch, res)
  console.log(`batchtx: ${JSON.stringify(tx1)}`)

  return tx1

  // const res = bitGoUTXO.ECPair.fromWIF(wif, bitGoUTXO.networks.kmd, true)
  // const ec_pairs = get_all_ecpairs(test_batch, res)
  // const tx1 = await send_batch_transactions(ec_pairs, test_batch, res)
  // console.log(tx1)
}

export const transaction = async wallet => {}
