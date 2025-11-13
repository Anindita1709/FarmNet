"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Axiosinstance from "../../../../axiosconfig";
import { useCart } from "@/context/CartContext";

interface Seller {
  _id: string;
  name: string;
  email: string;
}

interface Product {
  _id: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productImage: string | string[];
  sellerId: string;
}

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const [productdetails, setProductdetails] = useState<Product | null>(null);
  //const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
   const { addToCart } = useCart();

  // ---------------- Fetch Product ----------------
  
 const fetchProduct = async () => {
    try {
      const res = await Axiosinstance.get(`/products/getProductById/${id}`);
      const product: Product = res.data.product;
      setProductdetails(product);
      if (product?.sellerId) await fetchSeller(product.sellerId);
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Fetch Seller ----------------
  
const fetchSeller = async (sellerId: string) => {
    try {
      const res = await Axiosinstance.get(`products/getSellerDetails/${sellerId}`);
      setSeller(res.data.farmer);
    } catch (error) {
      console.error("❌ Error fetching seller:", error);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

   // ---------------- UI States ----------------
  if (loading)
    return <div className="p-10 text-center text-gray-500">Loading product details...</div>;

  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;

  if (!productdetails)
    return <div className="p-10 text-center text-gray-600">No product found.</div>;
  // ---------------- Render ----------------
  return (
    <div className="font-inter">
      <div className="flex px-7 items-center">
        {productdetails && (
          <div className="bg-white flex gap-7 p-4 rounded-lg">
            <img
              src={
                Array.isArray(productdetails.productImage)
                  ? productdetails.productImage[0]
                  : productdetails.productImage
              }
              alt="product"
              className="w-[400px] h-[400px] object-cover rounded-lg"
            />
            <div>
              <h1 className="text-lg font-bold">
                {productdetails.productName}
              </h1>
              <p>{productdetails.productDescription}</p>
              <p>Price: ₹{productdetails.productPrice}</p>
              <p>
                Stock: <span className="text-green-600">In stock</span>
              </p>

              <div className="flex gap-2 mt-3">
                 <button
  onClick={() => {
    const normalizedProduct = {
      ...productdetails,
      productImage: Array.isArray(productdetails.productImage)
        ? productdetails.productImage
        : [productdetails.productImage],
    };
    addToCart(normalizedProduct);
  }}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
>
  Add to Cart
</button>

                <button
                  onClick={() => {
                    router.push(`/landing/checkout/${productdetails._id}`);
                  }}
                  className="bg-black text-white px-2 py-1 rounded-lg"
                >
                  Buy Now
                </button>
              </div>

              {seller && (
                <div className="mt-4">
                  <h1 className="text-lg font-bold">Farmer Details</h1>
                  <p>Name: {seller.name}</p>
                  <p>Email: {seller.email}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
