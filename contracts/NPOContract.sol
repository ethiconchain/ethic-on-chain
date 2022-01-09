// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title NPO 
/// @author Lahcen E. Dev / Jérôme Gauthier
/// @notice Contract to manage NPOs (= non profit organisations)
contract NPOContract is Ownable {

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
        string memory _npoType) internal onlyOwner {
        // Mandatory fields
        require(_npoErc20Address > address(0), unicode"L'adresse du NPO doit être différente de zéro");
        require(bytes(_denomination).length > 0, unicode"La dénomination est obligatoire");
        require(bytes(_postalAddress).length > 0, "L'adresse est obligatoire");
        require(bytes(_object).length > 0, "L'objet est obligatoire");
        require(bytes(_npoType).length > 0, "Le type est obligatoire");
        require(bytes(_npoAddresses[_npoErc20Address].denomination).length == 0, unicode"NPO déjà enregistré");
        
        NPO storage newNpo = _npoAddresses[_npoErc20Address];
        newNpo.npoId = _npoCount;
        newNpo.npoErc20Address = _npoErc20Address;
        newNpo.denomination = _denomination;
        newNpo.postalAddress = _postalAddress;
        newNpo.object = _object;
        newNpo.npoType = _npoType;
        _npoMap[_npoCount] = _npoErc20Address;
        _npoCount++;
        emit NpoAdded(newNpo.npoId, _npoErc20Address, _denomination);
    }
}