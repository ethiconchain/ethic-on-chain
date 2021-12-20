// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract EthicOnChain {
    
    struct NPO{
        bool isNpo;
        string name;
        string nomination;
        string object;
        string typeNpo;
        Projet [] MyProject;
    }

    struct Donor{
        string name;
        string surName;
        string addressDonor;
    }

    struct Projet{
        address ownerNpo;
        string name;
        Cause cause;
        string title;
        string description;
        string city;
        uint startDate;
        uint endDate;
        uint minAmount;
        uint maxAmount;
        uint StartCamp;
        uint DurationCamp;
    }   
   

    enum Cause{
        LutteContreLapauvreteEtExclusion,
        EnvironnementEtLesAnimaux,
        Education,
        ArtEtLaCulture,
        SanteEtLaRecherche,
        DroitsDeLHomme,
        InfrastructureRoutiere
    }


    enum Status{
        AddProjectProposal, 
        WaitingOpening,
        OpenFundRaising,
        CloseFundRaising
    }


    mapping (address => NPO) public AddressNpo; //Mapping of all NPO 
    NPO [] public Npos;  

    Projet [] public ProjectProposal;
    
    event addNewNpo(address _addressNpo,string _name,string _domination);
    event addNewProject(string _name, uint _startDate,uint _endDate,uint _min,uint _max);





}