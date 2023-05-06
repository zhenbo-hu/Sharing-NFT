import { expect } from "chai";
import { ethers } from "hardhat";
import {Contract} from "ethers";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';


describe("SharingNFT", function () {
    const ZERO_ADDRESS = ethers.constants.AddressZero;

    let contract: Contract;
    let owner: SignerWithAddress;
    let otherUser: SignerWithAddress;

    before(async function () {
        this.SharingNFT = await ethers.getContractFactory('SharingNFT');
    });

    this.beforeEach(async function () {
        const [_owner, _otherUser] = await ethers.getSigners();
        owner = _owner;
        otherUser = _otherUser;

        contract = await upgrades.deployProxy(this.SharingNFT);
        await contract.deployed();
    });

    describe('mint', function () {
        it('mint with empty uri', async function () {
            await expect(
                contract.mint('', ''),
            ).to.be.revertedWith('uri cannot be empty.');
        });

        it('mint with empty tag', async function () {
            await expect(
                contract.mint('http://localhost', ''),
            ).to.be.revertedWith('tag cannot be empty.');
        });

        it('mint by owner', async function () {
            await expect(
                contract.connect(owner).mint('http://localhost', 'blockchain'),
            ).to.emit(contract, 'Mint').withArgs(1, owner.address);
        });

        it('mint by other user', async function () {
            await expect(
                contract.connect(otherUser).mint('http://localhost', 'blockchain'),
            ).to.emit(contract, 'Mint').withArgs(1, otherUser.address);
        })
    });

    describe('burn', function () {
        it('burn by its owner', async function () {
            await contract.connect(otherUser).mint('http://localhost', 'blockchain');

            await expect(
                contract.connect(otherUser).burn(1),
            ).to.emit(contract, 'Burn').withArgs(1, otherUser.address);
        });

        it('burn by others and revert', async function () {
            await contract.connect(otherUser).mint('http://localhost', 'blockchain');

            await expect(
                contract.connect(owner).burn(1),
            ).to.be.revertedWith('ERC721: caller is not token owner or approved');
        })
    })
})