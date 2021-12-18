## Check-list du développeur
Retrouvez ici tous les éléments à prendre en compte pour un bon développement :)

### Aide
* nous avons bien sûr les sites d'Alyra https://formation.alyra.fr et https://ecole.alyra.fr
* Un document ["Pense-bête développeur blockchain Ethereum"](https://docs.google.com/document/d/17FUzrPW_LjoH9YJoLACvE7UJj0F0vDZ4nDfwoZ7oPXw/edit#heading=h.v5jr2g4v1tgh)
* et la [doc officielle Solidity](https://docs.soliditylang.org/en/latest/)
* Pour le reste se reporter aux sites de chaque application (Truffle, Ganache...) ainsi qu'aux nombreuses chaînes YouTube disponible.

### Style
Pour s'assurer que les smart contracts sont bien écrits, consulter le [Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
Sous Remix, installer Solhint Linter disponible depuis le plugin manager.
Rappel de quelques grandes règles de styling
* Indentation 4 espaces (éviter les tabulations)
* 2 lignes vides avant chaque déclaration de contract, 1 ligne avant chaque déclaration
* Taille maximale d'une ligne = 79 caractères ([recommendations PEP 8)](https://www.python.org/dev/peps/pep-0008/#maximum-line-length)
* Ordre de déclaration des éléments dans un smart contract (info de François) : struct, enum, variable global, event, modifier, constructeur, fallback, fonctions external/public/internal/private

### Sécurité et Optimisation
https://docs.soliditylang.org/en/latest/security-considerations.html

### Test Unitaires
Nous utiliserons Mocha et Chai

### Documentation techique
* La documentation générée par 

### GitHub - branches et pull requests
