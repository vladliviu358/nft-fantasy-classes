// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Classes721 is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint256 public listingFee = 0.001 * 10**18;

    constructor() ERC721("Classes721", "CLASS") {}

    struct CharacterClass {
        uint256 tokenId;
        address tokenOwner;
        string uri;
    }

    mapping(uint256 => CharacterClass) public idToCharacterClass;

    event CharacterClassCreated(
        uint256 indexed tokenId,
        address tokenOwner,
        string uri
    );

    event CharacterClassEvolved(
        uint256 indexed tokenId,
        address tokenOwner,
        string uri
    );

    function _baseURI() internal pure override returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/";
    }

    function safeMint(address to, string memory uri) public payable onlyOwner {
        require(msg.value == 0.001 * 10**18, "Not enought ETH to create!");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        idToCharacterClass[tokenId] = CharacterClass(tokenId, to, uri);
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit CharacterClassCreated(tokenId, to, uri);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    //used for evoling our classes
    function evolveClass(uint256 tokenId, string memory newUri) payable public {
        require(msg.value == 0.0005*10**18, "Not enought ETH to evolve!");
        CharacterClass storage characterItem = idToCharacterClass[tokenId];
        require(msg.sender == characterItem.tokenOwner, "Not the NFT owner!");
        idToCharacterClass[tokenId] = CharacterClass(
            tokenId,
            characterItem.tokenOwner,
            newUri
        );
        _burn(tokenId);
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, newUri);
        emit CharacterClassEvolved(tokenId, characterItem.tokenOwner, newUri);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function fetchClassesByAddress(address currentAddress)
        public
        view
        returns (CharacterClass[] memory)
    {
        uint256 totalTokensCount = _tokenIdCounter.current();
        uint256 itemCount = 0;

        for (uint256 i = 0; i < totalTokensCount; i++) {
            if (idToCharacterClass[i].tokenOwner == currentAddress) {
                itemCount += 1;
            }
        }

        CharacterClass[] memory myClasses = new CharacterClass[](itemCount);

        for (uint256 i = 0; i < totalTokensCount; i++) {
            if (idToCharacterClass[i].tokenOwner == currentAddress) {
                CharacterClass storage currentItem = idToCharacterClass[i];
                myClasses[i] = currentItem;
            }
        }
        return myClasses;
    }

       function fetchTotalMints()
        public
        view
        returns (uint256)
    {
        return _tokenIdCounter.current();
    }
}
