// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FarmNetOrder {
    struct Order {
        uint256 id;
        address buyer;
        address farmer;
        string productName;
        uint256 amount;
        uint256 timestamp;
        string status; // "Placed", "Delivered", etc.
    }

    uint256 public orderCount;
    mapping(uint256 => Order) public orders;

    event OrderPlaced(
        uint256 id,
        address indexed buyer,
        address indexed farmer,
        string productName,
        uint256 amount,
        uint256 timestamp
    );

    event OrderStatusUpdated(uint256 indexed id, string status);

    function placeOrder(address _farmer, string memory _productName, uint256 _amount) public {
        require(_farmer != address(0), "Invalid farmer address");
        require(_amount > 0, "Amount must be greater than zero");

        orderCount++;
        orders[orderCount] = Order({
            id: orderCount,
            buyer: msg.sender,
            farmer: _farmer,
            productName: _productName,
            amount: _amount,
            timestamp: block.timestamp,
            status: "Placed"
        });

        emit OrderPlaced(orderCount, msg.sender, _farmer, _productName, _amount, block.timestamp);
    }

    function updateOrderStatus(uint256 _id, string memory _status) public {
        Order storage order = orders[_id];
        require(order.farmer == msg.sender, "Only farmer can update status");
        order.status = _status;
        emit OrderStatusUpdated(_id, _status);
    }

    function getOrder(uint256 _id) public view returns (Order memory) {
        require(_id > 0 && _id <= orderCount, "Invalid order ID");
        return orders[_id];
    }
}
