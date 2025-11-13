// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OrderVerifier {
    mapping(string => bool) public verifiedOrders;

    event OrderVerified(address indexed verifier, string orderId, string details);

    function verifyOrder(string memory orderId, string memory details) public {
        require(!verifiedOrders[orderId], "Order already verified");
        verifiedOrders[orderId] = true;
        emit OrderVerified(msg.sender, orderId, details);
    }

    function isVerified(string memory orderId) public view returns (bool) {
        return verifiedOrders[orderId];
    }
}
