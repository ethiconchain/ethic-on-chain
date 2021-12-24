// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title EthicOnChain 
/// @author Lahcen E. Dev
/// @notice EthicOnChain contract to manage NPOs, Projects and Donors
contract EthicOnChain is Ownable {
    
    struct NPO {
        uint npoId;
        address npoErc20Address;
        string denomination;
        string postalAddress;
        string object;
        string npoType;
        uint[] projectIds;
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
        address npoErc20Address;
        ProjectCause cause;
        string title;
        string description;
        string geographicalArea;
        uint32 minAmount;
        uint32 maxAmount;
        uint32 projectBalance;
        uint[] donationIds;
    } 

    struct Donation {
        uint donationId; // clé primaire
        uint projectId;
        uint donationDate;
        uint32 donationAmount;
        address donorAddress;
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

    // NPOs
    mapping (address => NPO) public npoAddresses; //Mapping of all NPO 
    mapping (uint => address) private npoMap;
    uint private npoCount; 

    // Donors
    mapping (address => Donor) public donorAddresses; //Mapping of all donors 
    mapping (uint => address) private donorMap;
    uint private donorCount; 
    
    // Projects
    mapping (uint => Project) projectMap;
    uint projectCount;
    
    // Donations
    mapping (uint => Donation) private donationMap;
    uint private donationCount;

    // EOC Token address
    address eocTokenAddress;

    event NpoAdded(uint npoId, address _npoErc20Address, string _denomination);
    event DonorAdded(uint donorId, address _donorErc20Address, string _donorName);
    event ProjectAdded(uint _projectId, string _title, uint _startDate, uint _endDate, uint _minAmount, uint _maxAmount);
    event DonationAdded(uint donationId);
    
    /// @dev Initialise the deployed EOC token address for swap
    /// @param _eocTokenAddress EOC Token address
    constructor(address _eocTokenAddress) {
       eocTokenAddress =  _eocTokenAddress;
    }

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
        string memory _npoType) public onlyOwner {
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
        emit NpoAdded(newNpo.npoId, _npoErc20Address, _denomination);
    }
 
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
        newDonor.postalAddress = _postalAddress;
        donorMap[donorCount] = _donorErc20Address;
        donorCount++;
        emit DonorAdded(newDonor.donorId, _donorErc20Address, _name);
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
    function addProject(
        string memory _title,
        string memory _description,
        string memory _geographicalArea,
        uint _startDate,
        uint _endDate,
        uint _campaignStartDate,
        uint _campaignDurationInDays,
        uint32 _minAmount,
        uint32 _maxAmount
    ) public {
        NPO storage projectNpo = npoAddresses[msg.sender];
        require(bytes(projectNpo.denomination).length != 0, unicode"Vous n'êtes pas enregistré en tant que NPO");
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
        projectNpo.projectIds.push(projectCount);

        projectCount++;
        emit ProjectAdded(newProject.projectId, _title,  _startDate, _endDate, _minAmount, _maxAmount);
    } 

    /// @dev Add a Donation struct in global donationMap
    /// @param _projectId id of the project for which the donation is done
    /// @param _donationAmount amount of the donation in EOC tokens
    function addDonation(uint _projectId, uint32 _donationAmount) public {
        //TODO = prévoir un map des donors et vérifier que msg.sender présent parmi les donateurs ? (KYC)
        Project storage donationProject = projectMap[_projectId];
        require(bytes(donationProject.title).length != 0, "Projet inconnu");

        Donation storage newDonation = donationMap[donationCount];
        newDonation.donationId = donationCount;
        newDonation.projectId = _projectId;
        newDonation.donationDate = block.timestamp;
        newDonation.donationAmount = _donationAmount;
        newDonation.donorAddress = msg.sender;
        
        //TODO = update Donor.donation.push quand on aura défini un donorMap // mise à jour de l'historique des donations pour le donateur
        
        donationProject.projectBalance += _donationAmount; // mise à jour de la balance du projet
        donationProject.donationIds.push(donationCount); // mise à jour de l'historique des donations pour le projet
        donationCount++;
        
        // transfer amount from Donor to the Contract
        // Donor will have first approved (minimum = amount) the contract to transfer tokens from its address
        IERC20(eocTokenAddress).transferFrom(msg.sender, address(this), _donationAmount);
        //TODO PLUS TARD creation d'un escrow contract pour ne pas verser tous les tokens dans le même contrat général
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
        Project [] memory result= new Project[](arraySize);
        for(uint i; i < arraySize; i++){
            result[i]=projectMap[i];     
        }
        return result;
    }

    /// @dev  get all NPOs
    /// @return returns an array of all NPOs
    function getNpos() public view returns(NPO [] memory) {
        uint arraySize = npoCount;
        NPO [] memory result= new NPO[](arraySize);
        for(uint i; i < arraySize; i++){
            result[i]=npoAddresses[npoMap[i]];     
        }
        return result;
    }
    /// @dev Allows to know all the projects of a single NPO
    /// @param _addressNpo id which represents the index
    /// @return Returns an array of all projects of a single NPO
    function getProjectsPerNpo(address _addressNpo) public view  returns(Project [] memory ) {
        uint arraySize = npoAddresses[_addressNpo].projectIds.length;
        Project [] memory result= new Project[](arraySize);
        for(uint i; i < arraySize; i++){
            uint index =npoAddresses[_addressNpo].projectIds[i];
            result[i]=getProject(index);     
        }
        return result;
    }
}