# Final project - BetsFriends
## Project description
BetsFriends is a simple betting dapp. 
The bet can only occur between two people (only two wallets or accounts).

What are you betting on? Price of ETH for now (maybe in the future sports and other stuff)
 
Lets say that you believe the price of ETH will be $15000 at the end of the year but your friend says: "you are crazy, it won´t go above $5000 if you are lucky". So after a little bit of discussion you say: "ok lets bet $100 on that" and your friend says "Aaaalright". But instead of using a "traditional" bet you will use a smart contract. 

- So, you go to the dapp front end. 
- Select the price you think the asset will go.
- Select the amount you want to bet and a date in the future.
- You will create a smart contract that will hold the funds of the bet.
- Your friend will go to the smart contract that you created and match the amount you deposited.
- When the date comes due you or your friend will have to call the smart contract, it will check the price using chainlink and will send the funds to the winner.

## Deployed version URL
You can interact with the dapp in this link:
https://wildanvin.github.io/blockchain-developer-bootcamp-final-project/

## Screencast Link
## How to run the project locally
### Prerequisites:
- npm >= 6.13.4
- node >= 12.16.1
- truffle and ganache
### Steps:
Note: This project makes use of the chainlink price feed oracle but I didn't implement one in the development network. So for simplicity I hardcoded the value of ETH at $4238.31 in the contract Bet.sol in line 112 and in the dapp.js file in line 271.
So for run the project locally you should:
- In the file Bet.sol: comment line 111 and uncomment line 112
- In the file dapp.js: comment line 270 and uncomment line 271
If you want to deploy to kovan you have to change nothing.

1. clone the repository in empty directory.
2. run in console: `npm install`
3. open a new terminal and run `ganache cli`
4. in the terminal where you cloned the project run: `truffle migrate --network development`
5. after the successfull migration you have to copy the address of the deployed BetFactory.sol contract and paste it in dapp.js file in the line 383.
6. run in console: npm run dev
7. you now should be able to interact with the BetFactory.sol contract through the front-end in localhost:3000
8. Now that you are on the front end don't forget to change the network to Localhost:8545 and add an account using the mock private keys that ganache provides. 
9. run `truffle test` in the terminal to see the tests passing (fingers crossed).


## Directory Structure

- `docs`: contains the HTML, CSS and Javascript files needed for the frontend. The front end is vanillaJS.
- `contracts`: Smart contracts that are deployed in the Kovan testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.
- `utils`: Javascript code used for advance time in ganache.

## Environment variables (not needed for running project locally)
```
KOVAN_INFURA_PROJECT_ID=
KOVAN_MNEMONIC=
```

### Address for NFT certification:
`0x4b2b0D5eE2857fF41B40e3820cDfAc8A9cA60d9f`












