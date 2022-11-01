# Test task - NFT 🤔

Your task is to create a dynamic NFT. The whole task should take you around 8 hours.

## Part 1 - minting 🎉

Create a dapp for minting NFTs.

- Create an ERC721 smart contract and deploy it to Goerli Ethereum testnet
- Your dapp UI should let the user select the NFT they like from the 3 different types you implement (same NFT collection, same smart contract, different NFT types, e.g. the user could choose from among 3 Pokemon: Charmander, Bulbasaur and Squirtle; your implementation CAN'T be about Pokemon) and mint it for 0.001 ETH
- Users can mint as many NFTs of any type as they like
- Show in the UI all NFTs the user owns
- Minted NFT should adhere to the [OpenSea metadata standard](https://docs.opensea.io/docs/metadata-standards)
- You don't have to deploy the UI anywhere, it can be run locally

Bonus points:

- Verify your smart contract on https://goerli.etherscan.io/ so that anyone can see the source code (e.g. here's the verified source code of USDT on mainnet: https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7#code)

Hints:

- You may refer to [this contract](https://github.com/PatrickAlphaC/dungeons-and-dragons-nft/blob/master/contracts/DungeonsAndDragonsCharacter.sol) as inspiration but keep in mind that it's not exactly what you need!
- You can use [Pinata](https://www.pinata.cloud/) to store the metadata and images - it's free!
- You can get Goerli ETH from [here](https://faucets.chain.link/) - it's also free!

## Part 2 - making it dynamic 🐴 -> 🦄

Modify the smart contract so that users can modify their NFTs.

- Add a new `evolve` function to your smart contract
- Modify the dapp UI so that there's an `Evolve` button next to each unevolved NFT the user holds
- In your version, 'evolving' can be replaced by some other mechanic that makes sense in the context of your theme, as long as it modifies the exisiting NFT
- The evolution should cost 0.0005 ETH
- When the evolution is complete, the NFT image / metadata URL should be replaced with the evolved version of the NFT and its name should change accordingly
- For simplicity, assume that each NFT only can be evolved only once

Bonus points:

- Monitor the blockchain from your UI and whenever an NFT is minted or evolved, show a notification: "User `<address>` has just minted `<NFT name>`!" or "User `<address>` has just evolved `<NFT name>`!" - so in essence, this will notify you of other users' activity

Hints:

- For the bonus part, look into [events](https://docs.ethers.io/v5/concepts/events/)

## Submitting your work 📬

Once done, provide the recruiter with a link to the github repo with your implementation. The repository can be public. Good luck, have fun! ✨
