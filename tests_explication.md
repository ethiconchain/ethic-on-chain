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

#### EthicOnChainLib.sol
