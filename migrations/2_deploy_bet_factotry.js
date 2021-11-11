const BetFactory = artifacts.require("BetFactory");

module.exports = async function (deployer) {
  await deployer.deploy(BetFactory);
};