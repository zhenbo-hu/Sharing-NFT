import { ethers, upgrades } from "hardhat";

async function main() {
  const SharingNFT = await ethers.getContractFactory("SharingNFT");
  const sharingNFT = await upgrades.deployProxy(SharingNFT);

  await sharingNFT.deployed();

  console.log(`SharingNFT deployed to ${sharingNFT.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
