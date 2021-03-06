const providerRunHandler = require('../run/dapp-services-node');


const artifacts = require('../../tools/eos/artifacts');
const deployer = require('../../tools/eos/deployer');
const {getCreateAccount} = require('../../tools/eos/utils');

const {dappServicesContract} = require("../../tools/eos/dapp-services")
const servicescontract = dappServicesContract;
var servicesC = artifacts.require(`./dappservices/`);


async function deployLocalExtensions() {
    var deployedContract = await deployer.deploy(servicesC, servicescontract);
    var provider = "pprovider1";
    var key = await getCreateAccount(provider);
    var blocksPerSecond = 60 * 2;
    var blocksPerMinute = 60 * blocksPerSecond;
    var blocksPerHour = 60 * blocksPerMinute;
    var blocksPerDay = 24 * blocksPerHour;
    var blocksPerYear = 365 * blocksPerDay;
    var numberOfBlocksToTwice = blocksPerYear;
    await deployedContract.contractInstance.create({
        maximum_supply_amount: 10000000000,
        inflation_per_block: Math.pow(2.0,1.0/(numberOfBlocksToTwice)) - 1.0
    }, {
        authorization: `${servicescontract}@active`,
        broadcast: true,
        sign: true
    });
    return deployedContract;
}

module.exports = async(args)=>{
    await deployLocalExtensions();
    return providerRunHandler.handler(args);
};  
  