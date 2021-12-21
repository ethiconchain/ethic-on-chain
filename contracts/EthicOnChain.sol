// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title EthicOnChain 
/// @author Lahcen E. Dev
/// @notice EthicOnChain contract to manage NPOs, Projects and Donors
contract EthicOnChain is Ownable {
    
    struct NPO {
        string denomination;
        string npoAddress;
        string object;
        string npoType;
        mapping (uint => Project) projects;
        uint projectCount;
    }

    struct Donor {
        string name;
        string surName;
        string addressDonor;
    }

    struct Project {
        ProjectCause cause;
        string title;
        string description;
        string city;
        uint startDate;
        uint endDate;
        uint campaignStartDate;
        uint campaignDurationInDays;
        uint32 minAmount;
        uint32 maxAmount;
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

    mapping (address => NPO) public npoAddresses; //Mapping of all NPO 
    mapping (uint => address) private npoMap;
    uint32 private npoCount; 
    
    event NpoAdded(address _addressNpo, string _name);
    event ProjectAdded(string _title, uint _startDate, uint _endDate, uint _minAmount, uint _maxAmount);
    
    /// @dev The administrator can add a new NPO
    /// @param _denomination Demonination of the NPO
    /// @param _npoAddress Postal address of the NPO
    /// @param _object object of NPO
    /// @param _npoType Type of npo organization
    /// @param _address the ERC20 address of the npo
    function addNpo(
        string memory _denomination,
        string memory _npoAddress,
        string memory _object,
        string memory _npoType,
        address _address) public onlyOwner {
        //Verification that the data has been entered correctly
        require (bytes(_denomination).length >=3,"more than 3 characters-denomination");
        require (bytes(_npoAddress).length >=8,"more than 8 characters-npoAddress");
        require (bytes(_object).length >=10,"more than 10 characters-object");
        require (bytes(_npoType).length >=5,"more than 5 characters-npoType");
        require (bytes(npoAddresses[_address].denomination).length ==0,"The address is already registered");
        
        npoAddresses[_address].denomination = _denomination;
        npoAddresses[_address].npoAddress = _npoAddress;
        npoAddresses[_address].object = _object;
        npoAddresses[_address].npoType = _npoType;
        npoMap[npoCount] = _address;
        npoCount++;
        emit NpoAdded(_address, _denomination);
    }
 
    /// @dev This function will allow to add a project, the owner will be the one who calls the function. 
    /// @param _title The title of the project
    /// @param _description description of the project
    /// @param _city the city where the project will be located.
    /// @param _startDate The start date of the project
    /// @param _endDate The end of the project
    /// @param _campaignStartDate the beginning of the collection of funds
    /// @param _campaignDurationInDays the duration of the collection of funds
    /// @param _minAmount The minimum price for the project to be valid
    /// @param _maxAmount The maximum price to make the project a success 
    function addProject(
        string memory _title,
        string memory _description,
        string memory _city,
        uint _startDate,
        uint _endDate,
        uint _campaignStartDate,
        uint _campaignDurationInDays,
        uint32 _minAmount,
        uint32 _maxAmount
    ) public {
        require (bytes(npoAddresses[msg.sender].denomination).length !=0,"The address is not registered");
        //Verification that the data has been entered correctly
        require (bytes(_title).length >=3,"more than 3 characters-title");
        require (bytes(_description).length >=10,"more than 10 characters-description");
        require (bytes(_city).length >=3,"more than 3 characters-city");
        //Verification that the data concerning dates and prices have been entered correctly
        require (_startDate >=1,"Must be greater than 1-StartDate");
        require (_endDate >=1,"Must be greater than 1-EndDate");
        require ( _minAmount >=1,"Must be greater than 1-minAmount");
        require ( _maxAmount >=1,"Must be greater than 1-maxAmount");
        require (_campaignStartDate >=1,"Must be greater than 1-CampaignStartDate");
        require (_campaignDurationInDays >=1,"Must be greater than 1-CampaignDurationInDays");
        //Verification that the start is before 
        require (_startDate < _endDate,"Error the start date must begin before ");
        require (_minAmount < _maxAmount,"The minimum price must be lower than the maximum");
        require (_campaignStartDate < _campaignDurationInDays,"The campaign must start before the end of the year");

        npoAddresses[msg.sender].projects[npoAddresses[msg.sender].projectCount] = Project(
            ProjectCause.LutteContreLaPauvreteEtExclusion,
            _title,
            _description,
            _city,
            _startDate,
            _endDate,
            _campaignStartDate,
            _campaignDurationInDays,
            _minAmount,
            _maxAmount
        );
        npoAddresses[msg.sender].projectCount++;
        emit ProjectAdded(_title,  _startDate, _endDate, _minAmount, _maxAmount);
    } 

    /// @dev This function allows to return a project of type Project according to the ERC address of the NPO and the index.
    /// @param _id index of the project list that the address has
    /// @param _addressNpo NPO's ERC20 address
    /// @return Documents the return variables of a contract’s function state variable
    function getProject(uint _id, address _addressNpo) public view returns(Project memory) {
        return npoAddresses[_addressNpo].projects[_id];
    }

}