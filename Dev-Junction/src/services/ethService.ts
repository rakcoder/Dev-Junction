import { ethers } from 'ethers';

class EthService {
  private provider: ethers.BrowserProvider | null = null;

  async init() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }

  async getEthPrice(): Promise<number> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      return data.ethereum.usd;
    } catch (error) {
      console.error('Failed to fetch ETH price:', error);
      throw error;
    }
  }

  async convertUSDToETH(usdAmount: number): Promise<string> {
    const ethPrice = await this.getEthPrice();
    const ethAmount = usdAmount / ethPrice;
    return ethers.formatEther(ethers.parseEther(ethAmount.toFixed(18)));
  }

  async sendPayment(toAddress: string, amountInUSD: number): Promise<string> {
    if (!this.provider) {
      throw new Error('MetaMask not initialized');
    }

    try {
      const signer = await this.provider.getSigner();
      const ethAmount = await this.convertUSDToETH(amountInUSD);
      
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(ethAmount)
      });

      return tx.hash;
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    }
  }
}

export const ethService = new EthService();