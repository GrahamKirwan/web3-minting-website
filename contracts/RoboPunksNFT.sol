// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract RoboPunksNFT is ERC721, Ownable {
    uint256 public mintPrice;
    uint256 public totalSupply;
    uint256 public maxSupply;
    uint256 public maxPerWallet; 
    bool public isPublicMintEnabled; // owner of contract will be able to set to true to make minting enabled
    string internal baseTokenUri; // tell opensea where the images are located
    address payable public withdrawWallet; // how to withdraw the money that goes into the contract - how we retrieve the funds
    mapping(address => uint256) public walletMints;

    // Contructor function to be called when contract is created - this will create the boilerplate ERC721 contract from openzeppelin and we pass in our project name and ticker symbol - we also declare variables
    constructor() payable ERC721('RoboPunks', 'RP') {
        mintPrice = 0.02 ether;
        totalSupply = 0;
        maxSupply = 1000;
        maxPerWallet = 3;
        withdrawWallet = payable(0x134deA7C3AC206e9d3Fbc6d2D100DAEdBBA8D02E);
        // set withdraw wallet address (withdrawWallet)
    }

    //  Only the owner of the contract will be able to call this function. 'isPublicMintEnabled_' is different from our declared variable above (we use an underscore to identify the difference here)
    // The owner of the contract will by default be set to the wallet that deploys the contract
    function setIsPublicMintEnabled(bool isPublicMintEnabled_) external onlyOwner {
        // The owner can call this funciton and pass in 'true' which will change the isPublicMintEnabled variable to true and minting will be enabled for the contract
        isPublicMintEnabled = isPublicMintEnabled_;
    }

    function setBaseTokenUri(string calldata baseTokenUri_) external onlyOwner {
        // Sets the uri of where the images are going to be located
        baseTokenUri = baseTokenUri_;
    }

    // This function is originally coming from the openzeppelin ERC721 contract but we have to override it for our contract (because we define our basetokenURI above)
    // This function basically gets called by opensea for every nft we have and adds a token ID to the end of our baseURI from above and makes it a json file
    // Its basically allowing opensea to grab the url of every image
    // Opensea calls tokenURI function for each token and thats how our images get displayed on opensea
    function tokenURI(uint256 tokenId_) public view override returns (string memory) {
        // Require is just error handling
        require(_exists(tokenId_), 'Token does not exist');
        return string(abi.encodePacked(baseTokenUri, Strings.toString(tokenId_), ".json"));
    }

    // This is the function that will withdraw all the funds to the withdrawWallet address that was specified above 
    // Passing to value: address(this).balance is just taking the balance of the smart contract(this)
    function withdraw() external onlyOwner {
        (bool success, ) = withdrawWallet.call{ value: address(this).balance }('');
        require(success, 'withdraw failed');
    }

    // Our mint function
    function mint(uint256 quantity_) public payable {
        // Check that minting is enabled
        require(isPublicMintEnabled, 'minting not enabled');
        // Important so that the value being entered by user is eqaual to the amount owed for that amount of nfts
        require(msg.value == quantity_ * mintPrice, 'wrong mint value');
        require(totalSupply + quantity_ <= maxSupply, 'Sold out');
        require(walletMints[msg.sender] + quantity_ <= maxPerWallet, 'exceeds max allowed per wallet');

        for(uint256 i = 0; i < quantity_; i++) {
            uint256 newTokenId = totalSupply + 1;
            totalSupply++;
            walletMints[msg.sender] += quantity_;
            // SafeMint function exists in the ERC721 openzeppelin contract - we pass in the person trying to mint and the newTokenId that was just created above to keep the supply number rising with each new mint
            _safeMint(msg.sender, newTokenId);
        }
    }
}
