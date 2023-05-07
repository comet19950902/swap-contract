import { expect } from "chai";
import { Contract } from "web3-eth-contract";

const TokenABC = artifacts.require("./TokenABC.sol");
const TokenXYZ = artifacts.require("./TokenXYZ.sol");
const TokenSwap = artifacts.require("./TokenSwap.sol");

contract("TokenABC", (accounts) => {
    let tokenInstance: Contract;

    beforeEach(async () => {
        tokenInstance = await TokenABC.deployed();
    });

    it("Testing the initial supply", async () => {
        const result = await tokenInstance.totalSupply.call();
        expect(result).to.equal(1000000 * 10 ** 18);
    });
});

contract("TokenXYZ", (accounts) => {
    let tokenInstance: Contract;

    beforeEach(async () => {
        tokenInstance = await TokenXYZ.deployed();
    });

    it("Testing the XYZ Token price", async () => {
        const result = await tokenInstance.totalSupply.call();
        expect(result).to.equal(1000000 * 10 ** 18);
    });
});

contract("TokenSwap", (accounts) => {
    let tokenSwapInstance: Contract;
    let tokenAInstance: Contract;
    let tokenXInstance: Contract;

    beforeEach(async () => {
        tokenSwapInstance = await TokenSwap.deployed();
        tokenAInstance = await TokenABC.deployed();
        tokenXInstance = await TokenXYZ.deployed();

        await tokenSwapInstance.tokenABC.call();
        await tokenSwapInstance.buyTokensABC(1000, {
        from: accounts[0],
        value: 1000 * 1000 + 2000,
        });
        await tokenSwapInstance.buyTokensXYZ(1000, {
        from: accounts[0],
        value: 1000 * 1000 + 2000,
        });

        await tokenSwapInstance.setRatio(3);
        await tokenSwapInstance.setFees(30);

        // need to buy tokenABC
        await tokenAInstance.buyTokens(10, {
        from: accounts[0],
        value: 1000 * 1000 + 2000,
        });
    });

    it("testing the swapTKA function", async () => {
        // approve the smart contract to withdraw amount of tokens that is going to be exchanged
        // and test the allowanceValue before and after the approval
        await tokenAInstance.approve(tokenSwapInstance.address, 5);

        let allowanceValue = await tokenAInstance.allowance(
        accounts[0],
        tokenSwapInstance.address
        );
        expect(allowanceValue).to.equal(5);

        await tokenSwapInstance.swapTKA(5, {
        from: accounts[0],
        });

        let allowanceValueAfter = await tokenAInstance.allowance(
        accounts[0],
        tokenSwapInstance.address
        );
        expect(allowanceValueAfter).to.equal(0);

        const balanceOfX = await tokenXInstance.balanceOf(
        tokenSwapInstance.address
        );
        expect(balanceOfX).to.equal(989);

        const balanceOfA = await tokenAInstance.balanceOf(
        tokenSwapInstance.address
        );

        expect(balanceOfA).to.equal(1005);

        const balanceTKA = await tokenAInstance.balanceOf.call(accounts[0]);
        const balanceTKX = await tokenXInstance.balanceOf.call(accounts[0]);
        expect(balanceTKA).to.equal(5);
        expect(balanceTKX).to.equal(11);
    });

    it("testing the swapTKX function", async () => {
        const ratio = await tokenSwapInstance.setRatio(3);

        const checkPre = await tokenXInstance.balanceOf.call(accounts[0]);
        expect(checkPre).to.equal(11);
        // approve the smart contract to withdraw amount of tokens that is going to be exchanged
        // and test the allowanceValue before and after the approval
        await tokenXInstance.approve(tokenSwapInstance.address, 10);

        let allowanceValue = await tokenXInstance.allowance(
        accounts[0],
        tokenSwapInstance.address
        );
        expect(allowanceValue).to.equal(10);

        await tokenSwapInstance.swapTKX(10, {
        from: accounts[0],
        });

        let allowanceValueAfter = await tokenAInstance.allowance(
        accounts[0],
        tokenSwapInstance.address
        );
        expect(allowanceValueAfter).to.equal(0);

        const balanceOfX = await tokenXInstance.balanceOf(
        tokenSwapInstance.address
        );
        expect(balanceOfX).to.equal(999);

        const balanceOfA = await tokenAInstance.balanceOf(
        tokenSwapInstance.address
        );

        expect(balanceOfA).to.equal(1002);

        const balanceTKA = await tokenAInstance.balanceOf.call(accounts[0]);
        const balanceTKX = await tokenXInstance.balanceOf.call(accounts[0]);
        expect(balanceTKA).to.equal(8);
        expect(balanceTKX).to.equal(1);
    });
});