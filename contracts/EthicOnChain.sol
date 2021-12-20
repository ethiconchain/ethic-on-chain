// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/// @title EthicOnChain 
/// @author Lahcen E. Dev
/// @notice EthicOnChain contract to manage NPOs, Projects and Donors
contract EthicOnChain {
    
    struct NPO {
        string name;
        string denomination;
        string npoAdress;
        string object;
        string npoType;
        mapping (uint => Project) projects;
    }

    struct Donor {
        string name;
        string surName;
        string addressDonor;
    }

    struct Project {
        address ownerNpo;
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
    mapping ( uint => address) private npoMap;
    uint32 private npoCount;

    Project [] public projectProposal;
    
    event NpoAdded(address _addressNpo, string _name, string _domination);
    event ProjectAdded(string _name, uint _startDate, uint _endDate, uint _min, uint _max);

    /// @dev Add an NPO
    /// @param _name name of Npo
    /// @param _denomination name of the NPO
    /// @param _npoAddress geographical address of the NPO
    /// @param _object object/purpose of the NPO
    /// @param _npoType type of the NPO
    /// @param _address the wallet address of the NPO
    function addNpo(string memory _name, string memory _denomination, string memory _npoAddress,
                    string memory _object, string memory _npoType, address _address) public {
        npoAddresses[_address].name = _name;
        npoAddresses[_address].denomination = _denomination;
        npoAddresses[_address].npoAdress = _npoAddress;
        npoAddresses[_address].object = _object;
        npoAddresses[_address].npoType = _npoType;
        npoMap[npoCount] = _address;
        npoCount++;
    }

}