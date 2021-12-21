const { BN,expectRevert , expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const EthicOnChain = artifacts.require('EthicOnChain');

contract('EthicOnChain', function (accounts) {

    const owner = accounts[0];

    const _denomination = 'Fondation Michelin';
    const _npoAddress = '23 Pl. des Carmes Dechaux, 63000 Clermont-Ferrand';
    const _object = "mobilité durable, sport et santé, éducation et solidarité, protection de l'environnement, culture et patrimoine";
    const _npoType = 'Fondation d’entreprise';
    const _NpoAddressOne = accounts[1];
    const _nbProjectOne = new BN(0);

    const _title = 'AidePourEnfants';
    const _description = "Ce projet a pour bur d'aider les enfants";
    const _city = "Paris";
    const _startDate = new BN(10);
    const _endDate = new BN(10);
    const _minAmount = new BN(10);
    const _maxAmount = new BN(10);
    const _CampaignStartDate = new BN(10);
    const _CampaignDurationInDays = new BN(10);
    const _nbProjectIndex = new BN(1);





    beforeEach(async function () {
        this.InstanceEthicOnChain = await EthicOnChain.new({from: owner});
    });


    it('Add NPO - NAME', async function () {
        await this.InstanceEthicOnChain.addNpo(_denomination,_npoAddress,_object,_npoType,_NpoAddressOne);
        let InformationNpo= await this.InstanceEthicOnChain.npoAddresses(_NpoAddressOne);
        let verifName=InformationNpo.denomination;
        expect(verifName).to.equal(_denomination);
    });

    it('Add NPO - Object', async function () {
        await this.InstanceEthicOnChain.addNpo(_denomination,_npoAddress,_object,_npoType,_NpoAddressOne);
        let InformationNpo= await this.InstanceEthicOnChain.npoAddresses(_NpoAddressOne);
        let verifObject=InformationNpo.object;
        expect(verifObject).to.equal(_object);   
    });

    it('Add NPO - NpoType', async function () {
        await this.InstanceEthicOnChain.addNpo(_denomination,_npoAddress,_object,_npoType,_NpoAddressOne);
        let InformationNpo= await this.InstanceEthicOnChain.npoAddresses(_NpoAddressOne);
        let verifNpoType=InformationNpo.npoType;
        expect(verifNpoType).to.equal(_npoType);   
    });

    it('Add NPO - NbProject', async function () {
        await this.InstanceEthicOnChain.addNpo(_denomination,_npoAddress,_object,_npoType,_NpoAddressOne);
        let InformationNpo= await this.InstanceEthicOnChain.npoAddresses(_NpoAddressOne);
        let verifAddress=InformationNpo.nbProject;
        expect(verifAddress).to.be.bignumber.equal(_nbProjectOne);   
    });


    it('Add Project  ', async function () {
        await this.InstanceEthicOnChain.addNpo(_denomination,_npoAddress,_object,_npoType,_NpoAddressOne);
        await this.InstanceEthicOnChain.addProject( _title,_description,_city, _startDate, _endDate, _minAmount, _maxAmount, _CampaignStartDate, _CampaignDurationInDays,{from: _NpoAddressOne});
        let InformationNewProject= await this.InstanceEthicOnChain.getProject(_nbProjectOne,_NpoAddressOne);
        let verifTitle=InformationNewProject.title;
        let verifDescription=InformationNewProject.description;
        let verifCity=InformationNewProject.city;
        let verifStartDate=InformationNewProject.startDate;
        let verifEndDate=InformationNewProject.endDate;
        let verifMinAmount=InformationNewProject.minAmount;
        let verifMaxAmount=InformationNewProject.maxAmount;
        let verifCampaignStartDate=InformationNewProject.campaignStartDate;
        let verifCampaignDurationInDays=InformationNewProject.campaignDurationInDays;
        expect(verifTitle).to.equal(_title);   
        expect(verifDescription).to.equal(_description);   
        expect(verifCity).to.equal(_city);   
        expect(verifStartDate).to.be.bignumber.equal(_startDate);  
        expect(verifEndDate).to.be.bignumber.equal(_endDate);  
        expect(verifMinAmount).to.be.bignumber.equal(_minAmount);  
        expect(verifMaxAmount).to.be.bignumber.equal(_maxAmount);  
        expect(verifCampaignStartDate).to.be.bignumber.equal(_CampaignStartDate);  
        expect(verifCampaignDurationInDays).to.be.bignumber.equal(_CampaignDurationInDays);  
    });

    it('Add Project - Increase NbProject', async function () {
        await this.InstanceEthicOnChain.addNpo(_denomination,_npoAddress,_object,_npoType,_NpoAddressOne);
        await this.InstanceEthicOnChain.addProject( _title,_description,_city, _startDate, _endDate, _minAmount, _maxAmount, _CampaignStartDate, _CampaignDurationInDays,{from: _NpoAddressOne});
        let InformationNpo= await this.InstanceEthicOnChain.npoAddresses(_NpoAddressOne);
        let verifAddress=InformationNpo.nbProject;
        expect(verifAddress).to.be.bignumber.equal(_nbProjectIndex);   
    });


});