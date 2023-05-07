require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const GOERLI_API_KEY = "7GrB6EItQJvBze51yHWBx0mHpM8jEY0w";
const MUMBAI_API_KEY = "BulCaczA8_MGcz34wlxGZNPVslXQOgRi";
const SEPOL_API_KEY = "Jt62jFDCQg9BOxFDkEthMgfaTw-0w3Wk";
const MAINNET_API_KEY = "uhA_z0k72AG-CU81hfuwozXD_LIyzKQm";

module.exports = {
  solidity: "0.8.0",

  networks: {
    goerli:{
      url: `https://eth-goerli.g.alchemy.com/v2/${GOERLI_API_KEY}`,
      accounts: [`0x` + process.env.PRIVATE_KEY],
      chainId: 5
    },
    mumbai:{
      url: `https://eth-mainnet.g.alchemy.com/v2/${MUMBAI_API_KEY}`,
      accounts: [`0x` + process.env.PRIVATE_KEY],
      chainId: 80001
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${MAINNET_API_KEY}`,
      accounts: [`0x` + process.env.PRIVATE_KEY],
      chainId: 1,
    },
    sepol:{
      url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOL_API_KEY}`,
      accounts: [`0x` + process.env.PRIVATE_KEY],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: "KC1MM7TEYMXATTFSJQ5TA4ARTYX8P5WU36"
  },
};