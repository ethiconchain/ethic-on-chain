// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
 
/// @title IEocDonor 
/// @author Lahcen E. Dev / Jérôme Gauthier
/// @notice Interface to manage Donors
interface IEocProject {
    
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
    
    event ProjectAdded(uint _projectId, string _title, uint _startDate, uint _endDate, uint _minAmount, uint _maxAmount);

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
    ) external;

    /// @dev Returns a single Project
    /// @param _projectId project unique id
    /// @return the Project struct instance corresponding to _projectId
    function getProject(uint _projectId) external view returns(Project memory);

    /// @dev  get all projects
    /// @return returns an array of all Project
    function getProjects() external view returns(Project memory);

}