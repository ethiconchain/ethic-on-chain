var EthicToken = artifacts.require("./EthicToken.sol");
var EthicOnChain = artifacts.require("./EthicOnChain.sol");

module.exports = async function(deployer, _network, accounts) {
  const ContractOwner = accounts[0];
  // les adresses 1 à 4 sont les donateurs
  const DonorJeff = accounts[1];
  const DonorBill = accounts[2];
  const DonorLeonardo = accounts[3];
  const DonorElon = accounts[4];
  // les 4 adresses suivantes sont des NPO
  const NpoFondationMusees = accounts[5];
  const NpoFondationMichelin = accounts[6];
  const NpoFondationAssistance = accounts[7];
  const NpoWfp = accounts[8];

  ////////////////////////////
  /// EthicToken et Donors ///
  ////////////////////////////
  
  await deployer.deploy(EthicToken,"1000000"); // on initialise 1 million de tokens
  
  const TokenEOC = await EthicToken.deployed();
  
  // les Tokens sont ensuite répartis sur 3 donateurs (tant que le contract ne gère pas de swap)
  await TokenEOC.transfer(DonorJeff,"100000000000000000000000"); // Cent mille à Jeff
  await TokenEOC.transfer(DonorBill,"200000000000000000000000"); // Deux cents mille à Bill
  await TokenEOC.transfer(DonorLeonardo,"300000000000000000000000"); // Trois cents mille à Leonardo
  await TokenEOC.transfer(DonorElon,"400000000000000000000000"); // Quatre cents mille à Elon

  const ContractOwnerBalance = await TokenEOC.balanceOf(ContractOwner);
  const DonorJeffBalance = await TokenEOC.balanceOf(DonorJeff);
  const DonorBillBalance = await TokenEOC.balanceOf(DonorBill);
  const DonorLeonardoBalance = await TokenEOC.balanceOf(DonorLeonardo);
  const DonorElonBalance = await TokenEOC.balanceOf(DonorElon);

  console.log("Adresse du owner du contrat", ContractOwner);
  console.log("Adresse du donateur Jeff", DonorJeff);
  console.log("Adresse du donateur Bill", DonorBill);
  console.log("Adresse du donateur Leonardo", DonorLeonardo);
  console.log("Adresse du donateur Elon", DonorElon);

  console.log("Montant de la balance du owner", ContractOwnerBalance.toString());
  console.log("Montant de la balance de Jeff", DonorJeffBalance.toString());
  console.log("Montant de la balance de Bill", DonorBillBalance.toString());
  console.log("Montant de la balance de Leonardo", DonorLeonardoBalance.toString());
  console.log("Montant de la balance de Elon", DonorElonBalance.toString());

  ////////////////////////////
  /// EthicOnChain et NPOs ///
  ////////////////////////////
  
  // l'adresse du token EOC déployé doit être transmise au contrat EthicOnChain pour les transferts (donations et withdrawals)
  await deployer.deploy(EthicOnChain, TokenEOC.address);
  
  const EthicOnChainContract = await EthicOnChain.deployed();

  await EthicOnChainContract.addNpo("La Fondation pour les Musées de France",
                                    "40 avenue Hoche 75008 Paris",
                                    "Rénovation de musée",
                                    "Musée de France",
                                    NpoFondationMusees);
  console.log("NPO 'La Fondation pour les Musées de France' créé");

  await EthicOnChainContract.addNpo("Fondation Michelin",
                                    "23 Pl. des Carmes Dechaux, 63000 Clermont-Ferrand",
                                    "Mobilité durable, sport et santé, éducation et solidarité, protection de l'environnement, culture et patrimoine",
                                    "Fondation d’entreprise",
                                    NpoFondationMichelin);
  console.log("NPO 'Fondation Michelin' créé");

                                    await EthicOnChainContract.addNpo("Fondation Assistance aux Animaux",
                                    "77410 Charmentray",
                                    "Défense des animaux maltraités et abandonnés",
                                    "Oeuvre ou organisme d’intérêt général",
                                    NpoFondationAssistance);
  console.log("NPO 'Fondation Assistance aux Animaux' créé");

                                    await EthicOnChainContract.addNpo("WFP",
                                    "Via Cesare Giulio Viola, 68, 00148 Rome RM, Italy",
                                    "Lutte contre la faim dans le monde",
                                    "Fondation internationale",
                                    NpoWfp);
  console.log("NPO 'WFP' créé");

};
