# Moralis OpenSea plugin - Node JS

This is a NodeJS implementation of the Moralis [OpenSea](https://moralis.io/plugins/opensea/) plugin. </br>
Please refer to the [official documentation](https://github.com/MoralisWeb3/plugindocs/tree/main/opensea%20plugin) for more info. </br>
The `index.js` file imports all useful modules.

## Setup

- Run `npm i`
- Create a .env file in the root directory </br>
  The env file should look like this:

```js
SERVER_URL = // The Moralis server Url
APP_ID = // The Moralis app id
ETHEREUM_RPC = // The Moralis speedy node (Rinkeby or Mainnet)
PK = // The private key that will sign and send transactions (must start with 0x)
```

## Available functions: </br> </br>

### Get asset

`(_network, _tokenAddress, _tokenId)`

```js
getAsset(Network.TESTNET, '0xdbe8143c3996c87ecd639ebba5d13b84f56855c2', '0').then(console.log)
```

</br> </br>

### Get orders

`(_network, _tokenAddress, _tokenId, _orderSide, _page)`

```js
getOrders(
  Network.TESTNET,
  '0xdbe8143c3996c87ecd639ebba5d13b84f56855c2',
  '0',
  OrderSide.BUY,
  1
).then(console.log)
```

</br> </br>

### Create sell order

`( _network, _tokenAddress, _tokenId, _tokenType, _userAddress, _startAmount, _endAmount, _expirationTime)`

```js
createSellOrder(
  Network.TESTNET,
  '0xCf2389c1Ba727E82b977fc19D73d4e9A1FE8778d',
  '1',
  'ERC721',
  '0x8aD00df8561d8878EA63057657b70620089211a3',
  0.001,
  0.0005,
  1638377848
)
```

</br> </br>

## Create buy order

`(_network, _tokenAddress, _tokenId, _tokenType, _userAddress, _amount, _paymentTokenAddress )`

```js
createBuyOrder(
  Network.TESTNET,
  '0xcf2389c1ba727e82b977fc19d73d4e9a1fe8778d',
  '1',
  'ERC721',
  '0x10fC79121d0d1c013C7f89dA51C057B308D721FA',
  0.01
)
```

</br> </br>

## Fulfill order

To fulfill an order, we first need to fetch it

`(_network, _userAddress, _order)`

```js
getOrders(
  Moralis.Plugins.opensea,
  Network.TESTNET,
  '0xCf2389c1Ba727E82b977fc19D73d4e9A1FE8778d',
  '0',
  OrderSide.SELL,
  1
).then(orderToFulfill => {
  fulfillOrder(
    Network.TESTNET,
    '0x6fE029C24B8be58E5980a65B4D9EdAF143b59495',
    orderToFulfill.orders[0]
  )
})
```

</br> </br>

## Cancel order

To cancel an order, we first need to fetch it

`(_network, _userAddress, _order)`

```js
getOrders(
  Moralis.Plugins.opensea,
  Network.TESTNET,
  '0xCf2389c1Ba727E82b977fc19D73d4e9A1FE8778d',
  '0',
  OrderSide.SELL,
  1
).then(orderToCancel => {
  cancelOrder(
    Network.TESTNET,
    '0x8aD00df8561d8878EA63057657b70620089211a3',
    orderToCancel.orders[0]
  )
})
```
