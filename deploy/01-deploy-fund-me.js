const { network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");

const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAdress;
  // Deciding which whether to use mock or testnet/mainnet for priceFeed
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAdress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAdress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  log("Deploying Fund Me............");
  log(network.config.blockConfirmations);
  const args = [ethUsdPriceFeedAdress];
  const fundMe = await deploy("FundMe", {
    contract: "FundMe",
    from: deployer,
    args: args,
    logs: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`FundMe Deployed at:${fundMe.address}`);

  // Verify if not local network
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying the contract! Please wait");
    await verify(fundMe.address, args);
    log("Contract Verified");
  }
};

module.exports.tags = ["all", "fundMe"];
