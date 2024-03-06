import axios from 'axios'
import {Linking} from 'react-native'
const bitGoUTXO = require('@bitgo/utxo-lib')
import {
  fund_offline_wallets,
  send_batch_transactions,
  get_all_ecpairs,
  sample_batch,
  createRandomJSON,
} from 'transaction-js'

const test_batch = {
  id: 'b6c23100-bb41-4477-b0a5-f72e8504c9fb',
  anfp: '11000011',
  dfp: 'Description here Braudin Laya ',
  bnfp: '637893',
  pds: '2020-03-01',
  pde: '2020-03-05',
  jds: 2,
  jde: 7,
  bbd: '2020-05-05',
  pc: 'DE',
  sol: 'SOOOOO PLANDO',
  pl: 'Herrath',
  rmn: '11200100520',
  pon: '123072',
  pop: '164',
  mass: 1.0,
  raw_json:
    'eyBcImFuZnBcIjogXCIxMTAwMDAxMVwiLFwiZGZwXCI6IFwiRGVzY3JpcHRpb24gaGVyZVwiLFwiYm5mcFwiOiBcIjYzNzg5M1wiLFwicGRzXCI6IFwiMjAyMC0wMy0xXCIsXCJwZGVcIjogXCIyMDIwLTAzLTVcIixcImpkc1wiOiAyLFwiamRlXCI6IDcsXCJiYmRcIjogXCIyMDIwLTA1LTVcIixcInBjXCI6IFwiREVcIixcInBsXCI6IFwiSGVycmF0aFwiLFwicm1uXCI6IFwiMTEyMDAxMDA1MjBcIixcInBvblwiOiBcIjEyMzA3MlwiLFwicG9wXCI6IFwiMTY0XCIK',
  integrity_details: null,
  created_at: '2023-09-25T08:21:45.070925Z',
  percentage: null,
}

export const newWallet = () => {
  // console.log('Start testing for New Wallet...')
  let wallet = bitGoUTXO.ECPair.makeRandom()
  // console.log('New Wallet', wallet)
  let wif = wallet.toWIF()
  // console.log('WIF from Wallet', wif)
  //console.log('OF Network', ofc_network)
  let ec_pairs = bitGoUTXO.ECPair.fromWIF(wif, bitGoUTXO.networks.kmd, true)
  let wif2 = ec_pairs.toWIF()
  // console.log('WIF2 from Wallet', wif2)
  // console.log('ECPairs from Wallet', ec_pairs)
  // console.log('Address from ECPairs', ec_pairs.getAddress())

  // console.log('New Wallet Address', wallet.getAddress())
  // console.log('New Wallet Public KEY', wallet.getPublicKeyBuffer())
  // console.log('New Wallet Private KEY', wallet.getPrivateKeyBuffer())
  // let wallet_confirm = bitGoUTXO.ECPair.fromPrivateKeyBuffer(
  //   wallet.getPrivateKeyBuffer(),
  // )
  // console.log('New Wallet Confirm', wallet_confirm.getAddress())
  return {
    walletOFC: ec_pairs.getAddress(),
    wif,
    wif2,
  }
}

export const fundingWallet = async wallet => {
  const url = `http://v1.funding.coingateways.com/fund.php?PROJECT=occs&RADDRESS=${wallet}`
  return await axios.get(url)
}

export const fundingWalletOff = async (baseAddy, baseWIF) => {
  console.log('Start testing for Funding Wallet Offline...')
  //name_ecpair, baseAddy, baseWIF
  const test_batch = {
    anfp: '11000011',
    dfp: 'Description here Braudin',
    pds: '2020-03-01',
    pde: '2020-03-05',
    jds: 2,
    jde: 7,
    bbd: '2020-05-05',
    pc: 'DE',
    pl: 'Herrath',
    rmn: '11200100520',
    pon: '123072',
    pop: '164',
    mass: 1.0,
    percentage: null,
  }
  const res = bitGoUTXO.ECPair.fromWIF(baseWIF, bitGoUTXO.networks.kmd)
  const name_ecpair = get_all_ecpairs(test_batch, res)
  console.log('name_ecpair')
  const resp = await fund_offline_wallets(name_ecpair, baseAddy, baseWIF)
  console.log('Funding Wallet Offline', resp)
  return resp
}

export const verificarWallet = async wallet => {
  console.log('Start testing for Funding Wallet...')
  const url = `https://blockchain-explorer.occs.openfoodchain.org/address/${wallet}`
  Linking.openURL(url)
}

export const writeTransaction = async wallet => {
  // const wif = 'UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio'
  const res = bitGoUTXO.ECPair.fromWIF(wallet.wif2, bitGoUTXO.networks.kmd)
  console.log('AAAAAAA')
  const ec_pairs = get_all_ecpairs(test_batch, res)
  console.log('BBBBB')
  const tx1 = await send_batch_transactions(ec_pairs, test_batch, res)
  console.log('tx1', tx1)
}

export const transaction = async wallet => {}
