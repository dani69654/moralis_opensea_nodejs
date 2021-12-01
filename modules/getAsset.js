const axios = require('axios')
const env = require('./env')

module.exports = async (_network, _tokenAddress, _tokenId) => {
  try {
    const { data } = await axios.post(`${env.SERVER_URL}/functions/opensea_getAsset`, {
      network: _network,
      tokenAddress: _tokenAddress,
      tokenId: _tokenId,
    })
    return data.result.data.result
  } catch (error) {
    throw new Error(error.message || error)
  }
}
