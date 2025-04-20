const hre = require("hardhat");

async function main() {
  console.log("Deploying Solvecoin...");

  // Initial supply of 1 million tokens
  const initialSupply = 1000000;

  const Solvecoin = await hre.ethers.getContractFactory("Solvecoin");
  const solvecoin = await Solvecoin.deploy(initialSupply);

  await solvecoin.waitForDeployment();

  const address = await solvecoin.getAddress();
  console.log("Solvecoin deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
