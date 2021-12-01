const env = require('./env')
const axios = require('axios')
const Web3 = require('web3')

const web3 = new Web3(env.ETHEREUM_RPC)

const cancelOrder = async (_network, _userAddress, _order) => {
  try {
    if (!_order || _order.length === 0) throw new Error('No orders to cancel')
    const { data } = await axios.post(`${env.SERVER_URL}/functions/opensea_cancelOrder`, {
      network: _network,
      userAddress: _userAddress,
      order: _order,
    })
    const payload = data.result.data.result

    for (let i = 0; i < payload.triggers.length; i++) {
      if (payload.triggers[i].name === 'web3Transaction') {
        // Sign transaction
        payload.triggers[0].data.gas = '2100000'
        const signedTx = await web3.eth.accounts.signTransaction(payload.triggers[0].data, env.PK)
        console.log('Transaction hash:', signedTx.transactionHash)
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      }
    }
  } catch (error) {
    throw new Error(error.message || error)
  }
}

module.exports = cancelOrder
