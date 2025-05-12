interface ConnectWalletProps {
  account: string;
  balance: string;
  handleConnect: () => void;
}

const ConnectWallet = ({
  account,
  balance,
  handleConnect,
}: ConnectWalletProps) => {
  // Format account address for display (0x1234...5678)
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="flex items-center space-x-4">
      {account ? (
        <div className="flex items-center bg-white bg-opacity-20 rounded-lg p-2 shadow-sm">
          <div className="mr-3">
            <div className="text-sm font-medium">{formatAddress(account)}</div>
            <div className="text-xs">
              {Number.parseFloat(balance).toFixed(4)} ETH
            </div>
          </div>
          <div className="h-2 w-2 bg-green-400 rounded-full"></div>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="bg-white text-purple-600 hover:bg-purple-100 font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
          aria-label="Connect Wallet"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
