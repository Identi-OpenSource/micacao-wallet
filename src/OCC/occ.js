import axios from 'axios'

let bitGoUTXO = require('@bitgo/utxo-lib')
const {networks, ECPair} = require('@bitgo/utxo-lib')

export const newWallet = () => {
  // console.log('Start testing for New Wallet...')
  let wallet = bitGoUTXO.ECPair.makeRandom()
  // console.log('New Wallet', wallet)
  let wif = wallet.toWIF()
  // console.log('WIF from Wallet', wif)
  let ofc_network = networks.kmd
  let ec_pairs = ECPair.fromWIF(wif, ofc_network, true)
  // console.log('ECPairs from Wallet', ec_pairs)
  // console.log('Address from ECPairs', ec_pairs.getAddress())

  // console.log('New Wallet Address', wallet.getAddress())
  // console.log('New Wallet Public KEY', wallet.getPublicKeyBuffer())
  // console.log('New Wallet Private KEY', wallet.getPrivateKeyBuffer())
  let wallet_confirm = bitGoUTXO.ECPair.fromPrivateKeyBuffer(
    wallet.getPrivateKeyBuffer(),
  )
  // console.log('New Wallet Confirm', wallet_confirm.getAddress())
  return ec_pairs.getAddress()
}

export const fundingWallet = async wallet => {
  console.log('Start testing for Funding Wallet...')
  const url = `http://v1.funding.coingateways.com/fund.php?PROJECT=occs&RADDRESS=${wallet}`
  console.log('Funding Wallet URL', url)
  return await axios.get(url)
}

export const transaction = async wallet => {}
