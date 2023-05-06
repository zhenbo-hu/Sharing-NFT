// scripts/upgrade_box.js
const { ethers, upgrades } = require("hardhat");

const SharingNFTContractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

async function main() {
  const BoxV2 = await ethers.getContractFactory("SharingNFT");
  console.log("Upgrading SharingNFT...");
  await upgrades.upgradeProxy(SharingNFTContractAddress, BoxV2);
  console.log("SharingNFT upgraded");
}

main();
