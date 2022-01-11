// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
 
/// @title IEocNpo 
/// @author Lahcen E. Dev / Jérôme Gauthier
/// @notice Interface to manage NPOs (= non profit organisations)
interface IEocNpo {
    
    struct NPO {
        uint npoId;
        address npoErc20Address;
        string denomination;
        string postalAddress;
        string object;
        string npoType;
        uint[] projectIds;
        uint[] withdrawalIds;
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
        string memory _npoType) external returns (uint _npoId);

    /// @dev Adds an item in the projectIds array of the NPO
    /// @param _npoErc20Address erc20 address of the NPO Struct
    /// @param _projectId project id of the project to be added
    function addProjectIdsItem(address _npoErc20Address, uint _projectId ) external;

    /// @dev Get an NPO via its erc20 address
    /// @param _npoErc20Address erc20 address of the NPO Struct
    /// @return returns the corresponding NPO struct
    function getNpo(address _npoErc20Address) external view returns(NPO memory);
    
    /// @dev Get an NPO via its id
    /// @param _npoId id of the NPO
    /// @return returns the corresponding NPO struct
    function getNpoByIndex(uint _npoId) external view returns(NPO memory);

    /// @dev Get all NPOs
    /// @return returns an array of all NPOs
    function getNpos() external view returns(NPO [] memory);



}