"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Axiosinstance from "../../../../axiosconfig";

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
  const [seller, setSeller] = useState<Seller | null>(null);
  const router = useRouter();

  // ---------------- Fetch Product ----------------
  const fetchProduct = async () => {
    try {
      const res = await Axiosinstance.get(`/products/getProductById/${id}`);
      const product: Product = res.data.product;
      setProductdetails(product);
      console.log("✅ Product:", product);

      if (product?.sellerId) {
        fetchSeller(product.sellerId);
      }
    } catch (error) {
      console.error("❌ Error fetching product:", error);
    }
  };

  // ---------------- Fetch Seller ----------------
  const fetchSeller = async (sellerId: string) => {
    try {
      const res = await Axiosinstance.get(`products/getSellerDetails/${sellerId}`);
      const farmer: Seller = res.data.farmer;
      setSeller(farmer);
      console.log("✅ Seller:", farmer);
    } catch (error) {
      console.error("❌ Error fetching seller:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

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
                <button className="bg-green-600 text-white px-2 py-1 rounded-lg">
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
