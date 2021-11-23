BetsFriends is a simple betting dapp. 
The bet can only occur between two people (only two wallets or accounts).

What are you betting on? Price of ETH for now (maybe in the future sports and other stuff)
 
Lets say that you believe the price of ETH will be $15000 at the end of the year but your friend says: "you are crazy, it won´t go above $5000 if you are lucky". So after a little bit of discussion you say: "ok lets bet $100 on that" and your friend says "Aaaalright". But instead of using a "traditional" bet you will use a smart contract. 

- So, you go to the dapp front end. 
- Select the price you think the asset will go.
- Select the amount you want to bet and a date in the future.
- You will create a smart contract that will hold the funds of the bet.
- Your friend will go to the smart contract that you created and match the amount you are betting.
- When the date comes due you or your friend will have to call the smart contract, it will check the price using chainlink and will send the funds to the winner.

## Project Structure

- client folder: contains the HTML, CSS and Javascript files needed for the frontend. The front end is just vanillaJS.
- contracts folder: 


## Run the project locally

You will need:
- node.js and npm.
- truffle
- ganache
- LiveServer extension of VScode if you want to interact with the front end locally

Steps:
- clone the repository in empty directory.
- run npm install.
- open a new terminal and run ganache cli
- run truffle migrate --network development
- after the successfull migration you have to copy the address of the deployed BetFactory.sol contract and paste it in dapp.js file in the line :
- start the LiveServer extension in VScode
- you now should be able to interact with the BetFactory.sol contract through the front-end.

Note: In the development network there is no chainlink price feed oracle by default. So for simplicity I hardcoded the value of ETH at $6000. In the contract. If you want to deploy to the kovan testnet you shold use the other function 

 ## deploy locally

 ## deploy to kovan 



You can interact with this project in this link: 









