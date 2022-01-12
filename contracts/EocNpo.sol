// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

/// @title EocNpo 
/// @author Lahcen E. Dev / Jérôme Gauthier
/// @notice Contract to manage NPOs (= non profit organisations)
contract EocNpo {

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

    // NPOs
    mapping (address => NPO) public npoAddresses; //Mapping of all NPO 
    mapping (uint => address) private npoMap;
    uint private npoCount; 

    /// @dev The administrator can add a new NPO
    /// @param _npoErc20Address the ERC20 address of the npo
    /// @param _denomination Demonination of the NPO
    /// @param _postalAddress Postal address of the NPO
    /// @param _object object of NPO
    /// @param _npoType Type of npo organization
    function addNpo(
        address _npoErc20Address,
        string memory _denomination,
        string memory _postalAddress,
        string memory _object,
        string memory _npoType) public returns (uint _npoId) {
        // Mandatory fields
        require(_npoErc20Address > address(0), unicode"L'adresse du NPO doit être différente de zéro");
        require(bytes(_denomination).length > 0, unicode"La dénomination est obligatoire");
        require(bytes(_postalAddress).length > 0, "L'adresse est obligatoire");
        require(bytes(_object).length > 0, "L'objet est obligatoire");
        require(bytes(_npoType).length > 0, "Le type est obligatoire");
        require(bytes(npoAddresses[_npoErc20Address].denomination).length == 0, unicode"NPO déjà enregistré");
        
        NPO storage newNpo = npoAddresses[_npoErc20Address];
        newNpo.npoId = npoCount;
        newNpo.npoErc20Address = _npoErc20Address;
        newNpo.denomination = _denomination;
        newNpo.postalAddress = _postalAddress;
        newNpo.object = _object;
        newNpo.npoType = _npoType;
        npoMap[npoCount] = _npoErc20Address;
        npoCount++;
        return newNpo.npoId;
    }

    /// @dev Adds an item in the projectIds array of the NPO
    /// @param _npoErc20Address erc20 address of the NPO Struct
    /// @param _projectId project id of the project to be added
    function addProjectIdsItem(address _npoErc20Address,uint _projectId) public {
        npoAddresses[_npoErc20Address].projectIds.push(_projectId);
    }
    /// @dev Get an NPO via its erc20 address
    /// @param _npoErc20Address erc20 address of the NPO Struct
    /// @return returns the corresponding NPO struct
    function getNpo(address _npoErc20Address) public view returns(NPO memory) {
        return npoAddresses[_npoErc20Address];
    }
    
    /// @dev Get an NPO via its id
    /// @param _npoId id of the NPO
    /// @return returns the corresponding NPO struct
    function getNpoByIndex(uint _npoId) public view returns(NPO memory) {
        return npoAddresses[npoMap[_npoId]];
    }

    /// @dev Get all NPOs
    /// @return returns an array of all NPOs
    function libGetNpos() public view returns(NPO [] memory) {
        uint arraySize = npoCount;
        NPO [] memory result= new NPO[](arraySize);
        for(uint i; i < arraySize; i++) {
            result[i] = getNpoByIndex(i);     
        }
        return result;
    }

}