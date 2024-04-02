import axios from 'axios'
import {Linking} from 'react-native'
const bitGoUTXO = require('@bitgo/utxo-lib')
const {
  fund_offline_wallets,
  send_batch_transactions,
  get_all_ecpairs,
} = require('transaction-js/batch')

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
  // console.log('res', res.getAddress())
  // const tx1 = await send_batch_transactions(ec_pairs, test_batch, res)
  const res = bitGoUTXO.ECPair.fromWIF(wif, bitGoUTXO.networks.kmd, true)
  const ec_pairs = get_all_ecpairs(test_batch, res)
  const tx1 = await send_batch_transactions(ec_pairs, test_batch, res)
  console.log(tx1)
}

export const transaction = async wallet => {}
