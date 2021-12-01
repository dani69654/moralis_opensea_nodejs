const env = require('./env')
const axios = require('axios')
const Web3 = require('web3')
const web3 = new Web3(env.ETHEREUM_RPC)

const createSellOrder = async (
  _network,
  _tokenAddress,
  _tokenId,
  _tokenType,
  _userAddress,
  _startAmount,
  _endAmount,
  _expirationTime
) => {
  // Save temp data
  let tmp

  try {
    const { data } = await axios.post(`${env.SERVER_URL}/functions/opensea_createSellOrder`, {
      network: _network,
      tokenAddress: _tokenAddress,
      tokenId: _tokenId,
      tokenType: _tokenType,
      userAddress: _userAddress,
      startAmount: _startAmount,
      endAmount: _endAmount,
      expirationTime: _expirationTime,
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
      if (payload.triggers[i].name === 'callPluginEndpoint') {
        // Must apply app id to every call
        payload.triggers[i].params['_ApplicationId'] = env.APP_ID

        // If the endpoint name is `approveForAll`
        if (payload.triggers[i].endpoint === 'approveForAll') {
          const { data } = await axios.post(
            `${env.SERVER_URL}/functions/opensea_${payload.triggers[i].endpoint}`,
            payload.triggers[i].params
          )
          const result = data.result.data.result
          if (result.triggers[0].name === 'web3Transaction') {
            // Sign transaction
            result.triggers[0].data.gas = '2100000'
            const signedTx = await web3.eth.accounts.signTransaction(
              result.triggers[0].data,
              env.PK
            )
            console.log('Transaction hash:', signedTx.transactionHash)
            await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
          }
        }

        // Is the endpoint name is `signSellOrder`
        if (payload.triggers[i].endpoint === 'signSellOrder') {
          const { data } = await axios.post(
            `${env.SERVER_URL}/functions/opensea_${payload.triggers[i].endpoint}`,
            payload.triggers[i].params
          )
          const result = data.result.data.result
          for (let i = 0; i < result.triggers.length; i++) {
            if (result.triggers[i].name === 'web3Sign') {
              const signedMessage = await web3.eth.accounts.sign(result.triggers[i].message, env.PK)
                .signature
              tmp = signedMessage
            }
            if (result.triggers[i].name === 'callPluginEndpoint') {
              if (result.triggers[i].useSavedResponse) {
                const where = result.triggers[i].savedResponseAs
                result.triggers[i].params[where] = tmp
                const { data } = await axios.post(
                  `${env.SERVER_URL}/functions/opensea_${result.triggers[i].endpoint}`,
                  result.triggers[i].params
                )
                if (data.result.status === 200) console.log('Sell order successfully created')
                else console.log('Could not create sell order')
              }
            }
          }
        }
      }
    }
  } catch (error) {
    throw new Error(error.message || error)
  }
}

module.exports = createSellOrder
