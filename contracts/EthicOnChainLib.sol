// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
 
/// @title EthicOnChainLib 
/// @author Lahcen E. Dev / Jérôme Gauthier
/// @notice EthicOnChain library to manage struct and getters
library EthicOnChainLib {
    
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

    struct Donor {
        uint donorId;
        address donorErc20Address;
        string name;
        string surName;
        string postalAddress;
        uint[] donationIds;
    }

    struct Project {
        uint projectId; // clé primaire
        uint startDate;
        uint endDate;
        uint campaignStartDate;
        uint campaignDurationInDays;
        uint minAmount;
        uint maxAmount;
        uint projectBalance;
        address npoErc20Address;
        ProjectCause cause;
        string title;
        string description;
        string geographicalArea;
        uint[] donationIds;
        uint[] withdrawalIds;
    } 

    struct Donation {
        uint donationId; // clé primaire
        uint projectId;
        uint donorId;
        uint donationDate;
        uint donationAmount;
    }     

    struct Withdrawal {
        uint withdrawalId;
        uint projectId;
        uint amount;
        uint withdrawalDate;
        string title;
        string description;
    }

    enum ProjectCause {
        LutteContreLaPauvreteEtExclusion,
        EnvironnementEtLesAnimaux,
        Education,
        ArtEtLaCulture,
        SanteEtLaRecherche,
        DroitsDeLHomme,
        InfrastructureRoutiere
    }

    enum ProjectStatus {
        ProjectProposal, 
        WaitingOpening,
        OpenFundRaising,
        CloseFundRaising
    }

    /// @dev  get a Donor via its erc20 address
    /// @param _donorAddresses mapping of Donors addresses to Donor Struct
    /// @param _donorErc20Address erc20 address of the Donor
    /// @return returns the corresponding Donor struct
    function libGetDonor(mapping (address => Donor) storage _donorAddresses, address _donorErc20Address) public view returns(Donor memory) {
        return _donorAddresses[_donorErc20Address];
    }

    /// @dev  get a Donor via its id
    /// @param _donorAddresses mapping of Donors addresses to Donor Struct
    /// @param _donorMap mapping of Donor id to Donor Struct
    /// @param _donorId id of the Donor
    /// @return returns the corresponding Donor struct
    function libGetDonorByIndex(mapping (address => Donor) storage _donorAddresses, mapping (uint => address) storage _donorMap, uint _donorId) internal view returns(Donor memory) {
        return _donorAddresses[_donorMap[_donorId]];
    }

    /// @dev  get all Donors
    /// @param _donorAddresses mapping of Donors addresses to Donor Struct
    /// @param _donorMap mapping of Donor id to Donor Struct
    /// @param _donorCount current index for Donor = total count of Donors
    /// @return returns an array of all Donors
    function libGetDonors(mapping (address => Donor) storage _donorAddresses, mapping (uint => address) storage _donorMap, uint _donorCount) public view returns(Donor [] memory) {
        uint arraySize = _donorCount;
        Donor [] memory result = new Donor[](arraySize);
        for(uint i; i < arraySize; i++) {
            result[i] = libGetDonorByIndex(_donorAddresses, _donorMap, i);
        }
        return result;
    }

    /// @dev Returns a single Project
    /// @param _projectMap mapping of Project id to Project Struct
    /// @param _projectId project unique id
    /// @return the Project struct instance corresponding to _projectId
    function libGetProject(mapping (uint => Project) storage _projectMap, uint _projectId) public view returns(Project memory) {
        return _projectMap[_projectId];
    }

    /// @dev  get all projects
    /// @param _projectMap mapping of Project id to Project Struct
    /// @param _projectCount current index for Project = total count of Projects
    /// @return returns an array of all Project
    function libGetProjects(mapping (uint => Project) storage _projectMap, uint _projectCount) public view returns(Project [] memory) {
        uint arraySize = _projectCount;
        Project [] memory result= new Project[](arraySize);
        for(uint i; i < arraySize; i++) {
            result[i] = _projectMap[i];     
        }
        return result;
    }
    
    /// @dev Allows to know all the projects of a single NPO
    /// @param _npoAddresses mapping of NPO addresses to NPO Struct
    /// @param _projectMap mapping of Project id to Project Struct
    /// @param _addressNpo id which represents the index
    /// @return Returns an array of all projects of a single NPO
    function libGetProjectsPerNpo(mapping (address => NPO) storage _npoAddresses, mapping (uint => Project) storage _projectMap, address _addressNpo) public view  returns(Project [] memory ) {
        uint arraySize = _npoAddresses[_addressNpo].projectIds.length;
        Project [] memory result= new Project[](arraySize);
        for(uint i; i < arraySize; i++) {
            uint index = _npoAddresses[_addressNpo].projectIds[i];
            result[i] = libGetProject(_projectMap, index);     
        }
        return result;
    }

    /// @dev  get Donation by id
    /// @param _donationMap mapping of Donation id to Donation Struct
    /// @param _id index pour retrouver la donation a retourner
    /// @return a struct donation 
    function libGetDonation(mapping (uint => Donation) storage _donationMap, uint _id) public view returns(Donation memory) {
        return _donationMap[_id];
    }

    /// @dev Allows to know all the donations of a single donor
    /// @param _donorAddresses mapping of Donors addresses to Donor Struct
    /// @param _donationMap mapping of Donation id to Donation Struct
    /// @param _addressNpo id which represents the index
    /// @return Returns an array of all donation of a single donor
    function libGetDonationPerDonor(mapping (address => Donor) storage _donorAddresses, mapping (uint => Donation) storage _donationMap, address _addressNpo) public view  returns(Donation [] memory ) {
        uint arraySize = _donorAddresses[_addressNpo].donationIds.length;
        Donation [] memory result= new Donation[](arraySize);
        for(uint i; i < arraySize; i++) {
            uint index = _donorAddresses[_addressNpo].donationIds[i];
            result[i] = libGetDonation(_donationMap, index);     
        }
        return result;
    }

    /// @dev  get Withdrawal by id
    /// @param _withdrawalMap mapping of Withdrawal id to Withdrawal Struct
    /// @param _id index pour retrouver le withdrawal a retourner
    /// @return a struct retait 
    function libGetWithdrawal(mapping (uint => Withdrawal) storage _withdrawalMap, uint _id) public view returns(Withdrawal memory) {
        return _withdrawalMap[_id];
    }

    /// @dev Allows to know all the donations of a single donor
    /// @param _npoAddresses mapping of NPO addresses to NPO Struct
    /// @param _withdrawalMap mapping of Withdrawal id to Withdrawal Struct
    /// @param _addressNpo id which represents the index
    /// @return Returns an array of all donation of a single donor
    function libGetWithdrawalPerNpo(mapping (address => NPO) storage _npoAddresses, mapping (uint => Withdrawal) storage _withdrawalMap, address _addressNpo) public view  returns(Withdrawal [] memory ) {
        uint arraySize = _npoAddresses[_addressNpo].withdrawalIds.length;
        Withdrawal [] memory result= new Withdrawal[](arraySize);
        for(uint i; i < arraySize; i++) {
            uint index = _npoAddresses[_addressNpo].withdrawalIds[i];
            result[i] = libGetWithdrawal(_withdrawalMap, index);     
        }
        return result;
    }


    function libGetTime () public view returns(uint){
        return block.timestamp;
    }

}