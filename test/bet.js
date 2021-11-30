const Bet = artifacts.require("Bet");

const helper = require('../utils/utils.js');

const SECONDS_IN_DAY = 86400;

/*
Notice that you are testing against the deployed bet with the migration file "2_deploy_bet.js".
I will paste the function here so we can know wich values this bet has:

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Bet,
    accounts[0], //player1
    accounts[1], //player2
    1, //numberOftimeUnits
    3, //timeUnits 1:minutes, 2: hours, 3:days, 4:weeks, 5: months. The dueDate will be 1 days from now 
    1000000000000000, //bettingAmount: 0.001 ETH
    1, //asset: ETH
    10000 //p1predicteValue: 10000 USD
  );
};

*/

contract("Bet", function ( accounts ) {
  describe("Initial deployment", async () =>{

    it ("should have the addresess of two players", async () => {
      const betInstace = await Bet.deployed();

      const p1Address = await betInstace.p1();
      const p2Address = await betInstace.p2();
      assert.equal(p1Address, accounts[0]);
      assert.equal(p2Address, accounts[1]);
    });

  });

  describe("Functionality", async () => {

    it ("should only allow the player 2 to enter the bet", async () => {
      const betInstance = await Bet.deployed();

      //We try the change the predicted value of player2 to 100 with an account that is not player2.
      //We shouldn't be able to do that
      try {
        await betInstance.p2UpdatePredictedValueAndDeposit(100, {from: accounts[3], value: 1000000000000000});
      }catch(err){ }

      p2predictedValue = await betInstance.p2predictedValue();
      assert.equal(0,p2predictedValue);
    })

    it ("player 2 can only enter if she deposits more than or equal to what player 1 has deposited", async () => {
      const betInstance = await Bet.deployed();

      //We try the change the predicted value of player2 to 100 while only sending 100 wei.
      //Remember player1 deposited 1000000000000000 wei
      //We shouldn't be able to do that
      
      try {
        await betInstance.p2UpdatePredictedValueAndDeposit(100, {from: accounts[1], value: 100});
      }catch(err){ }

      p2predictedValue = await betInstance.p2predictedValue();
      assert.equal(0,p2predictedValue);
    })

    it ("does not allow to determine the winner before the dueDate", async () => {

      const betInstance = await Bet.deployed();
      await betInstance.p2UpdatePredictedValueAndDeposit(100, {from: accounts[1], value: 1000000000000000});
      
      //The function calculateWinner change the state of the bet form 1 to 2 when successfully executed
      //Since the dueDate of this bet is in 1 day, calculateWinner should fail
      try{
        await betInstance.calculateWinner(400000000000,10000000000)
      }catch{ }

      betState = await betInstance.betState();
      
      assert.equal(1,betState)
      
    })

    it ("should only allow the players to check for the winner", async () => {

      const betInstance = await Bet.deployed();
      await betInstance.p2UpdatePredictedValueAndDeposit(20000, {from: accounts[1], value: 1000000000000000});
      await helper.advanceTime(SECONDS_IN_DAY * 2); //advance 2 days
      
      //Now that we have advanced in time 2 days, we can call calculateWinner.
      //However, calling it from an account different than the players shoul fail
      //Hopefullly everything makes sense. Please let me know if you have any questions :) 

      try{
        await betInstance.calculateWinner(400000000000,10000000000, {from: accounts[3]})
      }catch{ }

      betState = await betInstance.betState();
      
      assert.equal(1,betState)

    })

  });
  
  
});
