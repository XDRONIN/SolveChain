<template>
  <div class="wallet-container">
    <div v-if="!isConnected" class="connect-section">
      <button @click="connectWallet" class="connect-btn">Connect Wallet</button>
    </div>

    <div v-else class="wallet-info">
      <div class="address-section">
        <span>Connected Address: {{ shortenAddress(walletAddress) }}</span>
        <button @click="disconnectWallet" class="disconnect-btn">
          Disconnect
        </button>
      </div>

      <div class="balance-section">
        <span>Solvecoin Balance: {{ balance }} SOLVE</span>
        <button @click="refreshBalance" class="refresh-btn">Refresh</button>
      </div>

      <div v-if="isAdmin" class="admin-section">
        <h3>Reward User</h3>
        <div class="input-group">
          <input
            v-model="rewardAddress"
            placeholder="User Address"
            class="input-field"
          />
          <input
            v-model="rewardAmount"
            type="number"
            placeholder="Amount"
            class="input-field"
          />
          <button @click="rewardUser" class="reward-btn">Reward</button>
        </div>
      </div>

      <div class="transfer-section">
        <h3>Transfer Tokens</h3>
        <div class="input-group">
          <input
            v-model="transferAddress"
            placeholder="Recipient Address"
            class="input-field"
          />
          <input
            v-model="transferAmount"
            type="number"
            placeholder="Amount"
            class="input-field"
          />
          <button @click="transferTokens" class="transfer-btn">Transfer</button>
        </div>
      </div>
    </div>

    <div v-if="notification" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import web3Service from "../services/web3Service";
import SolvecoinABI from "../assets/Solvecoin.json";

export default {
  name: "WalletConnect",
  data() {
    return {
      isConnected: false,
      walletAddress: "",
      balance: "0",
      isAdmin: false,
      rewardAddress: "",
      rewardAmount: 0,
      transferAddress: "",
      transferAmount: 0,
      notification: null,
      contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
      adminAddress: import.meta.env.VITE_ADMIN_ADDRESS,
    };
  },
  mounted() {
    this.checkConnection();
  },
  methods: {
    async checkConnection() {
      if (web3Service.provider) {
        try {
          const signer = web3Service.signer;
          this.walletAddress = await signer.getAddress();
          this.isConnected = true;
          this.isAdmin =
            this.walletAddress.toLowerCase() ===
            this.adminAddress.toLowerCase();
          this.refreshBalance();
        } catch (error) {
          console.error("Error checking connection:", error);
          // Reset connection state if there's an error
          this.isConnected = false;
          this.walletAddress = "";
        }
      }
    },
    async connectWallet() {
      try {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
          throw new Error("MetaMask is not installed.");
        }

        const result = await web3Service.connectWallet();

        if (!result.success) {
          throw new Error(result.error || "Failed to connect wallet");
        }

        this.walletAddress = result.address;
        this.isConnected = true;
        this.isAdmin =
          this.walletAddress.toLowerCase() === this.adminAddress.toLowerCase();
        this.refreshBalance();

        this.showNotification("Wallet connected!", "success");
      } catch (error) {
        console.error("Error connecting wallet:", error);
        this.showNotification(
          error.message || "Failed to connect wallet",
          "error"
        );
      }
    },
    async disconnectWallet() {
      try {
        const result = await web3Service.disconnectWallet();
        if (result.success) {
          this.isConnected = false;
          this.walletAddress = "";
          this.balance = "0";
          this.showNotification("Wallet disconnected successfully!", "success");
        } else {
          this.showNotification(
            result.error || "Failed to disconnect wallet",
            "error"
          );
        }
      } catch (error) {
        this.showNotification(error.message || "An error occurred", "error");
      }
    },
    async refreshBalance() {
      if (this.isConnected) {
        const result = await web3Service.getBalance(this.walletAddress);
        if (result.success) {
          this.balance = result.balance;
        } else {
          this.showNotification(
            result.error || "Failed to get balance",
            "error"
          );
        }
      }
    },
    async rewardUser() {
      if (!this.isAdmin) {
        this.showNotification("Only admin can reward users", "error");
        return;
      }

      if (!this.rewardAddress || !this.rewardAmount || this.rewardAmount <= 0) {
        this.showNotification("Please enter valid address and amount", "error");
        return;
      }

      try {
        const result = await web3Service.rewardSolver(
          this.rewardAddress,
          this.rewardAmount
        );
        if (result.success) {
          this.showNotification(
            `Rewarded ${this.rewardAmount} SOLVE to ${this.shortenAddress(
              this.rewardAddress
            )}`,
            "success"
          );
          this.rewardAddress = "";
          this.rewardAmount = 0;
          this.refreshBalance();
        } else {
          this.showNotification(
            result.error || "Failed to reward user",
            "error"
          );
        }
      } catch (error) {
        this.showNotification(error.message || "An error occurred", "error");
      }
    },
    async transferTokens() {
      if (
        !this.transferAddress ||
        !this.transferAmount ||
        this.transferAmount <= 0
      ) {
        this.showNotification("Please enter valid address and amount", "error");
        return;
      }

      try {
        const result = await web3Service.transferTokens(
          this.transferAddress,
          this.transferAmount
        );
        if (result.success) {
          this.showNotification(
            `Transferred ${this.transferAmount} SOLVE to ${this.shortenAddress(
              this.transferAddress
            )}`,
            "success"
          );
          this.transferAddress = "";
          this.transferAmount = 0;
          this.refreshBalance();
        } else {
          this.showNotification(
            result.error || "Failed to transfer tokens",
            "error"
          );
        }
      } catch (error) {
        this.showNotification(error.message || "An error occurred", "error");
      }
    },
    shortenAddress(address) {
      return address
        ? `${address.substring(0, 6)}...${address.substring(
            address.length - 4
          )}`
        : "";
    },
    showNotification(message, type) {
      this.notification = { message, type };
      setTimeout(() => {
        this.notification = null;
      }, 5000);
    },
  },
};
</script>

<style scoped>
.wallet-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 16px;
  background: rgba(30, 30, 30, 0.219); /* semi-transparent for glass effect */
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(255, 0, 255, 0.11);
  color: #e0e0e0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.connect-btn,
.disconnect-btn,
.refresh-btn,
.reward-btn,
.transfer-btn {
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin: 5px;
  transition: all 0.3s ease;
  background: rgba(50, 50, 50, 0.7);
  color: #fff;
}

.connect-btn {
  background-color: #e100ff;
  color: #fff;
}

.connect-btn:hover {
  background-color: #e100ff;
  box-shadow: 0 0 12px #e100ff;
}

.disconnect-btn {
  background-color: #770071;
  color: #fff;
}

.disconnect-btn:hover {
  background-color: #770071;
  box-shadow: 0 0 12px #f36dff77;
}

.refresh-btn,
.reward-btn,
.transfer-btn {
  background-color: #333;
  border: 1px solid #e100ff;
  color: #ffb3f3;
}

.refresh-btn:hover,
.reward-btn:hover,
.transfer-btn:hover {
  background-color: #222;
  box-shadow: 0 0 10px #e100ff;
}

.input-field {
  padding: 8px;
  margin: 5px;
  border-radius: 6px;
  border: 1px solid #555;
  background-color: rgba(40, 40, 40, 0.8);
  color: #e0e0e0;
  backdrop-filter: blur(6px);
}

.input-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin: 10px 0;
}

.notification {
  margin-top: 20px;
  padding: 12px;
  border-radius: 6px;
  font-weight: bold;
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.success {
  background-color: rgba(30, 0, 30, 0.4);
  color: #ff00dd;
  border: 1px solid #e100ff;
}

.error {
  background-color: rgba(60, 0, 30, 0.5);
  color: #ff4d88;
  border: 1px solid #ff4d88;
}

.address-section,
.balance-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  color: #ccc;
}

.admin-section,
.transfer-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #444;
}
</style>
