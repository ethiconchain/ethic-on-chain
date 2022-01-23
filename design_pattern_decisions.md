## Solidity Patterns Decisions - design_pattern_decisions.md

Ce document liste tous les Patterns Solidity issus de https://fravoll.github.io/solidity-patterns et pour chacun indique
- si nous avons l'intention de l'utiliser
- quelques informations expliquant notre choix
- Si utilisé, exemple de class.function où le pattern peut être trouvé.

### Behavioral Patterns

#### Guard Check

- Utilisation : OUI
- L'utilisation des require() semble évidente pour tout développeur Solidity avec un minimum de connaissance Solidity voire une expérience similaire avec tout autre langage.
- Exemple d'utilisation : [EthicOnChain.sol](contracts/EthicOnChain.sol), fonction addNpo.

#### State Machine

- Utilisation : OUI
- Nous avons besoin de réagir différemment suivant le statut du projet.
- Exemple d'utilisation : [EthicOnChain.sol](contracts/EthicOnChain.sol), les fonctions addDonation et withdrawTokens dépendent d'informations du projet donc de son statut. 

#### Oracle

- Utilisation : PEUT-ETRE
- Si nous avons besoin - et le temps - d'utiliser un Oracle tel que Chainlink pour des conversions si nous acceptons les dons en crypto-monnaies. Nous pourrions également avoir besoin d'un trigger pour calculer régulièrement le statut d'un projet (Chainlink Keeper)
- Exemple d'utilisation : ...

#### Randomness

- Utilisation : NON
- Nous n'avons pas trouvé dans nos use cases de besoin d'utilisation d'un nombre aléatoire.

### Security Patterns

- Utilisation : OUI
- Nous avons besoin de gérer un concept de droit d'accès par utilisateur (RBAC - Role-Based Access Control), suivant les rôles (NPO, Donateur)
- Exemple d'utilisation : [EthicOnChain.sol](contracts/EthicOnChain.sol), fonction addProject : la fonction ne peut être appelée/utilisée que si l'appelant (msg.sender) est listé dans les NPO.

#### Access Restriction

#### Checks Effects Interactions

- Utilisation : OUI
- Dès qu'une fonction offre une possibilité de transfert de tokens, nous devons nous assurer qu'il n'y a pas de risque de réentrance (re-entrancy exploit risk).
- Exemple d'utilisation : [EthicOnChain.sol](contracts/EthicOnChain.sol), fonctions addDonation et withdrawTokens: les appels à IERC20(eocTokenAddress).transfer et trasnferFrom sont faits en dernier.

#### Secure Ether Transfer

- Utilisation : OUI
- nous devons réfléchir à la meilleure méthode / la plus appropriée en cas de transfert de tokens (parmi les méthodes send, transfer et call.value)
- Exemple d'utilisation : [EthicOnChain.sol](contracts/EthicOnChain.sol), les fonctions addDonation et withdrawTokens utilisent les appels à IERC20(eocTokenAddress).transfer et transferFrom. L'utilisation de Slither nous a permis de détecter que nous avions oublié de tester le retour de ces fonctions pour n'émettre un événement que si le transfert s'est corectement effectué.

#### Pull over Push

- Utilisation : NON
- Dans notre modèle métier, il ne semble pas évident/facile de pouvoir demander aux intervenants de "réclamer" leur Tokens. Peut-être que dans le cas de la libération des tokens pour un projet cela peut-être utilisé.

#### Emergency Stop

- Utilisation : PEUT-ETRE
- Si nous avons le temps, il semble toujours préférable d'avoir une otpion qui permet de temporairement bloquer toute sortie/transfert de tokens en cas de découverte de bug avec risque de sécurité.
- Exemple d'utilisation : ...

### Upgradeability Patterns

#### Proxy Delegate

- Utilisation : NON, pas dans la v1.0
- Comme mentionné, l'utilisation de delegatecall est "more complex than most of the other patterns presented in this document".

#### Eternal Storage

- Utilisation : PEUT-ETRE si nous avons le temps
- Un tel pattern est vraiment très utile car il donne un moyen relativement simple de ne pas perdre les données stockées en cas de modifications fonctionnelles (si la structure / le stockage des données reste le même et que seules les fonctionnalités / méthodes évoluent)

### Economic Patterns

#### String Equality Comparison

- Utilisation : PEUT-ETRE
- Dès qu'il y a besoin de comparer des chaines de caractères, cela vaut le coup de l'utiliser (simple copié/collé de l'exemple indiqué).

#### Tight Variable Packing

- Utilisation : OUI
- Les smart contrats solidity comportent des emplacements contigus de 32 octets (256 bits) utilisés pour le stockage. Lorsque nous arrangeons les variables de manière à ce que plusieurs d'entre elles tiennent dans un seul emplacement, on parle de “variable packing”. Attention, on parle de type précis, par exemple un uint128 n'est pas de même type qu'un uint256.
- Exemple d'utilisation : [EthicOnChain.sol](contracts/EthicOnChain.sol), struct Project, les variables minAmount et maxAmount (de type uint32) étaient initialement placées avant les variables campaignStartDate et campaignEndDate (de type uint), elles ont été placées après car pas du même type.

#### Memory Array Building

- Utilisation : PEUT-ETRE si nous avons le temps
- Nous vérifierons si de telles méthodes existent et appliquerons le pattern.
