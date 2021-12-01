const axios = require('axios')
const env = require('./env')

module.exports = async (_network, _tokenAddress, _tokenId, _orderSide, _page) => {
  try {
    const { data } = await axios.post(`${env.SERVER_URL}/functions/opensea_getOrders`, {
      network: _network,
      tokenAddress: _tokenAddress,
      tokenId: _tokenId,
      orderSide: _orderSide,
      page: _page,
    })
    return data.result.data.result
  } catch (error) {
    throw new Error(error.message || error)
  }
}
