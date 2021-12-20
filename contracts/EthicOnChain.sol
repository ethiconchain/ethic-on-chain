// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract EthicOnChain {
    
    struct NPO{
        string name;
        string denomination;
        string npoAdress;
        string object;
        string npoType;
        mapping (uint => Project) Projects;
    }

    struct Donor{
        string name;
        string surName;
        string addressDonor;
    }

    struct Project{
        address ownerNpo;
        ProjectCause cause;
        string title;
        string description;
        string city;
        uint startDate;
        uint endDate;
        uint32 minAmount;
        uint32 maxAmount;
        uint CampaignStartDate;
        uint CampaignDurationInDays;
    }   
   

    enum ProjectCause{
        LutteContreLapauvreteEtExclusion,
        EnvironnementEtLesAnimaux,
        Education,
        ArtEtLaCulture,
        SanteEtLaRecherche,
        DroitsDeLHomme,
        InfrastructureRoutiere
    }


    enum ProjectStatus{
        ProjectProposal, 
        WaitingOpening,
        OpenFundRaising,
        CloseFundRaising
    }


    mapping (address => NPO) public AddressNpo; //Mapping of all NPO 
    mapping ( uint => address) private NpoMap;
    uint32 NbNpo;

    Project [] public ProjectProposal;
    
    event addNewNpo(address _addressNpo,string _name,string _domination);
    event addNewProject(string _name, uint _startDate,uint _endDate,uint _min,uint _max);

/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
/// @param _name name of Npo
/// @param _denomination a parameter just like in doxygen (must be followed by parameter name)
/// @param _npoAddress addres
/// @param _object a parameter just like in doxygen (must be followed by parameter name)
/// @param _npoType a parameter just like in doxygen (must be followed by parameter name)
/// @param _address a parameter just like in doxygen (must be followed by parameter name)


    function addNpo(string memory _name,string memory _denomination,string memory _npoAddress,string memory _object,string memory _npoType,address _address) public {
        AddressNpo[_address].name=_name;
        AddressNpo[_address].denomination=_denomination;
        AddressNpo[_address].npoAdress=_npoAddress;
        AddressNpo[_address].object=_object;
        AddressNpo[_address].npoType=_npoType;
        NpoMap[NbNpo]=_address;
        NbNpo++;
    }



}