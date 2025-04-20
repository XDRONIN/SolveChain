const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solvecoin", function () {
  let Solvecoin;
  let solvecoin;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy contract
    Solvecoin = await ethers.getContractFactory("Solvecoin");
    solvecoin = await Solvecoin.deploy(1000000);
    await solvecoin.deployed();
  });

  describe("Deployment", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await solvecoin.balanceOf(owner.address);
      expect(await solvecoin.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the correct token name and symbol", async function () {
      expect(await solvecoin.name()).to.equal("Solvecoin");
      expect(await solvecoin.symbol()).to.equal("SOLVE");
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await solvecoin.transfer(addr1.address, 50);
      const addr1Balance = await solvecoin.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await solvecoin.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await solvecoin.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await solvecoin.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner
      await expect(
        solvecoin.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed
      expect(await solvecoin.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });

  describe("Reward Function", function () {
    it("Should allow owner to reward users", async function () {
      // Owner rewards addr1 with 100 tokens
      await solvecoin.rewardSolver(addr1.address, 100);
      expect(await solvecoin.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should fail if non-owner tries to reward", async function () {
      // addr1 tries to reward addr2
      await expect(
        solvecoin.connect(addr1).rewardSolver(addr2.address, 100)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should emit TokensRewarded event", async function () {
      await expect(solvecoin.rewardSolver(addr1.address, 100))
        .to.emit(solvecoin, "TokensRewarded")
        .withArgs(addr1.address, 100);
    });
  });

  describe("Mint Function", function () {
    it("Should allow owner to mint more tokens", async function () {
      const initialSupply = await solvecoin.totalSupply();
      await solvecoin.mintTokens(1000);

      // New supply should be initial + 1000 * 10^18
      const expectedSupply = initialSupply.add(ethers.utils.parseEther("1000"));
      expect(await solvecoin.totalSupply()).to.equal(expectedSupply);
    });

    it("Should fail if non-owner tries to mint", async function () {
      await expect(
        solvecoin.connect(addr1).mintTokens(1000)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
