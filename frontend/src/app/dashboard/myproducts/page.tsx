"use client";

import { useEffect, useState } from "react";
import Axiosinstance from "../../../../axiosconfig";
import Image from "next/image";
import { SparkleIcon } from "lucide-react";
import SideBar from "../../../../component/Sidebar";

// ------------------ Types ------------------
interface Farmer {
  _id: string;
  name: string;
  email?: string;
}

interface Product {
  _id: string;
  productName: string;
  stock: number;
  productImage: string[];
  price?: number;
}

interface NewProduct {
  name: string;
  price: string;
  stock: string;
  description: string;
  category: string;
  image: string;
  userid: string;
}

// ------------------ Add Product Modal ------------------
interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerId: string;
  onProductAdded: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, farmerId, onProductAdded }) => {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    image: "",
    userid: farmerId,
  });

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const Cloudurl = "https://api.cloudinary.com/v1_1/dftwre0on/image/upload";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleImgToCloud = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "User_imges");
    const response = await Axiosinstance.post(Cloudurl, formData, { headers: { "Content-Type": "multipart/form-data" } });
    return response.data.url;
  };

  const handleFairPrice = async () => {
    if (!newProduct.name) return;
    setIsLoading(true);
    try {
      const res = await Axiosinstance.post("/generate-price", { name: newProduct.name });
      setResult(JSON.parse(res.data));
    } catch (error) {
      console.error("Error fetching fair price", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = "";
      if (imgFile) {
        imageUrl = await handleImgToCloud(imgFile);
      }

      const productData: NewProduct = {
        ...newProduct,
        image: imageUrl,
        userid: farmerId,
      };

      await Axiosinstance.post("/products/addProduct", productData);
      onProductAdded();
      onClose();
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full backdrop-blur-md flex items-center justify-center z-20"
      onClick={onClose}
    >
      <div className="bg-white p-6 w-[50%] rounded-md overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Add Product</h2>

        <input name="name" placeholder="Product Name" onChange={handleInputChange} className="input-field mb-2" />
        <input name="price" placeholder="Price" type="number" onChange={handleInputChange} className="input-field mb-2" />
        <input name="stock" placeholder="Stock" type="number" onChange={handleInputChange} className="input-field mb-2" />
        <input name="description" placeholder="Description" onChange={handleInputChange} className="input-field mb-2" />
        <input name="category" placeholder="Category" onChange={handleInputChange} className="input-field mb-2" />
        <input type="file" onChange={(e) => e.target.files && setImgFile(e.target.files[0])} className="input-field mb-2" />

        {result && (
          <div className="bg-green-100 p-2 my-2 rounded">
            <p>{result.description}</p>
            <p>Price: {result.price} RS/Quintal</p>
            <p>Price: {result.price / 100} RS/KG</p>
          </div>
        )}

        <div className="flex gap-2 items-center mt-2">
          <button
            onClick={handleFairPrice}
            className="bg-yellow-400 text-white font-semibold px-3 py-1 rounded-md shadow hover:bg-yellow-500 transition-colors duration-300 flex items-center gap-1"
          >
            <SparkleIcon size={16} />
            {isLoading ? "Analysing..." : "Get Fair Price"}
          </button>

          <button
            onClick={handleSubmit}
            className="bg-cyan-500 text-white font-semibold px-4 py-1 rounded-md shadow hover:bg-cyan-600 transition-colors duration-300"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

// ------------------ Product Card ------------------
const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center w-40 hover:shadow-xl transition-shadow duration-300">
    <Image
      src={product.productImage[0]}
      alt={product.productName}
      width={120}
      height={120}
      className="object-cover w-28 h-28 border-2 border-gray-200 rounded-lg mb-2"
    />
    <h3 className="font-semibold text-md text-gray-800 text-center">{product.productName}</h3>
    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
  </div>
);

// ------------------ Main Page ------------------
const MyProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedFarmer = localStorage.getItem("farmer");
    if (storedFarmer) setFarmer(JSON.parse(storedFarmer));
  }, []);

  const fetchProducts = async () => {
    if (!farmer) return;
    try {
      const res = await Axiosinstance.get(`/products/getProductBySellerId/${farmer._id}`);
      setProducts(res.data.product);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [farmer]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[20%] fixed top-0 left-0 h-screen">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className=" w-[100%] bg-gray-200 min-h-screen p-6 font-inter">
        <h1 className="text-2xl font-bold mb-4">My Products</h1>

        {/* Add Product Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors duration-300 mb-6 flex items-center gap-2"
        >
          <SparkleIcon size={20} />
          Add a Product
        </button>

        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          farmerId={farmer?._id || ""}
          onProductAdded={fetchProducts}
        />

        {/* Products Grid */}
        <div className="flex flex-wrap gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProductsPage;
