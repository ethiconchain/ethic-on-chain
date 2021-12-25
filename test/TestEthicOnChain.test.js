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
    const _newNpoErc20Address = accounts[9]; // account index = 9 because deploy script already uses 1 to 4 as donors and 5 to 8 as default NPOs
    const _projectOneIndex = new BN(0);

    const _title = 'AidePourEnfants';
    const _description = "Ce projet a pour bur d'aider les enfants";
    const _geographicalArea = "Paris";
    const _startDate = new BN(3600000); // 1h since 01-JAN-1970 Unix Epoch date
    const _endDate = new BN(7200000); // 2h since 01-JAN-1970 Unix Epoch date, the aim is to check that end date is higher than start date
    const _minAmount = new BN(100);
    const _maxAmount = new BN(360);
    const _campaignStartDate = new BN(3600000); ;
    const _campaignDurationInDays = new BN(11005);
    const _projectIndex = new BN(1);

    const _newDonorErc20Address = accounts[1];
    const _nameDonor = "Jeff";
    const _surNameDonor = 'Besos';
    const _donorAddress = '19 place de la république, 63000 Clermont-Ferrand';

    beforeEach(async function () {
        this.TokenInstance = await ERC20EOC.new(_initialsupply, { from: owner });
        this.InstanceEthicOnChain = await EthicOnChain.new(this.TokenInstance.address, { from: owner });
    });

    it('Add NPO - NAME', async function () {
        await this.InstanceEthicOnChain.addNpo(_newNpoErc20Address, _denomination, _npoAddress, _object, _npoType);
        let InformationNpo = await this.InstanceEthicOnChain.npoAddresses(_newNpoErc20Address);
        let verifName = InformationNpo.denomination;
        expect(verifName).to.equal(_denomination);
    });

    it('Add NPO - Object', async function () {
        await this.InstanceEthicOnChain.addNpo(_newNpoErc20Address, _denomination, _npoAddress, _object, _npoType);
        let InformationNpo = await this.InstanceEthicOnChain.npoAddresses(_newNpoErc20Address);
        let verifObject = InformationNpo.object;
        expect(verifObject).to.equal(_object);
    });

    it('Add NPO - NpoType', async function () {
        await this.InstanceEthicOnChain.addNpo(_newNpoErc20Address, _denomination, _npoAddress, _object, _npoType);
        let InformationNpo = await this.InstanceEthicOnChain.npoAddresses(_newNpoErc20Address);
        let verifNpoType = InformationNpo.npoType;
        expect(verifNpoType).to.equal(_npoType);
    });

    it('Add Project', async function () {
        await this.InstanceEthicOnChain.addNpo(_newNpoErc20Address, _denomination, _npoAddress, _object, _npoType);
        await this.InstanceEthicOnChain.addProject(_title, _description, _geographicalArea, _startDate, _endDate, _campaignStartDate, _campaignDurationInDays, _minAmount, _maxAmount, { from: _newNpoErc20Address });
        let InformationNewProject = await this.InstanceEthicOnChain.getProject(_projectOneIndex);
        let verifTitle = InformationNewProject.title;
        let verifDescription = InformationNewProject.description;
        let verifgeographicalArea = InformationNewProject.geographicalArea;
        let verifStartDate = InformationNewProject.startDate;
        let verifEndDate = InformationNewProject.endDate;
        let verifCampaignStartDate = InformationNewProject.campaignStartDate;
        let verifCampaignDurationInDays = InformationNewProject.campaignDurationInDays;
        let verifMinAmount = InformationNewProject.minAmount;
        let verifMaxAmount = InformationNewProject.maxAmount;
        expect(verifTitle).to.equal(_title);
        expect(verifDescription).to.equal(_description);
        expect(verifgeographicalArea).to.equal(_geographicalArea);
        expect(verifStartDate).to.be.bignumber.equal(_startDate);
        expect(verifEndDate).to.be.bignumber.equal(_endDate);
        expect(verifCampaignStartDate).to.be.bignumber.equal(_campaignStartDate);
        expect(verifCampaignDurationInDays).to.be.bignumber.equal(_campaignDurationInDays);
        expect(verifMinAmount).to.be.bignumber.equal(_minAmount);
        expect(verifMaxAmount).to.be.bignumber.equal(_maxAmount);
    });

    it('Add Project - Increase projectCount', async function () {
        await this.InstanceEthicOnChain.addNpo(_newNpoErc20Address, _denomination, _npoAddress, _object, _npoType);
        await this.InstanceEthicOnChain.addProject(_title, _description, _geographicalArea, _startDate, _endDate, _campaignStartDate, _campaignDurationInDays, _minAmount, _maxAmount, { from: _newNpoErc20Address });
        let InformationNpo = await this.InstanceEthicOnChain.getNpos();
        let verifCount = InformationNpo[0].projectIds.length;
        expect(new BN(verifCount)).to.be.bignumber.equal(_projectIndex);
    });  

    it('Add Donation', async function () {
        await this.InstanceEthicOnChain.addNpo(_newNpoErc20Address, _denomination, _npoAddress, _object, _npoType);
        const time =await this.InstanceEthicOnChain.getTime();
        await this.InstanceEthicOnChain.addProject(_title, _description, _geographicalArea, time, time+1000, time, time, _minAmount, _maxAmount, { from: _newNpoErc20Address });
        await this.InstanceEthicOnChain.addDonor(accounts[0], _nameDonor, _surNameDonor, _donorAddress);
        //C'est l'accounts[0] qui possède tous les tokens EOC car il n'a toujours pas réalise la distribution
        //On doit augmenter l'allocation qui correspond au montant qu'on peut donner à l'address
        await this.TokenInstance.increaseAllowance( this.InstanceEthicOnChain.address,new BN(1000000000), { from : accounts[0]} );
        await this.InstanceEthicOnChain.addDonation(new BN(0), new BN(10), { from : accounts[0]} );
        let InformationProject = await this.InstanceEthicOnChain.getProject(new BN(0));
        let verifBalance = InformationProject.projectBalance;
        let InformationDonation = await this.InstanceEthicOnChain.getDonation(new BN(0));
        const donationId = InformationDonation.donationId;
        const projectId = InformationDonation.projectId;
        const donorId = InformationDonation.donorId;
        const donationDate = InformationDonation.donationDate;
        const donationAmount = InformationDonation.donationAmount;
        expect(verifBalance).to.be.bignumber.equal(new BN(10));
        expect(donationId).to.be.bignumber.equal(new BN(0));
        expect(projectId).to.be.bignumber.equal(new BN(0));
        expect(donorId).to.be.bignumber.equal(new BN(0));
        //expect(donationDate).to.be.bignumber.equal( ?? );
        expect(donationAmount).to.be.bignumber.equal(new BN(10));

    });

    it('Add Donor', async function () {
        await this.InstanceEthicOnChain.addDonor(_newDonorErc20Address, _nameDonor, _surNameDonor, _donorAddress);
        let InformationNewDonor = await this.InstanceEthicOnChain.getDonor(_newDonorErc20Address);
        verifName = InformationNewDonor.name;
        verifSurName = InformationNewDonor.surName;
        verifPostalAddress = InformationNewDonor.postalAddress;
        expect(verifName).to.equal(_nameDonor);
        expect(verifSurName).to.equal(_surNameDonor);
        expect(verifPostalAddress).to.equal(_donorAddress);

    });

    it('Event For AddNpo', async function () {
        const receipt =await this.InstanceEthicOnChain.addNpo(_newNpoErc20Address, _denomination, _npoAddress, _object, _npoType);
        expectEvent(receipt, "NpoAdded", { _poId: _projectOneIndex,_npoErc20Address:_newNpoErc20Address, _denomination:_denomination});
    });  

    it('Event For AddDonor', async function () {
        const receipt = await this.InstanceEthicOnChain.addDonor(_newDonorErc20Address, _nameDonor, _surNameDonor, _donorAddress);
        expectEvent(receipt, "DonorAdded", { 
            _donorId: new BN(0),
            _donorErc20Address:_newDonorErc20Address,
            _donorName:_nameDonor
        });
    });  

    it('Event For DonorAdded', async function () {
        await this.InstanceEthicOnChain.addNpo(_newNpoErc20Address, _denomination, _npoAddress, _object, _npoType);
        const receipt = await this.InstanceEthicOnChain.addProject(_title, _description, _geographicalArea, _startDate, _endDate, _campaignStartDate, _campaignDurationInDays, _minAmount, _maxAmount, { from: _newNpoErc20Address });
        expectEvent(receipt, "ProjectAdded", {
             _projectId: _projectOneIndex,
             _title:_title, 
             _startDate:_startDate,
             _endDate:_endDate,
             _minAmount:_minAmount,
             _maxAmount:_maxAmount
        });
    });  
    it('Event For DonationAdded', async function () {
        await this.InstanceEthicOnChain.addNpo(_newNpoErc20Address, _denomination, _npoAddress, _object, _npoType);
        const time =await this.InstanceEthicOnChain.getTime();
        await this.InstanceEthicOnChain.addProject(_title, _description, _geographicalArea, time, time+1000, time, time, _minAmount, _maxAmount, { from: _newNpoErc20Address });
        await this.InstanceEthicOnChain.addDonor(accounts[0], _nameDonor, _surNameDonor, _donorAddress);
        //C'est l'accounts[0] qui possède tous les tokens EOC car il n'a toujours pas réalise la distribution
        //On doit augmenter l'allocation qui correspond au montant qu'on peut donner à l'address
        const amount =new BN(10);
        await this.TokenInstance.increaseAllowance( this.InstanceEthicOnChain.address,amount, { from : accounts[0]} );
        const receipt= await this.InstanceEthicOnChain.addDonation(new BN(0), amount, { from : accounts[0]} );
        const InformationDonation= await this.InstanceEthicOnChain.getDonation(new BN(0));

        expectEvent(receipt, "DonationAdded", {
            _donationId: InformationDonation.donationId,
            _projectId:InformationDonation.projectId, 
            _donorId:InformationDonation.donorId,
            _donationDate:InformationDonation.donationDate,
            donationAmount:InformationDonation.donationAmount
        });
    });  
    
    

});