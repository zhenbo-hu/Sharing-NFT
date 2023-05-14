// scripts/upgrade_box.js
const { ethers, upgrades } = require("hardhat");
require('dotenv').config();

const SharingNFTContractAddress = process.env.FANTOM_TEST_SHARING_NFT_ADDRESS;

async function main() {
  const BoxV2 = await ethers.getContractFactory("SharingNFT");
  console.log("Upgrading SharingNFT...");
  await upgrades.upgradeProxy(SharingNFTContractAddress, BoxV2);
  console.log("SharingNFT upgraded");
}

main();
