import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getLineUserId } from "../utils/storage";

const RedeemedHistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRedeemedHistory = async () => {
      const lineUserId = getLineUserId();

      if (!lineUserId) {
        alert("Line User ID is missing. Please log in again.");
        navigate("/");
        return;
      }

      try {
        // Fetch redeemed history from the backend
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/redeem-history-user`, {
          params: { lineUserId },
        });

        if (response.data.history) {
          setHistory(response.data.history);
        } else {
          setError(response.data.message || "No redeemed history found.");
        }
      } catch (err) {
        console.error("Error fetching redeemed history:", err);
        setError("Failed to fetch redeemed history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRedeemedHistory();
  }, [navigate]);

  const handleBack = () => {
    navigate("/prvcard"); // Navigate back to prvcard page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D3F1DF]">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center text-[#5A6C57]">
          Redeemed History
        </h1>
  
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg shadow-sm bg-[#F9F9F9] hover:bg-[#F5F5F5] transition-all"
                  >
                    <p className="text-sm sm:text-base font-medium text-[#5A6C57]">
                      {item.productName}
                    </p>
                    <p className="text-xs sm:text-sm text-[#525B44]">
                      Points Used: {item.pointsUsed}
                    </p>
                    <p className="text-xs sm:text-sm text-[#525B44]">
                      Redeemed At: {new Date(item.redeemedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No redeemed history found.</p>
            )}
          </>
        )}
  
        <button
          onClick={handleBack}
          className="mt-6 bg-gradient-to-r from-[#85A98F] to-[#5A6C57] text-white py-2 sm:py-3 px-4 rounded-full shadow-md hover:from-[#5A6C57] hover:to-[#85A98F] transition-all duration-300 w-full text-sm sm:text-base font-medium"
        >
          Back to Privilege Card
        </button>
      </div>
    </div>
  );
  
};

export default RedeemedHistoryPage;
