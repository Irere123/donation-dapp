// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Donation {
    address public owner;
    
    // Structure to store donation information
    struct DonationInfo {
        address donor;
        address recipient;
        uint256 amount;
        uint256 timestamp;
        string message;
    }
    
    // Array to store all donations
    DonationInfo[] public donations;
    
    // Mapping to track total donations received by each address
    mapping(address => uint256) public totalDonationsReceived;
    
    // Events
    event DonationSent(address indexed donor, address indexed recipient, uint256 amount, string message, uint256 timestamp);
    
    constructor() {
        owner = msg.sender;
    }
    
    // Function to donate to someone
    function donate(address _recipient, string memory _message) external payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(_recipient != address(0), "Invalid recipient address");
        require(_recipient != msg.sender, "Cannot donate to yourself");
        
        // Update the recipient's total received donations
        totalDonationsReceived[_recipient] += msg.value;
        
        // Store donation information
        donations.push(DonationInfo({
            donor: msg.sender,
            recipient: _recipient,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        }));
        
        // Transfer the ETH to the recipient
        (bool success, ) = _recipient.call{value: msg.value}("");
        require(success, "Transfer failed");
        
        // Emit donation event
        emit DonationSent(msg.sender, _recipient, msg.value, _message, block.timestamp);
    }
    
    // Function to get the number of donations
    function getDonationsCount() external view returns (uint256) {
        return donations.length;
    }
    
    // Function to get donation by index
    function getDonation(uint256 _index) external view returns (
        address donor,
        address recipient,
        uint256 amount,
        uint256 timestamp,
        string memory message
    ) {
        require(_index < donations.length, "Donation does not exist");
        DonationInfo memory donation = donations[_index];
        return (
            donation.donor,
            donation.recipient,
            donation.amount,
            donation.timestamp,
            donation.message
        );
    }
    
    // Function to get all donations
    function getAllDonations() external view returns (DonationInfo[] memory) {
        return donations;
    }
} 