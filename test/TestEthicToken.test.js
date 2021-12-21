const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const ERC20EOC = artifacts.require('EthicToken');

contract('ERC20EOC', function (accounts) {

    const _name = 'EthicOnChain';
    const _symbol = 'EOC';
    const _decimals = new BN(18);
    const _initialsupply = new BN(10000000);
    const owner = accounts[0];
    const recipient = accounts[1];
    const spender = accounts[2];

    beforeEach(async function () {
        this.TokenInstance = await ERC20EOC.new(_initialsupply, { from: owner });
    });

    it('Has a name', async function () {
        expect(await this.TokenInstance.name()).to.equal(_name);
    });

    it('Has a symbol', async function () {
        expect(await this.TokenInstance.symbol()).to.equal(_symbol);
    });

    it('Has a decimal value of 18', async function () {
        expect(await this.TokenInstance.decimals()).to.be.bignumber.equal(_decimals);
    });

    it('Checking the balance', async function () {
        let balanceOwner = await this.TokenInstance.balanceOf(owner);
        let totalSupply = await this.TokenInstance.totalSupply();
        expect(balanceOwner).to.be.bignumber.equal(totalSupply);
    });

    it('Checking transfer', async function () {
        let balanceOwnerBeforeTransfer = await this.TokenInstance.balanceOf(owner);
        let balanceRecipientBeforeTransfer = await this.TokenInstance.balanceOf(recipient);
        let amount = new BN(10);
        await this.TokenInstance.transfer(recipient, amount, { from: owner });
        let balanceOwnerAfterTransfer = await this.TokenInstance.balanceOf(owner);
        let balanceRecipientAfterTransfer = await this.TokenInstance.balanceOf(recipient);
        expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
        expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
    });

    it('Checking transferFrom and approve', async function () {
        let balanceOwnerBeforeTransfer = await this.TokenInstance.balanceOf(owner);
        let balanceRecipientBeforeTransfer = await this.TokenInstance.balanceOf(recipient);
        let amount = new BN(10);
        await this.TokenInstance.approve(spender, amount, { from: owner });
        await this.TokenInstance.transferFrom(owner, recipient, amount, { from: spender });
        let balanceOwnerAfterTransfer = await this.TokenInstance.balanceOf(owner);
        let balanceRecipientAfterTransfer = await this.TokenInstance.balanceOf(recipient);
        expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
        expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
    });
});