const { BN,expectRevert , expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const EthicOnChain = artifacts.require('EthicOnChain');

contract('EthicOnChain', function (accounts) {


    const owner = accounts[0];


    beforeEach(async function () {
        this.InstanceEthicOnChain = await EthicOnChain.new({from: owner});
    });



});