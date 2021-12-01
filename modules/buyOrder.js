const env = require('./env')
const axios = require('axios')
const Web3 = require('web3')
const web3 = new Web3(env.ETHEREUM_RPC)

module.exports = async (
  _network,
  _tokenAddress,
  _tokenId,
  _tokenType,
  _userAddress,
  _amount,
  _paymentTokenAddress
) => {
  // Save temp data
  let tmp

  try {
    const { data } = await axios.post(`${env.SERVER_URL}/functions/opensea_createBuyOrder`, {
      network: _network,
      tokenAddress: _tokenAddress,
      tokenId: _tokenId,
      tokenType: _tokenType,
      userAddress: _userAddress,
      amount: _amount,
      paymentTokenAddress: _paymentTokenAddress,
    })
    const payload = data.result.data.result

    for (let i = 0; i < payload.triggers.length; i++) {
      if (payload.triggers[i].name === 'web3Transaction') {
        // Sign transaction
        payload.triggers[i].data.gas = '2100000'
        const signedTx = await web3.eth.accounts.signTransaction(payload.triggers[0].data, env.PK)
        console.log('Transaction hash:', signedTx.transactionHash)
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      }

      if (payload.triggers[i].name === 'web3Sign') {
        const signedMessage = await web3.eth.accounts.sign(payload.triggers[i].message, env.PK)
          .signature
        tmp = signedMessage
      }

      if (payload.triggers[i].name === 'callPluginEndpoint') {
        // Must apply app id to every call
        payload.triggers[i].params['_ApplicationId'] = env.APP_ID
        if (payload.triggers[i].useSavedResponse) {
          const where = payload.triggers[i].savedResponseAs
          payload.triggers[i].params[where] = tmp
          const { data } = await axios.post(
            `${env.SERVER_URL}/functions/opensea_${payload.triggers[i].endpoint}`,
            payload.triggers[i].params
          )
          if (data.result.status === 200) console.log('Buy order successfully created')
          else console.log('Could not create buy order')
        }
      }
    }
  } catch (error) {
    throw new Error(error.message || error)
  }
}
