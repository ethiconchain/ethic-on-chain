// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
contract EthicToken is ERC20 {

    constructor(uint256 _monSupply)  ERC20('EthicOnChain','EOC') {
        _mint(msg.sender, _monSupply*10**decimals());
    } 
 

}