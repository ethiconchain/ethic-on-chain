// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
 
/// @title IEocDonor 
/// @author Lahcen E. Dev / Jérôme Gauthier
/// @notice Interface to manage Donors
interface IEocDonor {
    
    struct Donor {
        uint donorId;
        address donorErc20Address;
        string name;
        string surName;
        string postalAddress;
        uint[] donationIds;
    }

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
        string memory _postalAddress) external;

    /// @dev  get a Donor via its erc20 address
    /// @param _donorErc20Address erc20 address of the Donor
    /// @return returns the corresponding Donor struct
    function getDonor(address _donorErc20Address) external view returns(Donor memory);

    /// @dev  get a Donor via its id
    /// @param _donorId id of the Donor
    /// @return returns the corresponding Donor struct
    function getDonorByIndex(uint _donorId) external view returns(Donor memory);

    /// @dev  get all Donors
    /// @return returns an array of all Donors
    function getDonors() external view returns(Donor [] memory);

}