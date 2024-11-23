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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Redeemed History</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg shadow-sm"
                  >
                    <p className="text-lg font-semibold">{item.productName}</p>
                    <p className="text-sm text-gray-600">Points Used: {item.pointsUsed}</p>
                    <p className="text-sm text-gray-600">
                      Redeemed At: {new Date(item.redeemedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">No redeemed history found.</p>
            )}
          </>
        )}

        <button
          onClick={handleBack}
          className="mt-6 bg-green-500 text-white py-2 px-4 rounded-lg w-full hover:bg-green-600 transition-all"
        >
          Back to Privilege Card
        </button>
      </div>
    </div>
  );
};

export default RedeemedHistoryPage;
