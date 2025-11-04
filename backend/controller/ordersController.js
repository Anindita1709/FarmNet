import orderSchema from '../model/ordersSchema.js';
import productSchema from '../model/productsSchema.js';

// -------------------- Add Order --------------------
export const addOrder = async (req, res) => {
  try {
    const { userid, sellerId, productid, quantity, address } = req.body;

    const product = await productSchema.findById(productid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const totalAmount = product.productPrice * quantity;

    await orderSchema.create({
      userid,
      productid,
      quantity,
      totalAmount,
      sellerId,
      orderStatus: 'pending',
      address,
      orderDate: new Date(),
    });

    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// -------------------- Get Orders by Farmer --------------------
export const getOrdersByFarmer = async (req, res) => {
  try {
    const { farmerid } = req.params;

    const orders = await orderSchema.find({ sellerId: farmerid });

    const products = await Promise.all(
      orders.map(async (order) => {
        return await productSchema.findById(order.productid);
      })
    );

    res.status(200).json({ orders, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// -------------------- Get Orders by User --------------------
export const getOrders = async (req, res) => {
  try {
    const { userid } = req.params;
    const orders = await orderSchema.find({ userid });
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// -------------------- Update Order Status --------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await orderSchema.findByIdAndUpdate(id, { orderStatus: status });

    res.status(200).json({ message: "Order status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
