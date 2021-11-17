const Bet = artifacts.require("Bet");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Bet,
    accounts[0],
    accounts[1],
    5, // 5
    5, // months
    10000000,
    1,
    10000500,
    100000000);
};