// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EthicOnChainLib.sol";

/// @title EthicOnChain 
/// @author Lahcen E. Dev / Jérôme Gauthier
/// @notice EthicOnChain contract to manage NPOs, Projects and Donors
contract EthicOnChain is Ownable {
    
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
    mapping (address => EthicOnChainLib.NPO) public npoAddresses; //Mapping of all NPO 
    mapping (uint => address) private npoMap;
    uint private npoCount; 

    // Donors
    mapping (address => EthicOnChainLib.Donor) public donorAddresses; //Mapping of all donors 
    mapping (uint => address) private donorMap;
    uint private donorCount; 
    
    // Projects
    mapping (uint => EthicOnChainLib.Project) projectMap;
    uint projectCount;
    
    // Donations
    mapping (uint => EthicOnChainLib.Donation) private donationMap;
    uint private donationCount;

    // Withdrawal Informations
    mapping (uint => EthicOnChainLib.Withdrawal) private withdrawalMap;
    uint private withdrawalCount;

    // EOC Token address
    address eocTokenAddress;

    event NpoAdded(uint _poId, address _npoErc20Address, string _denomination);
    event DonorAdded(uint _donorId, address _donorErc20Address, string _donorName);
    event ProjectAdded(uint _projectId, string _title, uint _startDate, uint _endDate, uint _minAmount, uint _maxAmount);
    event DonationAdded(uint _donationId, uint _projectId, uint _donorId, uint _donationDate, uint donationAmount);
    event WithdrawalAdded(uint _amount, address _addressRecipent);
    
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
        
        EthicOnChainLib.NPO storage newNpo = npoAddresses[_npoErc20Address];
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

        EthicOnChainLib.Donor storage newDonor = donorAddresses[_donorErc20Address];
        newDonor.donorId = donorCount;
        newDonor.name = _name;
        newDonor.surName = _surName;
        newDonor.donorErc20Address=_donorErc20Address;
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
        uint _minAmount,
        uint _maxAmount
    ) public {
        EthicOnChainLib.NPO storage projectNpo = npoAddresses[msg.sender];
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

        EthicOnChainLib.Project storage newProject = projectMap[projectCount];
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
    function addDonation(uint _projectId, uint _donationAmount) public {
        EthicOnChainLib.Donor storage donationDonor = donorAddresses[msg.sender];
        require(donationDonor.donorErc20Address != address(0), unicode"Vous n'êtes pas enregistré en tant que donateur"); // concept de KYC
        EthicOnChainLib.Project storage donationProject = projectMap[_projectId];
        require(bytes(donationProject.title).length != 0, "Projet inconnu");
        // donation possible seulement si dans période de campagne
        uint campaignEndDate = donationProject.campaignStartDate + donationProject.campaignDurationInDays * 1 days;
        require(block.timestamp > donationProject.campaignStartDate, unicode"La campagne n'est pas commencée");
        require(block.timestamp < campaignEndDate, unicode"La campagne est terminée");

        EthicOnChainLib.Donation storage newDonation = donationMap[donationCount];
        newDonation.donationId = donationCount;
        newDonation.projectId = _projectId;
        newDonation.donorId = donationDonor.donorId;
        newDonation.donationDate = block.timestamp;
        newDonation.donationAmount = _donationAmount;
        
        donationDonor.donationIds.push(donationCount); // mise à jour de l'historique des donations pour le donateur
        
        donationProject.projectBalance += _donationAmount; // mise à jour de la balance du projet
        donationProject.donationIds.push(donationCount); // mise à jour de l'historique des donations pour le projet
        donationCount++;
        
        // transfert de la donation du donateur vers le contrat
        // le donateur devra avoir préalablement approuvé (fonction approve du token - un minimum = le montant à transférer)
        // le contrat à transférer les tokens de l'addresse du donateur vers l'adresse du contrat
        IERC20(eocTokenAddress).transferFrom(msg.sender, address(this), _donationAmount);
        //TODO PLUS TARD creation d'un escrow contract pour ne pas verser tous les tokens dans le même contrat général
        emit DonationAdded(newDonation.donationId, newDonation.projectId, newDonation.donorId, newDonation.donationDate, newDonation.donationAmount);
    }


//Attention, il faudra prendre en compte une maniere d'identifie le projet parmis tout les project d'un npo, 
//La j'ai fait avec une id 0 pour son premier projet, 1 pour le deuxiem etc...
    /// @dev Allows an NPO to withdraw funds from a project 
    /// @param _projectId id of the project for which the donation is done

    function withdrawTokens (uint _projectId, uint _amount,string memory _title,string memory _description) public {
        EthicOnChainLib.NPO storage withdrawalNpo = npoAddresses[msg.sender];
        uint indexProject = npoAddresses[msg.sender].projectIds[_projectId];
        require(bytes(npoAddresses[msg.sender].denomination).length != 0, unicode"Vous n'êtes pas enregistré en tant que NPO");
        require(bytes(projectMap[indexProject].title).length != 0, "Projet inconnu");
        uint256 balance = projectMap[indexProject].projectBalance;
        require(balance - _amount >= 0, "Balance insuffisante");
        // Widthdraw possible si seulement la campagne est terminée
        //uint campaignEndDate = projectMap[indexProject].campaignStartDate + projectMap[indexProject].campaignDurationInDays * 1 days;
        require(block.timestamp > projectMap[indexProject].campaignStartDate, unicode"La campagne n'est pas commencée");
        //require(block.timestamp > campaignEndDate, unicode"La campagne est toujours en cours");

        EthicOnChainLib.Withdrawal storage newWithdrawal = withdrawalMap[withdrawalCount];
        newWithdrawal.withdrawalId = donationCount;
        newWithdrawal.projectId = _projectId;
        newWithdrawal.title = _title;
        newWithdrawal.amount = _amount;
        newWithdrawal.withdrawalDate = block.timestamp;
        newWithdrawal.description = _description;
        
        withdrawalNpo.withdrawalIds.push(withdrawalCount); // mise à jour de l'historique des retraits pour le NPO
        
        projectMap[indexProject].projectBalance -= _amount; // mise à jour de la balance du projet
        projectMap[indexProject].withdrawalIds.push(withdrawalCount); // mise à jour de l'historique des retraits pour le projet
        withdrawalCount++;
        IERC20(eocTokenAddress).transfer(msg.sender,_amount);
        emit WithdrawalAdded(_amount,msg.sender);
    }

    /// @dev  get an NPO via its erc20 address
    /// @param _npoErc20Address erc20 address of the NPO
    /// @return returns the corresponding NPO struct
    function getNpo(address _npoErc20Address) public view returns(EthicOnChainLib.NPO memory) {
        return EthicOnChainLib.libGetNpo(npoAddresses, _npoErc20Address);
    }

    /// @dev  get an NPO via its id
    /// @param _npoId id of the NPO
    /// @return returns the corresponding NPO struct
    function getNpoByIndex(uint _npoId) internal view returns(EthicOnChainLib.NPO memory) {
        return EthicOnChainLib.libGetNpoByIndex(npoAddresses, npoMap, _npoId);
    }

    /// @dev  get all NPOs
    /// @return returns an array of all NPOs
    function getNpos() public view returns(EthicOnChainLib.NPO [] memory) {
        return EthicOnChainLib.libGetNpos(npoAddresses, npoMap, npoCount);
    }

    /// @dev  get a Donor via its erc20 address
    /// @param _donorErc20Address erc20 address of the Donor
    /// @return returns the corresponding Donor struct
    function getDonor(address _donorErc20Address) public view returns(EthicOnChainLib.Donor memory) {
        return EthicOnChainLib.libGetDonor(donorAddresses, _donorErc20Address);
    }

    /// @dev  get a Donor via its id
    /// @param _donorId id of the Donor
    /// @return returns the corresponding Donor struct
    function getDonorByIndex(uint _donorId) internal view returns(EthicOnChainLib.Donor memory) {
        return EthicOnChainLib.libGetDonorByIndex(donorAddresses, donorMap, _donorId);
    }

    /// @dev  get all Donors
    /// @return returns an array of all Donors
    function getDonors() public view returns(EthicOnChainLib.Donor [] memory) {
        return EthicOnChainLib.libGetDonors(donorAddresses, donorMap, donorCount);
    }

    /// @dev Returns a single Project
    /// @param _projectId project unique id
    /// @return the Project struct instance corresponding to _projectId
    function getProject(uint _projectId) public view returns(EthicOnChainLib.Project memory) {
        return EthicOnChainLib.libGetProject(projectMap, _projectId);
    }

    /// @dev  get all projects
    /// @return returns an array of all Project
    function getProjects() public view returns(EthicOnChainLib.Project [] memory) {
        return EthicOnChainLib.libGetProjects(projectMap, projectCount);
    }
    
    /// @dev Allows to know all the projects of a single NPO
    /// @param _addressNpo id which represents the index
    /// @return Returns an array of all projects of a single NPO
    function getProjectsPerNpo(address _addressNpo) public view  returns(EthicOnChainLib.Project [] memory ) {
        return EthicOnChainLib.libGetProjectsPerNpo(npoAddresses, projectMap, _addressNpo);
    }

    /// @dev  get Donation by id
    /// param _id index pour retrouver la donation a retourner
    /// @return a struct donation 
    function getDonation(uint _id) public view returns(EthicOnChainLib.Donation memory) {
        return EthicOnChainLib.libGetDonation(donationMap, _id);
    }

    /// @dev Allows to know all the donations of a single donor
    /// @param _addressNpo id which represents the index
    /// @return Returns an array of all donation of a single donor
    function getDonationPerDonor(address _addressNpo) public view  returns(EthicOnChainLib.Donation [] memory ) {
        return EthicOnChainLib.libGetDonationPerDonor(donorAddresses, donationMap, _addressNpo);
    }

    /// @dev  get Withdrawal by id
    /// param _id index pour retrouver le withdrawal a retourner
    /// @return a struct retait 
    function getWithdrawal(uint _id) public view returns(EthicOnChainLib.Withdrawal memory) {
        return EthicOnChainLib.libGetWithdrawal(withdrawalMap, _id);
    }

    /// @dev Allows to know all the donations of a single donor
    /// @param _addressNpo id which represents the index
    /// @return Returns an array of all donation of a single donor
    function getWithdrawalPerNpo(address _addressNpo) public view  returns(EthicOnChainLib.Withdrawal [] memory ) {
        return EthicOnChainLib.libGetWithdrawalPerNpo(npoAddresses, withdrawalMap, _addressNpo);
    }

}