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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-300 via-green-100 to-green-50">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Available Products</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="mb-4 text-center">
              <p className="text-lg font-semibold text-gray-800">Your Points: {maxPoints}</p>
            </div>
            <div className="mb-6">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search for a product..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="space-y-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`flex justify-between items-center p-4 border rounded-lg shadow-sm ${
                      product.isRedeemable ? "bg-green-50" : "bg-gray-100"
                    }`}
                  >
                    <div>
                      <p className="text-lg font-medium text-gray-800">{product.productName}</p>
                      <p className="text-sm text-gray-600">Points: {product.point}</p>
                    </div>
                    {product.isRedeemable ? (
                      <button
                        onClick={() => handleRedeem(product.id, product.productName)}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white py-1 px-3 rounded-full hover:from-green-600 hover:to-green-700 transition-all"
                      >
                        Redeem
                      </button>
                    ) : (
                      <p className="text-gray-500">Not enough points</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No products match your search.</p>
              )}
            </div>
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => navigate("/prvcard")}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-full hover:from-green-600 hover:to-green-700 transition-all"
              >
                Back to PRV Card
              </button>
              <button
                onClick={() => navigate("/redeemedhistory")}
                className="bg-gray-400 text-white py-2 px-4 rounded-full hover:bg-gray-500 transition-all"
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
