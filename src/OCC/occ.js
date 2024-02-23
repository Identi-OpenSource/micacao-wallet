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

export const newWallet = () => {
  // console.log('Start testing for New Wallet...')
  let wallet = bitGoUTXO.ECPair.makeRandom()
  // console.log('New Wallet', wallet)
  let wif = wallet.toWIF()
  console.log('WIF from Wallet', wif)
  let ofc_network = bitGoUTXO.networks.kmd
  //console.log('OF Network', ofc_network)
  let ec_pairs = bitGoUTXO.ECPair.fromWIF(wif, ofc_network, true)
  // console.log('ECPairs from Wallet', ec_pairs)
  // console.log('Address from ECPairs', ec_pairs.getAddress())

  // console.log('New Wallet Address', wallet.getAddress())
  // console.log('New Wallet Public KEY', wallet.getPublicKeyBuffer())
  // console.log('New Wallet Private KEY', wallet.getPrivateKeyBuffer())
  let wallet_confirm = bitGoUTXO.ECPair.fromPrivateKeyBuffer(
    wallet.getPrivateKeyBuffer(),
  )
  console.log('New Wallet Confirm', wallet_confirm.getAddress())
  return ec_pairs.getAddress()
}

export const fundingWallet = async wallet => {
  console.log('Start testing for Funding Wallet...')
  const url = `http://v1.funding.coingateways.com/fund.php?PROJECT=occs&RADDRESS=${wallet}`
  console.log('Funding Wallet URL', url)
  return await axios.get(url)
}

export const verificarWallet = async wallet => {
  console.log('Start testing for Funding Wallet...')
  const url = `https://blockchain-explorer.occs.openfoodchain.org/address/${wallet}`
  Linking.openURL(url)
}

export const writeTransaction = async wallet => {
  //   WIF  L3ytda49ByAPeXnnrytPXYpkDLJiocH4nut3gEfRHk8VLcqZ2ygy
  //  WALLET  RLVJ8JVQFvkuFyvvr8JzLiqkAMbjVZagt5
  // const wif = 'KyGD4iZf323AvXL9feepvyiTLTKbNFxacKsfcBggChbiQZwUrYQK'
  // // sample_batch(wif)
  // // console.log('red', bitGoUTXO.networks.kmd)
  // const res = bitGoUTXO.ECPair.fromWIF(wif, bitGoUTXO.networks.kmd)
  // const test_batch = createRandomJSON()
  // const ec_pairs = get_all_ecpairs(test_batch, res)
  // console.log('ec_pairs', ec_pairs)
  // const tx1 = await send_batch_transactions(ec_pairs, test_batch, res)

  const tx1 = sample_batch(
    'UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio',
    //'L3ytda49ByAPeXnnrytPXYpkDLJiocH4nut3gEfRHk8VLcqZ2ygy',
  )
  console.log('tx1', tx1)
}

export const transaction = async wallet => {}
