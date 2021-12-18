## Check-list du développeur
Retrouvez ici tous les éléments à prendre en compte pour un bon développement :)

### Aide
* nous avons bien sûr les sites d'Alyra https://formation.alyra.fr et https://ecole.alyra.fr
* Un document ["Pense-bête développeur blockchain Ethereum"](https://docs.google.com/document/d/17FUzrPW_LjoH9YJoLACvE7UJj0F0vDZ4nDfwoZ7oPXw/edit#heading=h.v5jr2g4v1tgh)
* et la [doc officielle Solidity](https://docs.soliditylang.org/en/latest/)
* Pour le reste se reporter aux sites de chaque application (Truffle, Ganache...) ainsi qu'aux nombreuses chaînes YouTube disponible.

### Editeur de code
* Visual Studio Code avec les extensions Solidity de Juan Blanco (permet l'insertion automatique de la doc NatSpec en tapant les premières lettres de NatSpec - apparaît dès la première lettre "n")
* [Remix](http://remix.ethereum.org/) pourra être pratique pour valider certains aspects (compilation, lint, ethdoc)
* [StackEdit](https://stackedit.io/app#) pour éditer les fichiers *.md en mode wysiwig ("what you see is what you get")

### Style
Pour s'assurer que les smart contracts sont bien écrits, consulter le [Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
Sous Remix, installer Solhint Linter disponible depuis le plugin manager.
Rappel de quelques grandes règles de styling
* Indentation 4 espaces (éviter les tabulations)
* 2 lignes vides avant chaque déclaration de contract, 1 ligne avant chaque déclaration
* Taille maximale d'une ligne = 79 caractères ([recommendations PEP 8)](https://www.python.org/dev/peps/pep-0008/#maximum-line-length)
* Ordre de déclaration des éléments dans un smart contract (info de François) : struct, enum, variable global, event, modifier, constructeur, fallback, fonctions external/public/internal/private

### Sécurité et Optimisation
* https://docs.soliditylang.org/en/latest/security-considerations.html
* Reentrancy
* Gas limit dans les boucles for

### Test Unitaires
Nous utiliserons [Mocha](https://mochajs.org/) et [Chai](https://www.chaijs.com/)

### Documentation techique
* La documentation générée par le plugin Remix "ETHDOC - Documentation Generator" devrait suffire. A noter qu'il ne génère que la doc dev mais suffisant dans le cadre du projet final.
* Rappel : pour le format [NatSpec](https://docs.soliditylang.org/en/latest/natspec-format.html) VS Code et l'extension Solidity permettent de faciliment insérer le format NatSpec pré-rempli

### GitHub - branches et pull requests
* Une branche par tache Trello, reprenant le format SPx-99 où x = le numéro du sprint et 99 le numéro de la tache dans le sprint. Exemple : SP1-02 est la deuxième tache du sprint 1.
* Les messages de commit doivent idéalement commencer par la référence SPx-99 suivie de " - " puis d'un commentaire sur le commentaire. Exemple : "SP1-02 - création du contrat TokenEoc.sol"
* Pas de merge direct dans le master, passer obligatoirement par un pull request
* Utiliser "Start a review" pour regrouper les commentaires dans un même envoi (un seul email)
* Nous garderons en priorité les commentaires pour "Request Changes" donc utiliser cette option au moment de l'envoi.
* Quelques [Branch protection rules](https://github.com/ethiconchain/ethic-on-chain/settings/branches) sont définies sur Github pour éviter les mauvaises manipulations ("dont-merge-without-pull-request" (Require a pull request before merging) et "branch-up-to-date" (Require branches to be up to date before merging))
