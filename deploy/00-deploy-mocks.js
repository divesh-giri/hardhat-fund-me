const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

const DECIMAL = 8;
const INITIAL_PRICE = 200000000000;
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  chainId = network.provider.chainId;

  if (developmentChains.includes(network.name)) {
    log("Local Network Detected! Deploying Mocks.......");
    await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMAL, INITIAL_PRICE],
    });
    log("Mocks Deployed");
  }
};

module.exports.tags = ["all", "mocks"];
