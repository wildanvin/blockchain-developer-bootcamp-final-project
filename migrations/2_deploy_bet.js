const Bet = artifacts.require("Bet");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Bet,
    accounts[0],
    accounts[1],
    1, //numberOftimeUnits
    3, //timeUnits 1:minutes, 2: hours, 3:days, 4:weeks, 5: months
    1000000000000000, //bettingAmount: 0.001 ETH
    1, //asset: ETH
    10000 //p1predicteValue: 10000 USD
  );
};