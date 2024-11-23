import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getLineUserId } from "../utils/storage";

const ViewRewardPage = () => {
  const navigate = useNavigate();
  const [maxPoints, setMaxPoints] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const lineUserId = getLineUserId();

      if (!lineUserId) {
        alert("Line User ID is missing. Please log in again.");
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/get-products`, {
          params: { lineUserId },
        });
        if (response.status === 204) {
            // If no products, navigate to prvcard
            alert("No products available for your points.");
            navigate("/prvcard");
            return;
          }

        if (response.data.products) {
          setMaxPoints(response.data.maxPoints);
          setProducts(response.data.products);
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

  const handleRedeem = async (productId) => {
    const lineUserId = getLineUserId();

    if (!lineUserId) {
      alert("Line User ID is missing. Please log in again.");
      navigate("/");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/redeem-product`, {
        lineUserId,
        productId,
      });

      if (response.status === 200) {
        alert(response.data.message || "Product redeemed successfully!");
        setMaxPoints(response.data.remainingPoints);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      } else {
        alert(response.data.error || "Failed to redeem product.");
      }
    } catch (error) {
      console.error("Error redeeming product:", error);
      alert("Failed to redeem product. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Available Products</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-lg font-semibold">Your Points: {maxPoints}</p>
            </div>
            <div>
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center p-4 mb-4 border rounded-lg shadow-sm"
                  >
                    <div>
                      <p className="text-lg font-semibold">{product.productName}</p>
                      <p className="text-sm text-gray-600">Points: {product.point}</p>
                    </div>
                    <button
                      onClick={() => handleRedeem(product.id)}
                      className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition"
                    >
                      Redeem
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center">No products available for redemption.</p>
              )}
            </div>
            {/* Buttons to navigate to prvcard and historyredeem */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => navigate("/prvcard")}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Back to PRV Card
              </button>
              <button
                onClick={() => navigate("/redeemedhistory")}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
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
