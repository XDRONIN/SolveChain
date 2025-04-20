import { ethers } from "ethers";
import Web3Modal from "web3modal";
import SolvecoinABI from "../assets/Solvecoin.json";

class Web3Service {
  constructor() {
    this.web3Modal = new Web3Modal({
      network: "sepolia", // optional
      cacheProvider: true, // optional
      providerOptions: {
        injected: {
          package: null, // this means use injected provider (like MetaMask)
        },
      },
      theme: "dark",
    });
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

    // Try to restore session if provider is cached
    if (this.web3Modal.cachedProvider) {
      this.connectWallet().catch(console.error);
    }
  }

  async setContract() {
    try {
      if (!this.contractAddress) {
        throw new Error("Contract address is not defined");
      }

      if (!this.signer) {
        throw new Error("Signer is not initialized");
      }

      this.contract = new ethers.Contract(
        this.contractAddress,
        SolvecoinABI.abi,
        this.signer
      );

      return { success: true };
    } catch (error) {
      console.error("Error setting contract:", error);
      return { success: false, error: error.message };
    }
  }

  async setSigner(signer) {
    try {
      this.signer = signer;

      // Initialize the contract with the new signer
      return await this.setContract();
    } catch (error) {
      console.error("Error setting signer:", error);
      return { success: false, error: error.message };
    }
  }

  async setProvider(provider) {
    try {
      this.provider = provider;
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      this.signer = ethersProvider.getSigner();

      // Set up provider event listeners
      this.provider.on("accountsChanged", (accounts) => {
        window.location.reload();
      });

      this.provider.on("chainChanged", () => {
        window.location.reload();
      });

      this.provider.on("disconnect", () => {
        this.disconnectWallet();
      });

      // Initialize the contract with the new signer
      return await this.setContract();
    } catch (error) {
      console.error("Error setting provider:", error);
      return { success: false, error: error.message };
    }
  }

  async connectWallet() {
    try {
      // Connect to the provider
      this.provider = await this.web3Modal.connect();

      // Set up the provider and signer
      const result = await this.setProvider(this.provider);
      if (!result.success) {
        throw new Error(result.error);
      }

      // Get user's address
      const address = await this.signer.getAddress();

      return { success: true, address };
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return { success: false, error: error.message };
    }
  }

  async disconnectWallet() {
    try {
      await this.web3Modal.clearCachedProvider();
      this.provider = null;
      this.signer = null;
      this.contract = null;
      return { success: true };
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      return { success: false, error: error.message };
    }
  }

  async getBalance(address) {
    try {
      if (!this.contract) {
        throw new Error("Contract not initialized");
      }
      const balance = await this.contract.balanceOf(address);
      return { success: true, balance: ethers.utils.formatEther(balance) };
    } catch (error) {
      console.error("Error getting balance:", error);
      return { success: false, error: error.message };
    }
  }

  async rewardSolver(solverAddress, amount) {
    try {
      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      // Convert amount to wei (1 token = 10^18 wei)
      const amountInWei = ethers.utils.parseEther(amount.toString());

      // Call the contract function
      const tx = await this.contract.rewardSolver(solverAddress, amountInWei);
      await tx.wait();

      return { success: true, transactionHash: tx.hash };
    } catch (error) {
      console.error("Error rewarding solver:", error);
      return { success: false, error: error.message };
    }
  }

  async transferTokens(toAddress, amount) {
    try {
      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const amountInWei = ethers.utils.parseEther(amount.toString());
      const tx = await this.contract.transfer(toAddress, amountInWei);
      await tx.wait();

      return { success: true, transactionHash: tx.hash };
    } catch (error) {
      console.error("Error transferring tokens:", error);
      return { success: false, error: error.message };
    }
  }
}

export default new Web3Service();
