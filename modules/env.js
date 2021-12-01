require('dotenv').config()

module.exports = {
  SERVER_URL: process.env.SERVER_URL,
  APP_ID: process.env.APP_ID,
  ETHEREUM_RPC: process.env.ETHEREUM_RPC,
  PK: process.env.PK,
}
