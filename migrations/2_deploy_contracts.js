var EthicToken = artifacts.require("./EthicToken.sol");
const { BN } = require('@openzeppelin/test-helpers');
module.exports = async function(deployer, _network, accounts) {
  const Jeff = accounts[1];
  const Bill = accounts[2];
  const Leonardo = accounts[3];
  const _Amount = new BN(10000000000000000000);

  deployer.deploy(EthicToken,"1000000000000",);
  const TokenEOC = await EthicToken.deployed();
  await TokenEOC.transfer(accounts[1],_Amount);
  //await TokenEOC.transfer(Bill,1000000000000);
  //await TokenEOC.transfer(Leonardo,10000000000000);

  const balance0 = await TokenEOC.balanceOf(accounts[0]);
  const balance1 = await TokenEOC.balanceOf(accounts[1]);
  const balance2 = await TokenEOC.balanceOf(accounts[2]);
  const balance3 = await TokenEOC.balanceOf(accounts[3]);
  
  console.log(Jeff);
  console.log(Bill);
  console.log(Leonardo);
  console.log(balance0.toString(),"Montant de la balance");
  console.log(balance1.toString());
};
