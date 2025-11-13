// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductTracking {
    struct Product {
        uint256 id;
        string name;
        string origin;
        address farmer;
        address consumer;
        bool delivered;
        string currentLocation;
        string status; // "Harvested", "In Transit", "Delivered"
        uint256 timestamp;
    }

    uint256 public productCount;
    mapping(uint256 => Product) public products;

    event ProductAdded(uint256 id, string name, string origin, address indexed farmer);
    event ProductUpdated(uint256 id, string location, string status, address indexed updater);
    event ProductDelivered(uint256 id, address indexed consumer);

    function addProduct(string memory _name, string memory _origin) public {
        require(bytes(_name).length > 0, "Product name required");
        require(bytes(_origin).length > 0, "Product origin required");

        productCount++;
        products[productCount] = Product({
            id: productCount,
            name: _name,
            origin: _origin,
            farmer: msg.sender,
            consumer: address(0),
            delivered: false,
            currentLocation: _origin,
            status: "Harvested",
            timestamp: block.timestamp
        });

        emit ProductAdded(productCount, _name, _origin, msg.sender);
    }

    function updateProduct(uint256 _id, string memory _location, string memory _status) public {
        Product storage product = products[_id];
        require(product.farmer == msg.sender, "Only farmer can update");
        product.currentLocation = _location;
        product.status = _status;
        product.timestamp = block.timestamp;
        emit ProductUpdated(_id, _location, _status, msg.sender);
    }

    function markDelivered(uint256 _id, address _consumer) public {
        Product storage product = products[_id];
        require(product.farmer == msg.sender, "Only farmer can mark delivered");
        product.consumer = _consumer;
        product.delivered = true;
        product.status = "Delivered";
        emit ProductDelivered(_id, _consumer);
    }

    function getProduct(uint256 _id) public view returns (Product memory) {
        require(_id > 0 && _id <= productCount, "Invalid product ID");
        return products[_id];
    }
}
