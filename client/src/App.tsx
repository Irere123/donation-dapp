import { useState, useEffect } from "react";
import { ethers } from "ethers";
import DonationArtifact from "./artifacts/contracts/Donation.sol/Donation.json";
import ConnectWallet from "./components/ConnectWallet";
import DonationForm from "./components/DonationForm";
import DonationList from "./components/DonationList";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [balance, setBalance] = useState("0");

  // Initialize ethers and contract
  useEffect(() => {
    const init = async () => {
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);

          // Get network
          const network = await provider.getNetwork();
          if (network.chainId.toString() !== "11155111") {
            // Sepolia network ID
            alert("Please connect to Sepolia Testnet");
            setLoading(false);
            return;
          }

          // Set contract address - should be updated after deployment
          const contractAddress = "0xYourDeployedContractAddressHere";
          const donationContract = new ethers.Contract(
            contractAddress,
            DonationArtifact.abi,
            provider
          );
          setContract(donationContract);

          // Listen for account changes
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              handleConnect();
            } else {
              setAccount("");
              setSigner(null);
            }
          });
        } else {
          alert("Please install MetaMask to use this dApp");
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
      setLoading(false);
    };

    init();
  }, []);

  // Connect wallet function
  const handleConnect = async () => {
    try {
      setLoading(true);

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      setAccount(account);

      const signer = await provider.getSigner();
      setSigner(signer);

      // Get account balance
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));

      // Load donations
      await loadDonations();

      setLoading(false);
    } catch (error) {
      console.error("Connection error:", error);
      setLoading(false);
    }
  };

  // Load all donations
  const loadDonations = async () => {
    if (contract) {
      try {
        // Get donations count
        const count = await contract.getDonationsCount();
        const donationsArray = [];

        // Get all donations
        for (let i = 0; i < count; i++) {
          const donation = await contract.getDonation(i);
          donationsArray.push({
            donor: donation[0],
            recipient: donation[1],
            amount: ethers.formatEther(donation[2]),
            timestamp: new Date(Number(donation[3]) * 1000).toLocaleString(),
            message: donation[4],
          });
        }

        setDonations(donationsArray.reverse()); // Show newest first
      } catch (error) {
        console.error("Error loading donations:", error);
      }
    }
  };

  // Handle donation submission
  const handleDonate = async (recipientAddress, amount, message) => {
    if (!signer || !contract) return;

    try {
      setLoading(true);

      // Create contract with signer for write operations
      const contractWithSigner = contract.connect(signer);

      // Send donation transaction
      const tx = await contractWithSigner.donate(recipientAddress, message, {
        value: ethers.parseEther(amount),
      });

      // Wait for transaction to be mined
      await tx.wait();

      // Reload donations and update balance
      await loadDonations();
      const newBalance = await provider.getBalance(account);
      setBalance(ethers.formatEther(newBalance));

      setLoading(false);
    } catch (error) {
      console.error("Donation error:", error);
      setLoading(false);
      alert("Error making donation: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r p-6">
        <div className="container mx-auto flex items-center justify-between">
          <ConnectWallet
            account={account}
            balance={balance}
            handleConnect={handleConnect}
          />
        </div>
      </header>

      <main className="container mx-auto my-8 px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Make a Donation</h2>
              <DonationForm
                handleDonate={handleDonate}
                isConnected={!!account}
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Recent Donations</h2>
              <DonationList donations={donations} userAddress={account} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
