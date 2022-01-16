## Optimisation du code SOLIDITY
Les points suivants d'optimisation sont issues de la [documentation Alyra](https://ecole.alyra.fr/mod/page/view.php?id=899)
TODO: tester également l'utilisation d'un outil comme [Slither ](https://github.com/crytic/slither)
TODO: tester également l'utilisation d'un outil comme [Solhint ](https://github.com/protofire/solhint)

* -Regroupement des variables 

* -Initialisation des variables 
  
* -Messages d’erreurs (Utilisation de code d’erreur) 
  
* -Préférable d’utilise un mapping plutôt qu’un tableau
  
* -Essayer de fixer la taille des variables et des tableaux pour avoir une meilleure optimisation possible
  
* -Suppression de variable, Ethereum donne un remboursement de gas lorsque vous supprimez des variables. (Avec le mot clé delete)
  
* -Stockage de données dans les événements (Les données qui n'ont pas besoin d'être accessibles sur la Blockchain peuvent être stockées dans les événements pour économiser du gas.)
