// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenM is ERC20 {
    uint256 public tokenPrice;
    uint256 public tokensSold;

    constructor(uint256 initialSupply, uint256 _tokenPrice)
        ERC20("TokenM", "TM")
    {
        tokenPrice = _tokenPrice;
        _mint(address(this), initialSupply * 10**decimals());
    }

    function mul(uint256 m, uint256 n) internal pure returns (uint256 p) {
        require(n == 0 || (p = m * n) / n == m, "ds-math-mul-overflow");
    }

    function buyTokens(uint256 numberOfTokens) external payable {
        // keep track of number of tokens sold
        // require that a contract have enough tokens
        // require tha value sent is equal to token price
        // trigger sell event
        require(msg.value >= mul(numberOfTokens, tokenPrice));
        require(this.balanceOf(address(this)) >= numberOfTokens);
        require(this.transfer(msg.sender, numberOfTokens));

        tokensSold += numberOfTokens;
    }
}

contract TokenN is ERC20 {
    uint256 public tokenPrice;
    uint256 public tokensSold;

    constructor(uint256 initialSupply, uint256 _tokenPrice)
        ERC20("TokenN", "TN")
    {
        tokenPrice = _tokenPrice;
        _mint(address(this), initialSupply * 10**decimals());
    }

    function mul(uint256 m, uint256 n) internal pure returns (uint256 p) {
        require(n == 0 || (p = m * n) / n == m, "ds-math-mul-overflow");
    }

    function buyTokens(uint256 numberOfTokens) external payable {
        // keep track of number of tokens sold
        // require that a contract have enough tokens
        // require tha value sent is equal to token price
        // trigger sell event
        require(msg.value >= mul(numberOfTokens, tokenPrice));
        require(this.balanceOf(address(this)) >= numberOfTokens);
        require(this.transfer(msg.sender, numberOfTokens));

        tokensSold += numberOfTokens;
    }
}

contract TokenSwap {
    address payable admin;
    uint256 public ratioMN;
    uint256 public fees;

    TokenM public tokenM;
    TokenN public tokenN;

    constructor(uint256 initialSupplyTokenM, uint256 initialSupplyTokenN, 
                uint256 _tokenPriceTokenM, uint256 _tokenPriceTokenN) 
    {
        admin = payable(msg.sender);
        tokenM = new TokenM(initialSupplyTokenM, _tokenPriceTokenM);
        tokenN = new TokenN(initialSupplyTokenN, _tokenPriceTokenN);

        tokenM.approve(address(this), tokenM.totalSupply());
        tokenN.approve(address(this), tokenN.totalSupply());
    }

    modifier onlyAdmin() {
        require(payable(msg.sender) == admin, "Only Admin can perform this action!");
        _;
    }

    function setRatio(uint256 _ratio) public onlyAdmin {
        ratioMN = _ratio;
    }

    function getRatio() public view onlyAdmin returns (uint256) {
        return ratioMN;
    }

    function setFees(uint256 _Fees) public onlyAdmin {
        fees = _Fees;
    }

    function getFees() public view onlyAdmin returns (uint256) {
        return fees;
    }

    function buyTokensM(uint256 amount) public payable onlyAdmin {
        tokenM.buyTokens{value: msg.value}(amount);
    }

    function buyTokensN(uint256 amount) public payable onlyAdmin {
        tokenN.buyTokens{value: msg.value}(amount);
    }

    function swapTKM(uint256 amountTKM, uint256 expireTime) public returns (uint256) {
        require(amountTKM > 0, "amountTKM must be greater then zero");
        require(tokenM.balanceOf(msg.sender) >= amountTKM, "Sender doesn't have enough Tokens");

        uint256 beginningTime = block.timestamp;
        uint256 exchangeM = uint256(amountTKM * ratioMN);
        uint256 exchangeAmount = exchangeM - ((exchangeM * fees) / 100);

        require(exchangeAmount > 0, "Exchange Amount must be greater than zero");

        require(tokenN.balanceOf(address(this)) > exchangeAmount, "Currently the exchange doesnt have enough N Tokens, please retry later :=(");

        tokenM.transferFrom(msg.sender, address(this), amountTKM);
        tokenN.approve(address(this), exchangeAmount);
        tokenN.transferFrom(address(this), msg.sender, exchangeAmount);

        require(block.timestamp <= beginningTime + expireTime, "Swap Period is expired");

        return exchangeAmount;
    }

    function swapTKN(uint256 amountTKN, uint256 expireTime) public returns (uint256) {
        require(amountTKN >= ratioMN, "AmountTKN must be greater than ratio");
        require(tokenN.balanceOf(msg.sender) >= amountTKN, "Sender doesn't have enough Tokens");

        uint256 beginningTime = block.timestamp;
        uint256 exchangeN = amountTKN / ratioMN;
        uint256 exchangeAmount = exchangeN - ((exchangeN * fees) / 100);

        require(exchangeAmount > 0, "Exchange Amount must be greater than zero");

        require(tokenM.balanceOf(address(this)) > exchangeAmount, "Currently the exchange doesnt have enough M Tokens, please retry later :=(");

        tokenN.transferFrom(msg.sender, address(this), amountTKN);
        tokenM.approve(address(this), exchangeAmount);
        tokenM.transferFrom(address(this), msg.sender, exchangeAmount);

        require(block.timestamp <= beginningTime + expireTime, "Swap Period is expired");

        return exchangeAmount;
    }

    function mul(uint256 m, uint256 n) internal pure returns (uint256 p) {
        require(n == 0 || (p = m * n) / n == m, "ds-math-mul-overflow");
    }
}