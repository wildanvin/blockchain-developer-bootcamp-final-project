const Bet = artifacts.require("Bet");

const helper = require('../utils/utils.js');

const SECONDS_IN_DAY = 86400;
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
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

      try {
        await betInstance.p2UpdatePredictedValueAndDeposit(100, {from: accounts[3], value: 1000000000000000});
      }catch(err){ }

      p2predictedValue = await betInstance.p2predictedValue();
      assert.equal(0,p2predictedValue);
    })

    it ("player 2 can only enter if she deposits more than or equal to what player 1 has deposited", async () => {
      const betInstance = await Bet.deployed();

      try {
        await betInstance.p2UpdatePredictedValueAndDeposit(100, {from: accounts[1], value: 100});
      }catch(err){ }

      p2predictedValue = await betInstance.p2predictedValue();
      assert.equal(0,p2predictedValue);
    })

    it ("does not allow to determine the winner before the dueDate", async () => {

      const betInstance = await Bet.deployed();
      await betInstance.p2UpdatePredictedValueAndDeposit(100, {from: accounts[1], value: 1000000000000000});
      
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
      
      try{
        await betInstance.calculateWinner(400000000000,10000000000, {from: accounts[3]})
      }catch{ }

      betState = await betInstance.betState();
      
      assert.equal(1,betState)

    })

  });
  
  
});
