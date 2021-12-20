// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
/// @title EthicToken 
/// @author Lahcen E. Dev
/// @notice Creation of an ERC20 token, name EthiOnChain and EOC
contract EthicToken is ERC20 {
    /// @dev Initialise the token amount on deployment
    /// @param _suppliedAmount This is the number of tokens created
    constructor(uint256 _suppliedAmount)  ERC20("EthicOnChain","EOC") {
        _mint(msg.sender, _suppliedAmount*10**decimals());
    }
}