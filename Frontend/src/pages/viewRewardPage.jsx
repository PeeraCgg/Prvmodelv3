import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { getLineUserId } from "../utils/storage";

const ViewRewardPage = () => {
  const navigate = useNavigate();
  const [maxPoints, setMaxPoints] = useState(0);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const lineUserId = getLineUserId();

      if (!lineUserId) {
        Swal.fire("Error", "Line User ID is missing. Please log in again.", "error").then(() => {
          navigate("/");
        });
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/get-products`, {
          params: { lineUserId },
        });

        if (response.data.products) {
          setMaxPoints(response.data.maxPoints);

          // Categorize products
          const redeemable = response.data.products.filter((p) => p.isRedeemable);
          const nonRedeemable = response.data.products.filter((p) => !p.isRedeemable);
          const allProducts = [...redeemable, ...nonRedeemable];

          setProducts(allProducts);
          setFilteredProducts(allProducts);
        } else {
          setError(response.data.message || "No products available.");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearch(searchValue);
    setFilteredProducts(
      products.filter((product) =>
        product.productName.toLowerCase().includes(searchValue)
      )
    );
  };

  const handleRedeem = async (productId, productName) => {
    const confirmation = await Swal.fire({
      title: `Redeem "${productName}"?`,
      text: "Are you sure? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34d399",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, redeem it!",
    });

    if (confirmation.isConfirmed) {
      const lineUserId = getLineUserId();

      if (!lineUserId) {
        Swal.fire("Error", "Line User ID is missing. Please log in again.", "error").then(() => {
          navigate("/");
        });
        return;
      }

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/redeem-product`, {
          lineUserId,
          productId,
        });

        if (response.status === 200) {
          Swal.fire("Redeemed!", response.data.message || "Product redeemed successfully!", "success");
          setMaxPoints(response.data.remainingPoints);
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== productId)
          );
          setFilteredProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== productId)
          );
        } else {
          Swal.fire("Error", response.data.error || "Failed to redeem product.", "error");
        }
      } catch (error) {
        console.error("Error redeeming product:", error);
        Swal.fire("Error", "Failed to redeem product. Please try again.", "error");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#D3F1DF]">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center text-[#5A6C57]">
          Available Products
        </h1>
  
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="mb-4 text-center">
              <p className="text-sm sm:text-lg font-semibold text-[#5A6C57]">
                Your Points: {maxPoints}
              </p>
            </div>
            <div className="mb-6">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search for a product..."
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#85A98F]"
              />
            </div>
            <div className="space-y-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`flex justify-between items-center p-4 border rounded-lg shadow-sm ${
                      product.isRedeemable ? "bg-[#F5F9F5]" : "bg-gray-100"
                    } hover:bg-[#F2F5F2] transition-all`}
                  >
                    <div>
                      <p className="text-sm sm:text-base font-medium text-[#5A6C57]">
                        {product.productName}
                      </p>
                      <p className="text-xs sm:text-sm text-[#525B44]">
                        Points: {product.point}
                      </p>
                    </div>
                    {product.isRedeemable ? (
                      <button
                        onClick={() => handleRedeem(product.id, product.productName)}
                        className="bg-gradient-to-r from-[#85A98F] to-[#5A6C57] text-white py-1 px-3 rounded-full hover:from-[#5A6C57] hover:to-[#85A98F] transition-all text-xs sm:text-sm"
                      >
                        Redeem
                      </button>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500">Not enough points</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No products match your search.
                </p>
              )}
            </div>
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => navigate("/prvcard")}
                className="bg-gradient-to-r from-[#85A98F] to-[#5A6C57] text-white py-2 px-4 rounded-full shadow-md hover:from-[#5A6C57] hover:to-[#85A98F] transition-all text-sm sm:text-base"
              >
                Back to PRV Card
              </button>
              <button
                onClick={() => navigate("/redeemedhistory")}
                className="bg-gray-400 text-white py-2 px-4 rounded-full shadow-md hover:bg-gray-500 transition-all text-sm sm:text-base"
              >
                View History
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
  
};

export default ViewRewardPage;
