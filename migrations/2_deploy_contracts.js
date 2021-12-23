var EthicToken = artifacts.require("./EthicToken.sol");
var EthicOnChain = artifacts.require("./EthicOnChain.sol");

module.exports = async function (deployer, _network, accounts) {
  const owner = accounts[0];
  const Jeff = accounts[1];
  const Bill = accounts[2];
  const Leonardo = accounts[3];
  const Elon = accounts[4];


  await deployer.deploy(EthicOnChain);
  await deployer.deploy(EthicToken, "10000000");

  const TokenEOC = await EthicToken.deployed();
  await TokenEOC.transfer(Jeff, "100000000000000000000000");
  await TokenEOC.transfer(Bill, "200000000000000000000000");
  await TokenEOC.transfer(Leonardo, "300000000000000000000000");
  await TokenEOC.transfer(Elon, "400000000000000000000000");

  const balance0 = await TokenEOC.balanceOf(owner);
  const balance1 = await TokenEOC.balanceOf(Jeff);
  const balance2 = await TokenEOC.balanceOf(Bill);
  const balance3 = await TokenEOC.balanceOf(Leonardo);
  const balance4 = await TokenEOC.balanceOf(Elon);

  console.log(owner);
  console.log(Jeff);
  console.log(Bill);
  console.log(Leonardo);
  console.log(Elon);

  console.log(balance0.toString(), "Montant de la balance du owner");
  console.log(balance1.toString(), "Montant de la balance de Jeff");
  console.log(balance2.toString(), "Montant de la balance de Bill");
  console.log(balance3.toString(), "Montant de la balance de Leonardo");
  console.log(balance4.toString(), "Montant de la balance de Elon");

};
