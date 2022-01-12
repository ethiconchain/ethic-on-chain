// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IEocNpo.sol";

/// @title EocDonor 
/// @author Lahcen E. Dev / Jérôme Gauthier
/// @notice Contract to manage NPOs (= non profit organisations)
contract EocProject  {
    
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

    enum ProjectCause {
        LutteContreLaPauvreteEtExclusion,
        EnvironnementEtLesAnimaux,
        Education,
        ArtEtLaCulture,
        SanteEtLaRecherche,
        DroitsDeLHomme,
        InfrastructureRoutiere
    }

    // Projects
    mapping (uint => Project) projectMap;
    uint projectCount;

    // NPO deployed contract address
    address eocNpoAddress;

    event ProjectAdded(uint _projectId, string _title, uint _startDate, uint _endDate, uint _minAmount, uint _maxAmount);

    /// @dev Initialise the deployed EOC token address for swap
    /// @param _eocNpoAddress EOC Token address
    constructor(address _eocNpoAddress) {
       eocNpoAddress = _eocNpoAddress;
    }
    
    /// @dev This function will allow to add a project, the owner will be the one who calls the function. 
    /// @param _title The title of the project
    /// @param _description description of the project
    /// @param _geographicalArea the geographical area where the project will be located.
    /// @param _startDate The start date of the project
    /// @param _endDate The end of the project
    /// @param _campaignStartDate the beginning of the collection of funds
    /// @param _campaignDurationInDays the duration of the collection of funds
    /// @param _minAmount The minimum price for the project to be valid
    /// @param _maxAmount The maximum price to make the project a success 
    function addProject (
        string memory _title,
        string memory _description,
        string memory _geographicalArea,
        uint _startDate,
        uint _endDate,
        uint _campaignStartDate,
        uint _campaignDurationInDays,
        uint _minAmount,
        uint _maxAmount
    ) public {
        // IEocNpo.NPO memory projectNpo = IEocNpo(eocNpoAddress).getNpo(msg.sender);
        // string memory invalidNpo = string(abi.encodePacked(unicode"Vous n'êtes pas enregistré en tant que NPO (eocpNoAddress : ", eocNpoAddress, " - msg.sender : ", msg.sender, ")"));
        // require(bytes(projectNpo.denomination).length != 0, invalidNpo);
        // Mandatory fields
        require(bytes(_title).length > 0, "Le titre est obligatoire");
        require(bytes(_description).length > 0, "La description est obligatoire");
        require(_startDate > 0, unicode"Date de début de projet obligatoire");
        require(_endDate > 0, "Date de fin de projet obligatoire");
        require(_minAmount > 0, "Montant minimal obligatoire");
        require(_maxAmount > 0, "Montant maximal obligatoire");
        require(_campaignStartDate > 0, unicode"Date de début de campagne obligatoire");
        require(_campaignDurationInDays > 0, unicode"Durée de campagne obligatoire");
        // Comparisons
        require(_startDate < _endDate, unicode"La date début de projet doit être avant la fin");
        require(_minAmount < _maxAmount, unicode"Le montant minimal doit être inférieur au montant maximal");

        Project storage newProject = projectMap[projectCount];
        newProject.projectId = projectCount;
        newProject.npoErc20Address = msg.sender;
        newProject.title = _title;
        // TODO = voir comment gérer le Project Cause en fonction de son enum
        newProject.description = _description;
        newProject.geographicalArea = _geographicalArea;
        newProject.startDate = _startDate;
        newProject.endDate = _endDate;
        newProject.campaignStartDate = _campaignStartDate;
        newProject.campaignDurationInDays = _campaignDurationInDays;
        newProject.minAmount = _minAmount;
        newProject.maxAmount = _maxAmount;
        IEocNpo(eocNpoAddress).addProjectIdsItem(newProject.npoErc20Address, projectCount);

        projectCount++;
        emit ProjectAdded(newProject.projectId, _title,  _startDate, _endDate, _minAmount, _maxAmount);
    } 

    /// @dev Returns a single Project
    /// @param _projectId project unique id
    /// @return the Project struct instance corresponding to _projectId
    function getProject(uint _projectId) public view returns(Project memory) {
        return projectMap[_projectId];
    }

    /// @dev  get all projects
    /// @return returns an array of all Project
    function getProjects() public view returns(Project [] memory) {
        uint arraySize = projectCount;
        Project [] memory result = new Project[](arraySize);
        for(uint i; i < arraySize; i++) {
            result[i] = projectMap[i];
        }
        return result;
    }

}