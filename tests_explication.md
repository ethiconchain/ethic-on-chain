## tests_explication.md 
Ce document doit expliquer les tests écrits et pourquoi vous les avez écrit.

### Principes généraux
Les tests sont écrits en javascript et basés sur les bibliothèques Mocha et Chai.
Nous avons également utilisé les [Test Helpers d'OpenZeppelin](https://docs.openzeppelin.com/test-helpers) pour utiliser
* BN pour les manipulations de big numbers.
* expectRevert pour les assertions de Revert.
* expectEvent pour tester les événements.

Pour chaque script solidity et chaque fonction nous allons retrouver
* Au moins un test positif (expect), voire plusieurs si conditions.
* Un test négatif (expectRevert) pour chaque Require.
* Un test de présence d'événement (expectEvent) si événement géré.

### Détails des scripts Solidity

#### EthicToken.sol
Le contrat EthicToken est une implémentation d'ERC20. Les tests restent donc assez simples.
* it('Has a name') : vérifie que le name du contrat créé est bien 'EthicOnChain'
* it('Has a symbol') : vérifie que le symbol du contrat créé est bien 'EOC'
* it('Has a decimal value of 18') : vérifie que le nombre de décimales est bien 18 (valeur par défaut d'ERC20.sol d'OpenZeppelin)
* it('Checking the balance') : vérifie que la balance initiale est bien équivalente au totalSupply
* it('Checking transfer') : vérifie que le owner peut effectuer un transfert vers un recipient et que leur balance respective est bien à jour.
*  it('Checking transferFrom and approve') : vérifie qu'un spender peut effectuer un transfert au nom du owner (via un approve et un transferFrom) et que les balances correspondantes (du owner et recipient) sont bien mises à jour.

#### EthicOnChain.sol
Ci-dessous les fonctions du contrat EthicOnChain et leurs tests respectifs

addNpo
* it('Add NPO') : ajoute un NPO et vérifie que les propriétés passées en paramètre sont bien stockées dans la blockchain.
* it('Require an address for an NPO - ExpectRevert') : vérifie que le paramètre _npoErc20Address ne peut pas être une adresse vide
* it('Require a name for an NPO - ExpectRevert') : passe un nom vide pour vérifier que le require bloque bien (gestion de zone obligatoire)
* it('Require a Postal Address for an NPO - ExpectRevert') : passe une adresse vide pour vérifier que le require bloque bien (gestion de zone obligatoire)
* it('Require a object for an NPO - ExpectRevert') : passe un objet vide pour vérifier que le require bloque bien (gestion de zone obligatoire)
* it('Require a npoType for an NPO - ExpectRevert') : passe un type vide pour vérifier que le require bloque bien (gestion de zone obligatoire)
* it('NPO is already registered - ExpectRevert') : vérifie qu'on ne peut pas ajouter deux fois le même NPO (même adresse _newNpoErc20Address)
* it('Event For AddNpo') : vérifie que l'événement NpoAdded est bien émis après l'ajout d'un NPO.

addDonor
* it('Add and Get Donor') : ajoute un donateur et vérifie que les propriétés passées en paramètre sont bien stockées dans la blockchain.
* it('Require an address for a Donor - ExpectRevert') : vérifie que le paramètre _donorErc20Address ne peut pas être une adresse vide
* it('Add Donor already registered') : vérifie qu'on ne peut pas ajouter deux fois le même Donor (même adresse _donorErc20Address)
* it('Event For AddDonor') : vérifie que l'événement DonorAdded est bien émis après l'ajout d'un donateur.
* TODO / à revoir = ajouter plus de tests (pas de zones obligatoire pour addNpo)

addProject
* it('Add and Get Project') : ajoute un projet et vérifie que les propriétés passées en paramètre sont bien stockées dans la blockchain.
* it('Add Project - Increase projectCount') : vérifie que la variable globale projectCount est bien incrémentée.
* it('Does not add a project if the sender is not an NPO') : vérifie que seuls les NPO peuvent ajouter des projets.
* it('Require a title for a project - ExpectRevert') : passe un titre vide pour vérifier que le require bloque bien (gestion de zone obligatoire)
* it('Require a description for a project - ExpectRevert') : passe une description vide pour vérifier que le require bloque bien (gestion de zone obligatoire)
* it('Require a startDate for a project - ExpectRevert') : passe une date de début vide pour vérifier que le require bloque bien (gestion de zone obligatoire)
* it('Require a endDate for a project - ExpectRevert') : passe une date de fin vide pour vérifier que le require bloque bien (gestion de zone obligatoire)
* it('Require a minAmount for a project - ExpectRevert') : passe un montant minimum vide pour vérifier que le require bloque bien (gestion de zone obligatoire)
* it('Require a maxAmount for a project - ExpectRevert') : passe un montant maximum vide pour vérifier que le require bloque bien (gestion de zone obligatoire)
* it('Require a campaignStartDate for a project - ExpectRevert') : passe une date de début de campagne vide pour vérifier que le require bloque bien (gestion de zone obligatoire)
* it('Require a campaignDurationDate for a project - ExpectRevert') : passe une durée de campagne vide pour vérifier que le require bloque bien (gestion de zone obligatoire)
* it('Require startDate < endDate for a project - ExpectRevert') : vérifie que la date de début est inférieure à la date de fin de projet.
* it('Require _minAmount < _maxAmount for a project - ExpectRevert') : vérifie que le montant minimum est inférieur au montant maximum du projet.
* it('Event For addProject') : vérifie que l'événement ProjectAdded est bien émis après l'ajout d'un projet.

addDonation
* it('Add and Get Donation') : ajoute un don et vérifie que les propriétés passées en paramètre sont bien stockées dans la blockchain, ainsi que les propriétés calculées (identifiants et date de don)
* it('Require a known donor - ExpectRevert') : l'adresse du donateur doit être connue = déclarée dans la liste des donateurs en amont (addDonor)
* it('Require a project for a donation (Unknown project) - ExpectRevert') : le projet pour lequel on fait le don doit être déclaré dans la blockchain (addProject)
* it('Require The campaign has not started, impossible to make a donation - ExpectRevert') : on ne peut donner que si la campagne est commencée
* it('Require The campaign is ended, impossible to make a donation - ExpectRevert') : on ne peut donner que si la campagne n'est pas terminée
* it('Event For DonationAdded') : vérifie que l'événement DonationAdded est bien émis après un don.

withdrawTokens
* it('WithdrawTokens') : effectue un retrait et vérifie que la nouvelle balance correspond bien à l'ancienne moins le montant du retrait.
* it('Check balance vs total donations') : effectue plusieurs dons suivis de plusieurs retrait pour vérifier la balance et le total des dons.
* it('WithdrawTokens - Require a known NPO - ExpectRevert') : le retrait ne peut être effectué que par un NPO déclaré dans la blockchain.
* it('WithdrawTokens- Require Revert Projet Inconnu') : le projet à partir duquel on désire effectuer le retrait doit être déclaré dans la blockchain.
* it('Add WithdrawTokens- Require Revert withdraw > Balance') : le retrait demandé doit être inférieur ou égal à la balance du projet (dons effectués moins les retraits déjà réalisés)
* it('WithdrawTokens- Require Revert campaign not started') : le retrait ne peut commencer qu'une fois la campagne terminée donc après le début de la campagne.
* it('Event For TokensWithdrawn') : vérifie que l'événement TokensWithdrawn est bien émis après un retrait.

TestStatus
* it('Status Under Creation') : Vérification du status du projet,le status doit etre Under Creation, Il est toujours en attente d'ouverture de sa campagne.
* it('Status UnderCampaign') : Vérification du status du projet,le status doit etre Under Campaign, à partir de ce status les donateurs pourront investir dans ce projet
* it('Status In Progress') :  Vérification du status du projet, le status doit être et en progression d'ouverture de sa campagne, cela signifie que le projet en attente de retrait pour être investit dans le projet.
* it('Status Cancelled') : Le projet est annulé, il n'est plus possible d'investir dans ce projet.
* it('Status Closed') : Le projet est terminé, il n'est plus possible d'investir dans ce projet.
  
getNpo
* it('Get NPO') : ajoute un NPO puis invoque getNpo pour vérifier si les données stockées dans la blockchain sont bien identiques aux paramètres passés.

getNpos
* it('Get all NPOs') : ajoute un NPO puis invoque getNpos pour vérifier que la longueur du tableau renvoyée est bien de 1.

getDonor
* it('Add and Get Donor') : ajoute un donateur et vérifie que les propriétés passées en paramètre sont bien stockées dans la blockchain.

getDonors
* it('Get all Donors') : ajoute un donateur puis invoque getDonors pour vérifier que la longueur du tableau renvoyée est bien de 1.

getProject
* it('Add and Get Project') : ajoute un projet et vérifie que les propriétés passées en paramètre sont bien stockées en utilisant la fonction getProject.

getProjects
* it('Get all Projects') : ajoute un projet puis invoque getProjects pour vérifier que la longueur du tableau renvoyée est bien de 1.

getProjectsPerNpo
* it it('get Projects per NPO') : ajoute un projet puis invoque getProjects pour l'adresse du NPO pour vérifier que la longueur du tableau renvoyée est bien de 1.

getDonation
* it('Add and Get Donation') : ajoute un don et vérifie que les propriétés passées en paramètre sont bien stockées dans la blockchain, ainsi que les propriétés calculées 

getDonationPerDonor
* it('Get Donations per Donor') : ajoute un don puis invoque getDonationPerDonor pour le donateur pour vérifier que la longueur du tableau renvoyée est bien de 1.

getDonations
* it('Get all Donations') : ajoute trois dons puis invoque getDonationd pour vérifier que la longueur du tableau renvoyée est bien de 3.

getWithdrawal
* it('get Withdrawal') : effectue un retrait de tokens pour un NPO puis vérifie que le montant stocké dans l'historique des retraits est bien égal à celui demandé lors du retrait.

getWithdrawalPerNpo
* it('get Withdrawals per NPO') : effectue un retrait de tokens pour un NPO puis invoque getWithdrawalPerNpo pour vérifier que la longueur du tableau renvoyée est bien de 1.