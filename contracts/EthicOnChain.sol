// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/// @title EthicOnChain 
/// @author Lahcen E. Dev
/// @notice EthicOnChain contract to manage NPOs, Projects and Donors
contract EthicOnChain {
    
    struct NPO {
        string denomination;
        string npoAddress;
        string object;
        string npoType;
        mapping (uint => Project) projects;
        uint nbProject;
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
        uint32 minAmount;
        uint32 maxAmount;
        uint campaignStartDate;
        uint campaignDurationInDays;
    }      

    enum ProjectCause {
        LutteContreLapauvreteEtExclusion,
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
    uint32 private nbNpo;

    
    
    event addNewNpo(address _addressNpo,string _name);
    event addNewProject(string _title, uint _startDate,uint _endDate,uint _minAmount,uint _maxAmount);

    
    /// @dev The administrator can add a new NPO
    /// @param _denomination Demonination of the NPO
    /// @param _npoAddress Postal address of the NPO
    /// @param _object object of NPO
    /// @param _npoType Type of npo organization
    /// @param _address the ERC20 address of the npo

    function addNpo(string memory _denomination,string memory _npoAddress,string memory _object,string memory _npoType,address _address) public {
        
        npoAddresses[_address].denomination=_denomination;
        npoAddresses[_address].npoAddress=_npoAddress;
        npoAddresses[_address].object=_object;
        npoAddresses[_address].npoType=_npoType;
        npoMap[nbNpo]=_address;
        nbNpo++;
        emit addNewNpo(_address,_denomination);
    }

 
    /// @dev This function will allow to add a project, the owner will be the one who calls the function. 
    /// @param _title The title of the project
    /// @param _description description of the project
    /// @param _city the city where the project will be located.
    /// @param _startDate The start date of the project
    /// @param _endDate The end of the project
    /// @param _minAmount The minimum price for the project to be valid
    /// @param _maxAmount The maximum price to make the project a success 
    /// @param _CampaignStartDate the beginning of the collection of funds
    /// @param _CampaignDurationInDays the duration of the collection of funds

    function addProject(
        string memory _title,
        string memory _description,
        string memory _city,
        uint _startDate,
        uint _endDate,
        uint32 _minAmount,
        uint32 _maxAmount,
        uint _CampaignStartDate,
        uint _CampaignDurationInDays
    ) public {
        
        npoAddresses[msg.sender].projects[npoAddresses[msg.sender].nbProject]=Project(
          ProjectCause.LutteContreLapauvreteEtExclusion,
          _title,
          _description,
          _city,
          _startDate,
          _endDate,
          _minAmount,
          _maxAmount,
          _CampaignStartDate,
          _CampaignDurationInDays
        );
        npoAddresses[msg.sender].nbProject++;
        emit addNewProject( _title,  _startDate,_endDate,_minAmount, _maxAmount);
    }
    

    /// @dev This function allows to return a project of type Project according to the ERC address of the NPO and the index.
    /// @param _id index of the project list that the address has
    /// @param _addressNpo NPO's ERC20 address
    /// @return Documents the return variables of a contract’s function state variable

    function getProject(uint _id, address _addressNpo) public view returns(Project memory) {
        return npoAddresses[_addressNpo].projects[_id];
    }

}