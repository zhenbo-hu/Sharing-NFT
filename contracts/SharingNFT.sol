// SPDX-License-Identifier: MIT
// solhint-disable-next-line
pragma solidity ^0.8.9;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {ERC721URIStorageUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {ERC721BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {CountersUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract SharingNFT is
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    ERC721BurnableUpgradeable,
    OwnableUpgradeable
{
    event Mint(uint256 indexed tokenId, address indexed minter);
    event Burn(uint256 indexed tokenId, address indexed burner);

    struct NFTAttributes {
        string uri;
        string tag;
        uint256 weight;
    }

    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    mapping(uint256 => string) private _tokenTags;

    mapping(uint256 => uint256) private _tokenWeights;

    mapping(address => uint256) private _ownersWeights;

    function initialize() public initializer {
        __ERC721_init("SharingNFT", "Sharing");
        __Ownable_init();
    }

    // Any users can mint a NFT token with related attributes.
    function mint(string memory uri, string memory tag) public payable {
        require(bytes(uri).length > 0, "uri cannot be empty.");
        require(bytes(tag).length > 0, "tag cannot be empty.");

        NFTAttributes memory nftAttributes;
        nftAttributes.uri = uri;
        nftAttributes.tag = tag;

        address to = msg.sender;
        if (_ownersWeights[to] != 0) {
            nftAttributes.weight = _ownersWeights[to];
        } else {
            nftAttributes.weight = 1;
            _ownersWeights[to] = 1;
        }

        // counter start from 1
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(to, tokenId);
        _setTokenAttributes(tokenId, nftAttributes);

        emit Mint(tokenId, msg.sender);
    }

    function _setTokenAttributes(
        uint256 tokenId,
        NFTAttributes memory nftAttributes
    ) internal {
        _setTokenURI(tokenId, nftAttributes.uri);
        _setTokenTag(tokenId, nftAttributes.tag);
        _setTokenWeight(tokenId, nftAttributes.weight);
    }

    function _setTokenTag(uint256 tokenId, string memory tag) internal {
        require(_exists(tokenId), "SharingNFT: tag set of nonexistent token");
        _tokenTags[tokenId] = tag;
    }

    function _setTokenWeight(uint256 tokenId, uint256 weight) internal {
        require(
            _exists(tokenId),
            "SharingNFT: Weight set of nonexistent token"
        );
        _tokenWeights[tokenId] = weight;
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        super._burn(tokenId);

        emit Burn(tokenId, msg.sender);
    }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function tokenTag(uint256 tokenId) public view returns (string memory) {
        return _tokenTags[tokenId];
    }

    function tokenWeight(uint256 tokenId) public view returns (uint256) {
        return _tokenWeights[tokenId];
    }
}
