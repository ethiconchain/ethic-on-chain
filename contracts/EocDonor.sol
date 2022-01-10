// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title EocDonor 
/// @author Lahcen E. Dev / Jérôme Gauthier
/// @notice Contract to manage NPOs (= non profit organisations)
contract EocDonor is Ownable {
    
    struct Donor {
        uint donorId;
        address donorErc20Address;
        string name;
        string surName;
        string postalAddress;
        uint[] donationIds;
    }

    // Donors
    mapping (address => Donor) public donorAddresses; //Mapping of all donors 
    mapping (uint => address) private donorMap;
    uint private donorCount; 
    
    event DonorAdded(uint _donorId, address _donorErc20Address, string _donorName);

    /// @dev The administrator/contract can add a new Donor
    /// @param _donorErc20Address ERC20 address of the donor
    /// @param _name Name of the Donor
    /// @param _surName Surname of the Donor
    /// @param _postalAddress postal address of the donor
    function addDonor(
        address _donorErc20Address,
        string memory _name,
        string memory _surName,
        string memory _postalAddress) public onlyOwner {
        // Mandatory fields
        require(_donorErc20Address > address(0), unicode"L'adresse du donateur doit être différente de zéro");
        require(donorAddresses[_donorErc20Address].donorErc20Address == address(0), unicode"Donor déjà enregistré");

        Donor storage newDonor = donorAddresses[_donorErc20Address];
        newDonor.donorId = donorCount;
        newDonor.name = _name;
        newDonor.surName = _surName;
        newDonor.donorErc20Address=_donorErc20Address;
        newDonor.postalAddress = _postalAddress;
        donorMap[donorCount] = _donorErc20Address;
        donorCount++;
        emit DonorAdded(newDonor.donorId, _donorErc20Address, _name);
    }

    /// @dev  get a Donor via its erc20 address
    /// @param _donorErc20Address erc20 address of the Donor
    /// @return returns the corresponding Donor struct
    function getDonor(address _donorErc20Address) public view returns(Donor memory) {
        return donorAddresses[_donorErc20Address];
    }

    /// @dev  get a Donor via its id
    /// @param _donorId id of the Donor
    /// @return returns the corresponding Donor struct
    function getDonorByIndex(uint _donorId) internal view returns(Donor memory) {
        return donorAddresses[donorMap[_donorId]];
    }

    /// @dev  get all Donors
    /// @return returns an array of all Donors
    function getDonors() public view returns(Donor [] memory) {
        uint arraySize = donorCount;
        Donor [] memory result = new Donor[](arraySize);
        for(uint i; i < arraySize; i++) {
            result[i] = donorAddresses[donorMap[i]];
        }
        return result;
    }

}