import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllRewardsPage = () => {
  const [rewards, setRewards] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllRewards = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/get-all-reward`);
        if (response.data.success) {
          setRewards(response.data.products);
          setFilteredRewards(response.data.products);
        } else {
          setError(response.data.message || "No rewards available.");
        }
      } catch (err) {
        console.error("Error fetching rewards:", err);
        setError("Failed to fetch rewards. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllRewards();
  }, []);

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filtered = rewards.filter((reward) =>
        reward.productName.toLowerCase().includes(query)
      );
      setFilteredRewards(filtered);
    } else {
      setFilteredRewards(rewards);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-300 via-green-100 to-green-50">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">All Rewards</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for rewards..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Rewards List */}
            <div className="space-y-4">
              {filteredRewards.length > 0 ? (
                filteredRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition-all"
                  >
                    <div>
                      <p className="text-lg font-medium text-gray-800">{reward.productName}</p>
                      <p className="text-sm text-gray-600">Points: {reward.point}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No rewards match your search.</p>
              )}
            </div>
          </>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate("/prvcard")}
          className="mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-full shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 w-full font-medium"
        >
          Back to PRV Card
        </button>
      </div>
    </div>
  );
};

export default AllRewardsPage;
