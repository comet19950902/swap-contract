import { ethers } from 'hardhat';

async function main() {
    const initialSupplyTokenM = 5000;
    const initialSupplyTokenN = 3000;
    const tokenPriceTokenM = 1;
    const tokenPriceTokenN = 1;

    const TokenSwap = await ethers.getContractFactory('TokenSwap');
    const tokenSwap = await TokenSwap.deploy(
        initialSupplyTokenM,
        initialSupplyTokenN,
        tokenPriceTokenM,
        tokenPriceTokenN
    );

    console.log('TokenSwap deployed to:', tokenSwap.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});  