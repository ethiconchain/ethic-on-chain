const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const ERC20EOC = artifacts.require('EthicToken');
const EthicOnChain = artifacts.require('EthicOnChain');

contract('EthicOnChain', function (accounts) {

    const _initialsupply = new BN(10000000);

    const owner = accounts[0];

    const _denomination = 'Fondation Michelin';
    const _npoAddress = '23 Pl. des Carmes Dechaux, 63000 Clermont-Ferrand';
    const _object = "mobilité durable, sport et santé, éducation et solidarité, protection de l'environnement, culture et patrimoine";
    const _npoType = 'Fondation d’entreprise';
    const _NpoAddressOne = accounts[1];
    const _projectOneIndex = new BN(0);

    const _title = 'AidePourEnfants';
    const _description = "Ce projet a pour bur d'aider les enfants";
    const _city = "Paris";
    const _startDate = new BN(3600000); // 1h since 01-JAN-1970 Unix Epoch date
    const _endDate = new BN(7200000); // 2h since 01-JAN-1970 Unix Epoch date, the aim is to check that end date is higher than start date
    const _minAmount = new BN(100);
    const _maxAmount = new BN(360);
    const _campaignStartDate = new BN(10);
    const _campaignDurationInDays = new BN(115);
    const _projectIndex = new BN(1);

    beforeEach(async function () {
        this.TokenInstance = await ERC20EOC.new(_initialsupply, { from: owner });
        this.InstanceEthicOnChain = await EthicOnChain.new(this.TokenInstance.address, { from: owner });
    });

    it('Add NPO - NAME', async function () {
        await this.InstanceEthicOnChain.addNpo(_denomination, _npoAddress, _object, _npoType, _NpoAddressOne);
        let InformationNpo = await this.InstanceEthicOnChain.npoAddresses(_NpoAddressOne);
        let verifName = InformationNpo.denomination;
        expect(verifName).to.equal(_denomination);
    });

    it('Add NPO - Object', async function () {
        await this.InstanceEthicOnChain.addNpo(_denomination, _npoAddress, _object, _npoType, _NpoAddressOne);
        let InformationNpo = await this.InstanceEthicOnChain.npoAddresses(_NpoAddressOne);
        let verifObject = InformationNpo.object;
        expect(verifObject).to.equal(_object);
    });

    it('Add NPO - NpoType', async function () {
        await this.InstanceEthicOnChain.addNpo(_denomination, _npoAddress, _object, _npoType, _NpoAddressOne);
        let InformationNpo = await this.InstanceEthicOnChain.npoAddresses(_NpoAddressOne);
        let verifNpoType = InformationNpo.npoType;
        expect(verifNpoType).to.equal(_npoType);
    });

    it('Add NPO - projectCount', async function () {
        await this.InstanceEthicOnChain.addNpo(_denomination, _npoAddress, _object, _npoType, _NpoAddressOne);
        let InformationNpo = await this.InstanceEthicOnChain.npoAddresses(_NpoAddressOne);
        let verifAddress = InformationNpo.projectCount;
        expect(verifAddress).to.be.bignumber.equal(_projectOneIndex);
    });

    it('Add Project  ', async function () {
        await this.InstanceEthicOnChain.addNpo(_denomination, _npoAddress, _object, _npoType, _NpoAddressOne);
        await this.InstanceEthicOnChain.addProject(_title, _description, _city, _startDate, _endDate, _campaignStartDate, _campaignDurationInDays, _minAmount, _maxAmount, { from: _NpoAddressOne });
        let InformationNewProject = await this.InstanceEthicOnChain.getProject(_projectOneIndex, _NpoAddressOne);
        let verifTitle = InformationNewProject.title;
        let verifDescription = InformationNewProject.description;
        let verifCity = InformationNewProject.city;
        let verifStartDate = InformationNewProject.startDate;
        let verifEndDate = InformationNewProject.endDate;
        let verifCampaignStartDate = InformationNewProject.campaignStartDate;
        let verifCampaignDurationInDays = InformationNewProject.campaignDurationInDays;
        let verifMinAmount = InformationNewProject.minAmount;
        let verifMaxAmount = InformationNewProject.maxAmount;
        expect(verifTitle).to.equal(_title);
        expect(verifDescription).to.equal(_description);
        expect(verifCity).to.equal(_city);
        expect(verifStartDate).to.be.bignumber.equal(_startDate);
        expect(verifEndDate).to.be.bignumber.equal(_endDate);
        expect(verifCampaignStartDate).to.be.bignumber.equal(_campaignStartDate);
        expect(verifCampaignDurationInDays).to.be.bignumber.equal(_campaignDurationInDays);
        expect(verifMinAmount).to.be.bignumber.equal(_minAmount);
        expect(verifMaxAmount).to.be.bignumber.equal(_maxAmount);
    });

    it('Add Project - Increase projectCount', async function () {
        await this.InstanceEthicOnChain.addNpo(_denomination, _npoAddress, _object, _npoType, _NpoAddressOne);
        await this.InstanceEthicOnChain.addProject(_title, _description, _city, _startDate, _endDate, _campaignStartDate, _campaignDurationInDays, _minAmount, _maxAmount, { from: _NpoAddressOne });
        let InformationNpo = await this.InstanceEthicOnChain.npoAddresses(_NpoAddressOne);
        let verifAddress = InformationNpo.projectCount;
        expect(verifAddress).to.be.bignumber.equal(_projectIndex);
    });

});