# Design patterns used

## Factory Design Pattern

- `BetFactory.sol` is a smart contract that creates others smart contracts. In this case it creates instances of the `Bet.sol` contract with different state that depends of the user.

## Oracles with Inheritance and Interfaces

- `Bet.sol` contract inherits the Chainlink `PriceConsumerV3.sol` contract so each bet can access the price of ETH when the conditions are met.