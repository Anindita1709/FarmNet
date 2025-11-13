import mongoose from "mongoose";
const cartItemSchema = new mongoose.Schema({
  productid: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    walletAddress: {
    type: String,
    unique: true,
    sparse: true // allows some users without it
  },
    cart:[
        [cartItemSchema]
    ],
     // Add notification preferences
  emailNotif: { type: Boolean, default: true },
  smsNotif: { type: Boolean, default: false },
});



const User = mongoose.model('User',userSchema);

export default User;