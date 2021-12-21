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
        // Mandatory fields
        require(bytes(_denomination).length > 0, unicode"La dénomination est obligatoire");
        require(bytes(_npoAddress).length > 0, "L'adresse est obligatoire");
        require(bytes(_object).length > 0, "L'objet est obligatoire");
        require(bytes(_npoType).length > 0, "Le type est obligatoire");
        require(bytes(npoAddresses[_address].denomination).length == 0, unicode"NPO déjà enregistré");
        
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
        require(bytes(npoAddresses[msg.sender].denomination).length != 0, unicode"Vous n'êtes pas enregistré en tant que NPO");
        // Mandatory fields
        require(bytes(_title).length > 0, "Le titre est obligatoire");
        require(bytes(_description).length > 0, "La description est obligatoire");
        require(bytes(_city).length > 0, "La ville est obligatoire");
        require(_startDate > 0, unicode"Date de début de projet obligatoire");
        require(_endDate > 0, "Date de fin de projet obligatoire");
        require(_minAmount > 0, "Montant minimal obligatoire");
        require(_maxAmount > 0, "Montant maximal obligatoire");
        require(_campaignStartDate > 0, unicode"Date de début de campagne obligatoire");
        require(_campaignDurationInDays > 0, unicode"Durée de campagne obligatoire");
        // Comparisons
        require(_startDate < _endDate, unicode"La date début de projet doit être avant la fin");
        require(_minAmount < _maxAmount, unicode"Le montant minimal doit être inférieur au montant maximal");

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