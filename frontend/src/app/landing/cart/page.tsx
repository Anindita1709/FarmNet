"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { cart, removeFromCart } = useCart(); // ✅ use "cart"
  const router = useRouter();

  const totalPrice = cart?.reduce(
    (acc: number, item: any) => acc + item.productPrice,
    0
  ) ?? 0; // ✅ fallback to 0 in case cart is undefined

  return (
    <div className="px-10 py-6 font-inter">
      <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>

      {(!cart || cart.length === 0) ? (
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
        <div className="space-y-4">
          {cart.map((item: any) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white rounded-lg p-4 shadow-md"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={
                    Array.isArray(item.productImage)
                      ? item.productImage[0]
                      : item.productImage
                  }
                  alt={item.productName}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h2 className="font-semibold">{item.productName}</h2>
                  <p>₹{item.productPrice}</p>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 font-semibold"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right mt-4 font-bold text-lg">
            Total: ₹{totalPrice}
          </div>

          <div className="text-right">
            <button
              onClick={() => router.push("/landing/checkout")}
              className="bg-black text-white px-4 py-2 rounded-lg mt-2"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
