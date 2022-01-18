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
        uint projectId; // primary key
        uint startDate;
        uint endDate;
        uint campaignStartDate;
        uint campaignDurationInDays;
        uint minAmount;
        uint maxAmount;
        uint projectBalance;
        uint projectTotalDonations;
        address npoErc20Address;
        ProjectCause cause;
        ProjectStatus status;
        string title;
        string description;
        string geographicalArea;
        uint[] donationIds;
        uint[] withdrawalIds;
    }

    struct Donation {
        uint donationId; // primary key
        uint projectId;
        uint donorId;
        uint donationDate;
        uint donationAmount;
    }

    struct Withdrawal {
        uint withdrawalId; // primary key
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
        Undefined,
        UnderCreation,
        UnderCampaign,
        InProgress,
        Cancelled,
        Closed
    }

    /// @dev Get an NPO via its erc20 address
    /// @param _npoAddresses mapping of NPO addresses to NPO Struct
    /// @param _npoErc20Address erc20 address of the NPO Struct
    /// @return returns the corresponding NPO struct
    function libGetNpo(mapping (address => NPO) storage _npoAddresses, address _npoErc20Address) external view returns(NPO memory) {
        return _npoAddresses[_npoErc20Address];
    }

    /// @dev Get an NPO via its id
    /// @param _npoAddresses mapping of NPO addresses to NPO Struct
    /// @param _npoMap mapping of NPO id to NPO Struct
    /// @param _npoId id of the NPO
    /// @return returns the corresponding NPO struct
    function libGetNpoByIndex(mapping (address => NPO) storage _npoAddresses, mapping (uint => address) storage _npoMap, uint _npoId) internal view returns(NPO memory) {
        return _npoAddresses[_npoMap[_npoId]];
    }

    /// @dev Get all NPOs
    /// @param _npoAddresses mapping of NPO addresses to NPO Struct
    /// @param _npoMap mapping of NPO id to NPO Struct
    /// @param _npoCount current index for NPO = total count of NPOs
    /// @return returns an array of all NPOs
    function libGetNpos(mapping (address => NPO) storage _npoAddresses, mapping (uint => address) storage _npoMap, uint _npoCount) external view returns(NPO [] memory) {
        uint arraySize = _npoCount;
        NPO [] memory result= new NPO[](arraySize);
        for(uint i; i < arraySize; i++) {
            result[i] = libGetNpoByIndex(_npoAddresses, _npoMap, i);
        }
        return result;
    }

    /// @dev  get a Donor via its erc20 address
    /// @param _donorAddresses mapping of Donors addresses to Donor Struct
    /// @param _donorErc20Address erc20 address of the Donor
    /// @return returns the corresponding Donor struct
    function libGetDonor(mapping (address => Donor) storage _donorAddresses, address _donorErc20Address) external view returns(Donor memory) {
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
    function libGetDonors(mapping (address => Donor) storage _donorAddresses, mapping (uint => address) storage _donorMap, uint _donorCount) external view returns(Donor [] memory) {
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
        Project memory returnedProject;
        returnedProject = _projectMap[_projectId];
        returnedProject.status = getProjectStatus(returnedProject);
        return returnedProject;
    }

    /// @dev  get all projects
    /// @param _projectMap mapping of Project id to Project Struct
    /// @param _projectCount current index for Project = total count of Projects
    /// @return returns an array of all Project
    function libGetProjects(mapping (uint => Project) storage _projectMap, uint _projectCount) external view returns(Project [] memory) {
        uint arraySize = _projectCount;
        Project [] memory result= new Project[](arraySize);
        for(uint i; i < arraySize; i++) {
            result[i] = libGetProject(_projectMap, i);
        }
        return result;
    }

    /// @dev Allows to know all the projects of an NPO
    /// @param _npoAddresses mapping of NPO addresses to NPO Struct
    /// @param _projectMap mapping of Project id to Project Struct
    /// @param _addressNpo ERC20 address of the NPO
    /// @return Returns an array of projects
    function libGetProjectsPerNpo(mapping (address => NPO) storage _npoAddresses, mapping (uint => Project) storage _projectMap, address _addressNpo) external view  returns(Project [] memory ) {
        uint arraySize = _npoAddresses[_addressNpo].projectIds.length;
        Project [] memory result = new Project[](arraySize);
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
    /// @param _donorAddress id which represents the index
    /// @return Returns an array of all donation of a single donor
    function libGetDonationPerDonor(mapping (address => Donor) storage _donorAddresses, mapping (uint => Donation) storage _donationMap, address _donorAddress) external view  returns(Donation [] memory ) {
        uint arraySize = _donorAddresses[_donorAddress].donationIds.length;
        Donation [] memory result= new Donation[](arraySize);
        for(uint i; i < arraySize; i++) {
            uint index = _donorAddresses[_donorAddress].donationIds[i];
            result[i] = libGetDonation(_donationMap, index);
        }
        return result;
    }

    /// @dev list all the donations made in the contract, whatever the Donor and the NPO
    /// @param _donationMap mapping of Donation id to Donation Struct
    /// @param _donationCount total number of donations
    /// @return Returns an array of all donation of a single donor
    function libGetDonations(mapping (uint => Donation) storage _donationMap, uint _donationCount) public view  returns(Donation [] memory ) {
        uint arraySize = _donationCount;
        Donation [] memory result = new Donation[](arraySize);
        for(uint i; i < arraySize; i++) {
            result[i] = libGetDonation(_donationMap, i);
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
    function libGetWithdrawalPerNpo(mapping (address => NPO) storage _npoAddresses, mapping (uint => Withdrawal) storage _withdrawalMap, address _addressNpo)  external view  returns(Withdrawal [] memory ) {
        uint arraySize = _npoAddresses[_addressNpo].withdrawalIds.length;
        Withdrawal [] memory result= new Withdrawal[](arraySize);
        for(uint i; i < arraySize; i++) {
            uint index = _npoAddresses[_addressNpo].withdrawalIds[i];
            result[i] = libGetWithdrawal(_withdrawalMap, index);
        }
        return result;
    }

    /// @dev get the project status
    /// @param _project Project
    /// @return _status the Project status based on Project information
    function getProjectStatus(Project memory _project) private view returns(ProjectStatus _status) {
        ProjectStatus returnedStatus;
        uint campaignEndDate = _project.campaignStartDate + _project.campaignDurationInDays * 1 days;
        // Under Creation
        if (_project.campaignStartDate > block.timestamp) {
            returnedStatus = ProjectStatus.UnderCreation;
        }
        // Under Campaign
        else if (_project.campaignStartDate <= block.timestamp && block.timestamp <= campaignEndDate) {
            returnedStatus = ProjectStatus.UnderCampaign;
        }
        // In Progress
        else if (block.timestamp > campaignEndDate && _project.projectTotalDonations >= _project.minAmount &&
                 _project.startDate <= block.timestamp && block.timestamp <= _project.endDate) {
            returnedStatus = ProjectStatus.InProgress;
        }
        // Cancelled
        else if (block.timestamp > campaignEndDate && _project.projectTotalDonations < _project.minAmount) {
            returnedStatus = ProjectStatus.Cancelled;
        }
        // Closed
        else if (block.timestamp > _project.endDate && _project.projectTotalDonations >= _project.minAmount) {
            returnedStatus = ProjectStatus.Closed;
        }
        // otherwise Undefined
        else {
            returnedStatus = ProjectStatus.Undefined;
        }
        return returnedStatus;
    }

}
