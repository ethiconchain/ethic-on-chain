// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title EthicOnChain.sol
/// @author Lahcen
/// @dev Structure for NPO and Project
contract EthicOnChain {
    
    struct NPO {
        bool isNpo;
        string Name;
        uint Rna;
    }

    struct Projet{
        string Name;
        string Description;
        string Target;
        string Country;
        string City;
        uint StartDate;
        uint EndDate;
        uint MinAmount;
        uint MaxAmount;
        status Status;
        uint balance;
    }   


    enum status {
        AddProjectProposal, 
        WaitingOpening,
        OpenFundRaising,
        CloseFundRaising
    }


    mapping (address => NPO) public AddressNpo; //Mapping of all NPO 
    NPO [] public Npos;  

    Projet [] public ProjectProposal;
    
    event addNewNpo(address _addressNpo,string _name,uint _Rna);
    event addNewProject(string _name, uint _startDate,uint _endDate,uint _min,uint _max);



 /// @dev The administrator may add associations 
 /// @param _name Name of Npo
 /// @param _Rna Siret number of Npo
 /// @param _address ERC 20 address of the Npo

    function AddNpo (string memory _name, uint _Rna,address _address) public {
        Npos.push(NPO(true,_name,_Rna));
        AddressNpo[_address]=NPO(true,_name,_Rna);
        emit addNewNpo(_address,_name,_Rna);
    }



 /// @dev Registered associations can propose a project
 /// @param _nameProject Name of Npo
 /// @param _description Siret number of Npo
 /// @param _country ERC 20 address of the Npo
 /// @param _city Name of Npo
 /// @param _startDate Siret number of Npo
 /// @param _endDate ERC 20 address of the Npo
 /// @param _min Siret number of Npo
 /// @param _max ERC 20 address of the Npo

    function AddProject (
        string memory _nameProject,
        string memory _description, 
        string memory _target,
        string memory _country,
        string memory _city,
        uint _startDate,
        uint _endDate,
        uint _min,
        uint _max
        ) 
    public {
        require(AddressNpo[msg.sender].isNpo==true,"Not registered");
        Projet memory newProject = Projet(_nameProject,_description,_target,_country,_city,_startDate,_endDate,_min,_max,status.AddProjectProposal,0); 
        ProjectProposal.push(newProject);
        emit addNewProject(_nameProject,_startDate,_endDate,_min,_max);
   
    }


}