import React, { useState } from "react";
import { ethers } from "ethers";

interface DonationFormProps {
  handleDonate: (recipient: string, amount: string, message: string) => void;
  isConnected: boolean;
}

interface FormErrors {
  recipient?: string;
  amount?: string;
}

const DonationForm = ({ handleDonate, isConnected }: DonationFormProps) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: { [key: string]: any } = {};

    if (!recipient) {
      newErrors.recipient = "Recipient address is required";
    } else if (!ethers.isAddress(recipient)) {
      newErrors.recipient = "Invalid Ethereum address";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (validateForm()) {
      handleDonate(recipient, amount, message);
      // Clear form
      setRecipient("");
      setAmount("");
      setMessage("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="recipient"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.recipient ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0x..."
            disabled={!isConnected}
            aria-label="Recipient Ethereum Address"
            tabIndex={0}
          />
          {errors.recipient && (
            <p className="text-red-500 text-xs mt-1">{errors.recipient}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Amount (ETH)
          </label>
          <div className="relative">
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.amount ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.01"
              disabled={!isConnected}
              aria-label="Donation Amount in ETH"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">ETH</span>
            </div>
          </div>
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Message (optional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Add a personal message..."
            rows={3}
            disabled={!isConnected}
            aria-label="Optional Message for Recipient"
          ></textarea>
        </div>

        <button
          type="submit"
          className={`w-full py-3 font-bold rounded-lg text-white ${
            isConnected
              ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isConnected}
          aria-label="Send Donation"
          tabIndex={isConnected ? 0 : -1}
        >
          {isConnected ? "Send Donation" : "Connect Wallet to Donate"}
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
