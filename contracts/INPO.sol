// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
 
/// @title INPO 
/// @author Lahcen E. Dev / Jérôme Gauthier
/// @notice Interface to manage NPOs (= non profit organisations)
interface INPO {
    
    struct NPO {
        uint npoId;
        address npoErc20Address;
        string denomination;
        string postalAddress;
        string object;
        string npoType;
        uint[] projectIds;
        uint[] withdrawalIds;
    }

    event NpoAdded(uint _poId, address _npoErc20Address, string _denomination);

    /// @dev The administrator can add a new NPO
    /// @param _npoAddresses mapping to store all NPO addresses
    /// @param _npoMap map for NPO to map their index with their address
    /// @param _npoCount current index of the stored NPOs
    /// @param _npoErc20Address the ERC20 address of the npo
    /// @param _denomination Demonination of the NPO
    /// @param _postalAddress Postal address of the NPO
    /// @param _object object of NPO
    /// @param _npoType Type of npo organization
    function addNpo(
        mapping (address => NPO) calldata _npoAddresses,
        mapping (uint => address) calldata _npoMap,
        uint _npoCount,
        address _npoErc20Address,
        string memory _denomination,
        string memory _postalAddress,
        string memory _object,
        string memory _npoType) external;
}