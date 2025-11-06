"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const totalPrice =
    cart?.reduce((acc: number, item: any) => acc + item.productPrice, 0) ?? 0;

  const deliveryFee = 40;
  const grandTotal = totalPrice + deliveryFee;

  const user = localStorage.getItem("user");
  const userid = user ? JSON.parse(user)._id : null;

  const handlePlaceOrder = async () => {
    if (!userid || !cart?.length) {
      console.error("❌ Missing user or empty cart");
      return;
    }

    try {
      // Loop through all items in cart and send each as an order
      for (const item of cart) {
        await fetch("http://localhost:5000/api/orders/addOrder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userid,
            sellerId: item.sellerId,
            productid: item._id,
            quantity: 1,
            address:
              "Rathinam Tech Park, Pollachi Main Road, Eachanari, Coimbatore, Tamil Nadu 641021",
          }),
        });
      }

      clearCart();
      alert("✅ Order placed successfully!");
      router.push("/landing");
    } catch (error) {
      console.error("❌ Error placing order:", error);
    }
  };

  return (
    <div className="font-inter m-12">
      <h1 className="text-2xl font-bold mb-4">🧾 Checkout</h1>

      {!cart || cart.length === 0 ? (
        <div className="text-gray-600 text-center">
          <p>Your cart is empty.</p>
          <button
            onClick={() => router.push("/landing")}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <>
          <div className="bg-green-100 p-6 rounded-md mb-6">
            {cart.map((item: any) => (
              <div
                key={item._id}
                className="flex justify-between border-b border-gray-300 py-2"
              >
                <div>
                  <h2 className="font-semibold">{item.productName}</h2>
                  <p>₹{item.productPrice}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-100 p-6 rounded-md mb-6">
            <h2 className="text-lg font-bold mb-2">Payment Summary</h2>
            <p>Total Amount: ₹{totalPrice}</p>
            <p>Delivery Fee: ₹{deliveryFee}</p>
            <p className="font-bold text-lg mt-2">
              Grand Total: ₹{grandTotal}
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={handlePlaceOrder}
              className="bg-black rounded-md text-white px-4 py-2"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
