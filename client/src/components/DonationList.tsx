interface Donation {
  donor: string;
  recipient: string;
  amount: string;
  message: string;
  timestamp: string;
}

interface DonationListProps {
  donations: Donation[];
  userAddress: string;
}

const DonationList = ({ donations, userAddress }: DonationListProps) => {
  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Check if the address is the current user
  const isUserAddress = (address: string) => {
    return userAddress && address.toLowerCase() === userAddress.toLowerCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
      {donations.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No donations yet. Be the first to donate!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {donations.map((donation, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm text-gray-500">From:</span>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      isUserAddress(donation.donor)
                        ? "text-purple-600"
                        : "text-gray-900"
                    }`}
                  >
                    {isUserAddress(donation.donor)
                      ? "You"
                      : formatAddress(donation.donor)}
                  </span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {parseFloat(donation.amount).toFixed(4)} ETH
                </div>
              </div>

              <div className="mb-2">
                <span className="text-sm text-gray-500">To:</span>
                <span
                  className={`ml-2 text-sm font-medium ${
                    isUserAddress(donation.recipient)
                      ? "text-purple-600"
                      : "text-gray-900"
                  }`}
                >
                  {isUserAddress(donation.recipient)
                    ? "You"
                    : formatAddress(donation.recipient)}
                </span>
              </div>

              {donation.message && (
                <div className="mt-2 text-sm italic text-gray-600 p-2 bg-gray-100 rounded">
                  "{donation.message}"
                </div>
              )}

              <div className="mt-2 text-xs text-gray-400">
                {donation.timestamp}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationList;
