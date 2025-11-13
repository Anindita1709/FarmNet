"use client";

import { useEffect, useState } from "react";
import Axiosinstance from "../../../../axiosconfig";
import Image from "next/image";
import { SparkleIcon, Edit, Trash2 } from "lucide-react";
import SideBar from "../../../../component/Sidebar";
import toast, { Toaster } from "react-hot-toast";

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
  description?: string;
  category?: string;
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

// ------------------ Add / Edit Product Modal ------------------
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerId: string;
  onProductUpdated: () => void;
  existingProduct?: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  farmerId,
  onProductUpdated,
  existingProduct,
}) => {
  const isEdit = !!existingProduct;

  const [productData, setProductData] = useState<NewProduct>({
    name: existingProduct?.productName || "",
    price: existingProduct?.price?.toString() || "",
    stock: existingProduct?.stock?.toString() || "",
    description: existingProduct?.description || "",
    category: existingProduct?.category || "",
    image: existingProduct?.productImage?.[0] || "",
    userid: farmerId,
  });
  useEffect(() => {
  if (existingProduct) {
    setProductData({
      name: existingProduct.productName || "",
      price: existingProduct.price?.toString() || "",
      stock: existingProduct.stock?.toString() || "",
      description: existingProduct.description || "",
      category: existingProduct.category || "",
      image: existingProduct.productImage?.[0] || "",
      userid: farmerId,
    });
  } else {
    // Reset form when adding new product
    setProductData({
      name: "",
      price: "",
      stock: "",
      description: "",
      category: "",
      image: "",
      userid: farmerId,
    });
  }
}, [existingProduct, farmerId]);

const [preview, setPreview] = useState<string | null>(null);

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const Cloudurl = "https://api.cloudinary.com/v1_1/dftwre0on/image/upload";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleImgToCloud = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "User_imges");
    const response = await Axiosinstance.post(Cloudurl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.url;
  };

const handleSubmit = async () => {
  try {
    setIsLoading(true);
    let imageUrl = productData.image;

    // If a new file is uploaded, upload it to Cloudinary
    if (imgFile) imageUrl = await handleImgToCloud(imgFile);

    // Match backend schema exactly
  const finalData = {
  name: productData.name,
  price: Number(productData.price),
  stock: Number(productData.stock),
  description: productData.description,
  category: productData.category,
  image: [imageUrl],
  userid: farmerId,
};



    if (isEdit && existingProduct?._id) {
      console.log("🟡 Final data before update:", finalData);

      await Axiosinstance.put(`/products/updateProduct/${existingProduct._id}`, finalData);
      toast.success("✅ Product updated successfully!");
    } else {
      await Axiosinstance.post("/products/addProduct", finalData);
      toast.success("✅ Product added successfully!");
    }

    onProductUpdated(); // refreshes list
    onClose();
  } catch (error) {
    toast.error("❌ Error saving product");
    console.error("Error:", error);
  } finally {
    setIsLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full backdrop-blur-md flex items-center justify-center z-20"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 w-[50%] rounded-md overflow-y-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "✏️ Edit Product" : "➕ Add Product"}
        </h2>

        <input
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleInputChange}
          className="input-field mb-2 w-full border p-2 rounded"
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={productData.price}
          onChange={handleInputChange}
          className="input-field mb-2 w-full border p-2 rounded"
        />
        <input
          name="stock"
          placeholder="Stock"
          type="number"
          value={productData.stock}
          onChange={handleInputChange}
          className="input-field mb-2 w-full border p-2 rounded"
        />
        <input
          name="description"
          placeholder="Description"
          value={productData.description}
          onChange={handleInputChange}
          className="input-field mb-2 w-full border p-2 rounded"
        />
        <input
          name="category"
          placeholder="Category"
          value={productData.category}
          onChange={handleInputChange}
          className="input-field mb-2 w-full border p-2 rounded"
        />
       {(preview || productData.image) && (
  <div className="mb-3">
    <p className="text-sm text-gray-600 mb-1">Product Image Preview:</p>
    <img
      src={preview || productData.image}
      alt="Product Preview"
      className="w-32 h-32 object-cover rounded-md border"
    />
  </div>
)}


        <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImgFile(file);
      setPreview(URL.createObjectURL(file)); // preview image instantly
    }
  }}
  className="input-field mb-2 w-full border p-2 rounded"
/>


        <div className="flex justify-end mt-3 gap-2">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-cyan-500 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors duration-300"
          >
            {isLoading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 font-semibold px-5 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ------------------ Product Card ------------------
interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-[250px] hover:shadow-lg transition-shadow duration-300 relative">
      <img
        src={product.productImage?.[0] || "https://via.placeholder.com/150"}
        alt={product.productName}
        className="w-full h-40 object-cover rounded-md"
      />
      <h3 className="text-lg font-semibold mt-2">{product.productName}</h3>
      <p className="text-gray-700 font-medium">₹{product.price}</p>
      <p className="text-sm text-gray-500">Stock: {product.stock}</p>

      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => onEdit(product)}
          className="bg-yellow-400 p-2 rounded-md hover:bg-yellow-500"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="bg-red-500 p-2 rounded-md hover:bg-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// ------------------ Main Page ------------------
const MyProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [farmers, setFarmers] = useState<Farmer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    if (!farmers?._id) return;
    try {
      const res = await Axiosinstance.get(`/products/getProductBySellerId/${farmers._id}`);
      const apiProducts = res.data.product;
      const formatted = apiProducts.map((p: any) => ({
        _id: p._id,
        productName: p.productName,
        price: p.productPrice,
        stock: p.stock,
        productImage: p.productImage,
        description: p.productDescription,
        category: p.productCategory,
      }));
      setProducts(formatted);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await Axiosinstance.delete(`/products/deleteProduct/${id}`);
      toast.success("🗑️ Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      toast.error("❌ Error deleting product");
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const storedFarmer = localStorage.getItem("farmer");
    if (storedFarmer) {
      const parsed = JSON.parse(storedFarmer);
      setFarmers(parsed);
    }
  }, []);

  useEffect(() => {
    if (farmers?._id) fetchProducts();
  }, [farmers]);

  return (
    <div className="flex min-h-screen">
      <Toaster />
      <div className="w-[20%] fixed top-0 left-0 h-screen">
        <SideBar />
      </div>

      <div className="w-[100%] bg-gray-200 min-h-screen p-6 font-inter">
        <h1 className="text-2xl font-bold mb-4">My Products</h1>

        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-cyan-500 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors duration-300 mb-6 flex items-center gap-2"
        >
          <SparkleIcon size={20} />
          Add a Product
        </button>

        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          farmerId={farmers?._id || ""}
          onProductUpdated={fetchProducts}
          existingProduct={selectedProduct}
        />

        <div className="flex flex-wrap gap-4">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProductsPage;
