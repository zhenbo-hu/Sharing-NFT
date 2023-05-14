import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    // Deploy to fantom testnet
    testnet: {
      url: process.env.FANTOM_TEST_RPC_URL,
      chainId: 4002,
      accounts: [`0x${process.env.FANTOM_TEST_PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: {
      ftmTestnet: process.env.FANTOM_API_KEY,
      opera: process.env.FANTOM_API_KEY,
    }
  },
};

export default config;
