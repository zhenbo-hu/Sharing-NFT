const { ethers, upgrades } = require("hardhat");
require('dotenv').config();

const SharingNFTContractAddress = process.env.FANTOM_TEST_SHARING_NFT_ADDRESS;

async function main() {
  const SharingNFT = await ethers.getContractFactory("SharingNFT");
  console.log("Upgrading SharingNFT...");
  await upgrades.upgradeProxy(SharingNFTContractAddress, SharingNFT);
  console.log("SharingNFT upgraded");
}

main();
