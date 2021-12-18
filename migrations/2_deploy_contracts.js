var EthicToken = artifacts.require("./EthicToken.sol");

module.exports = function(deployer) {
  deployer.deploy(EthicToken,"10000000");
};
