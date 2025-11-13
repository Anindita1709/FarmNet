import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema({
    userid : {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    },
    productid: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now,
    },

    //  Blockchain Fields
  blockchainTxHash: {
    type: String,
    default: null, // stores the transaction hash after successful on-chain order
  },
  blockchainOrderId: {
    type: Number,
    default: null, // optional - if your smart contract emits an orderId
  },
  verifiedOnBlockchain: {
    type: Boolean,
    default: false, // set true when tx is confirmed
  },
},
  { timestamps: true } // ✅ adds createdAt & updatedAt automatically

);


const orderSchema = mongoose.model('Orders', OrdersSchema);
export default orderSchema;